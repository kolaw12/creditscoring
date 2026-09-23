import { nanoid } from "nanoid";
import prisma from "../../database";
import { getPaymentProvider } from "../payments/providers/paystack.provider";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import logger from "../../utils/logger";

const provider = getPaymentProvider();

export class PayoutService {
  async initiatePayout(loanId: string, adminUserId: string) {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        offer: {
          include: {
            application: {
              include: { landlord: true },
            },
          },
        },
      },
    });

    if (!loan) throw new NotFoundError("Loan not found");
    if (loan.status !== "approved" && loan.status !== "offer_accepted") {
      throw new BadRequestError("Loan must be approved before disbursement");
    }

    const landlord = loan.offer.application.landlord;
    if (!landlord) throw new BadRequestError("No landlord associated with this application");

    // Check if payout already exists
    const existingPayout = await prisma.landlordPayout.findFirst({
      where: { loanId, status: { in: ["pending", "processing", "successful"] } },
    });
    if (existingPayout) {
      throw new BadRequestError("Payout already initiated for this loan");
    }

    const reference = `payout_${nanoid(16)}`;
    const amountKobo = Math.round(Number(loan.principalAmount) * 100);

    // Create or get transfer recipient
    let recipientCode: string;
    if (landlord.bankName && landlord.bankAccountNumber) {
      // In production, look up bank code from bank name
      const bankCode = "044"; // Default to Access Bank for demo
      const recipient = await provider.createTransferRecipient({
        type: "nuban",
        name: `${landlord.firstName} ${landlord.lastName}`,
        account_number: landlord.bankAccountNumber,
        bank_code: bankCode,
      });
      recipientCode = recipient.data.recipient_code;
    } else {
      throw new BadRequestError("Landlord bank details not available for payout");
    }

    // Initiate transfer
    const transfer = await provider.initiateTransfer({
      amount: amountKobo,
      recipient: recipientCode,
      reference,
      reason: `Rent disbursement for loan ${loan.loanNumber}`,
    });

    // Create payout record
    const payout = await prisma.landlordPayout.create({
      data: {
        loanId,
        landlordId: landlord.id,
        amount: Number(loan.principalAmount),
        status: "processing",
        provider: provider.name,
        providerReference: reference,
      },
    });

    // Update loan status
    await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: "active",
        disbursementDate: new Date(),
      },
    });

    // Loan status history
    await prisma.loanStatusHistory.create({
      data: {
        loanId,
        fromStatus: loan.status as any,
        toStatus: "active",
        changedBy: adminUserId,
        note: "Disbursement initiated",
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: "payout_initiate",
        entity: "landlord_payout",
        entityId: payout.id,
        after: { reference, amount: Number(loan.principalAmount) } as any,
      },
    });

    logger.info("Payout initiated", { payoutId: payout.id, loanId, reference });

    return payout;
  }

  async getAllPayouts(filters: { page?: number; limit?: number; status?: string }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;

    const [payouts, total] = await Promise.all([
      prisma.landlordPayout.findMany({
        where,
        include: {
          loan: { select: { loanNumber: true, principalAmount: true } },
          landlord: { select: { firstName: true, lastName: true, bankName: true, bankAccountNumber: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.landlordPayout.count({ where }),
    ]);

    return {
      data: payouts,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getPayout(payoutId: string) {
    const payout = await prisma.landlordPayout.findUnique({
      where: { id: payoutId },
      include: {
        loan: { select: { loanNumber: true, principalAmount: true } },
        landlord: true,
      },
    });
    if (!payout) throw new NotFoundError("Payout not found");
    return payout;
  }
}

export const payoutService = new PayoutService();
