import { nanoid } from "nanoid";
import prisma from "../../database";
import { getPaymentProvider } from "./providers/paystack.provider";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import logger from "../../utils/logger";

const provider = getPaymentProvider();

export class PaymentService {
  async initializeRepayment(loanId: string, userId: string) {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        repayments: {
          where: { status: { in: ["pending", "partial", "late"] } },
          orderBy: { dueDate: "asc" },
          take: 1,
        },
        user: { select: { email: true } },
      },
    });

    if (!loan) throw new NotFoundError("Loan not found");
    if (loan.userId !== userId) throw new Error("Not your loan");
    if (loan.status !== "active" && loan.status !== "delinquent") {
      throw new BadRequestError("Loan is not active");
    }

    const nextRepayment = loan.repayments[0];
    if (!nextRepayment) {
      throw new BadRequestError("No pending repayments");
    }

    const outstanding = Number(nextRepayment.outstandingAmount);
    const amountKobo = Math.round(outstanding * 100); // Convert to kobo
    const reference = `rf_${nanoid(16)}`;

    const result = await provider.initializePayment({
      amount: amountKobo,
      email: loan.user.email,
      reference,
      metadata: {
        loan_id: loanId,
        repayment_id: nextRepayment.id,
        installment_no: nextRepayment.installmentNo,
        user_id: userId,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId,
        loanId,
        repaymentScheduleId: nextRepayment.id,
        amount: outstanding,
        currency: "NGN",
        status: "pending",
        paymentMethod: "online",
        provider: provider.name,
        providerReference: reference,
        idempotencyKey: reference,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "payment_initiate",
        entity: "payment",
        metadata: { reference, amount: outstanding, loanId },
      },
    });

    return {
      authorization_url: result.data.authorization_url,
      reference,
      amount: outstanding,
    };
  }

  async handleWebhook(eventType: string, payload: any) {
    logger.info("Processing webhook", { eventType, reference: payload?.data?.reference });

    // Store webhook event for idempotency
    const existingEvent = await prisma.webhookEvent.findFirst({
      where: {
        provider: provider.name,
        providerId: String(payload?.data?.id || payload?.data?.reference),
      },
    });

    if (existingEvent) {
      if (existingEvent.processed) {
        logger.info("Webhook already processed", { eventType });
        return { status: "already_processed" };
      }
    } else {
      await prisma.webhookEvent.create({
        data: {
          provider: provider.name,
          eventType,
          providerId: String(payload?.data?.id || payload?.data?.reference),
          payload: payload as any,
        },
      });
    }

    switch (eventType) {
      case "charge.success":
        await this.handleChargeSuccess(payload);
        break;
      case "charge.failed":
        await this.handleChargeFailed(payload);
        break;
      case "transfer.success":
        await this.handleTransferSuccess(payload);
        break;
      case "transfer.failed":
        await this.handleTransferFailed(payload);
        break;
      default:
        logger.info("Unhandled webhook event type", { eventType });
    }

    // Mark as processed
    if (existingEvent) {
      await prisma.webhookEvent.update({
        where: { id: existingEvent.id },
        data: { processed: true, processedAt: new Date() },
      });
    }

    return { status: "processed" };
  }

  private async handleChargeSuccess(payload: any) {
    const { reference, amount, metadata } = payload.data;

    // Find payment by reference
    const payment = await prisma.payment.findUnique({
      where: { providerReference: reference },
    });

    if (!payment) {
      logger.warn("Payment not found for reference", { reference });
      return;
    }

    if (payment.status === "successful") {
      logger.info("Payment already processed", { reference });
      return;
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "successful",
        providerResponse: payload.data as any,
        completedAt: new Date(),
      },
    });

    // Update repayment schedule
    if (payment.repaymentScheduleId) {
      const repayment = await prisma.repaymentSchedule.findUnique({
        where: { id: payment.repaymentScheduleId },
      });

      if (repayment) {
        const amountPaid = Number(repayment.amountPaid) + Number(payment.amount);
        const newOutstanding = Math.max(0, Number(repayment.outstandingAmount) - Number(payment.amount));

        await prisma.repaymentSchedule.update({
          where: { id: repayment.id },
          data: {
            amountPaid,
            outstandingAmount: newOutstanding,
            status: newOutstanding <= 0 ? "paid" : "partial",
            paidAt: newOutstanding <= 0 ? new Date() : null,
          },
        });
      }
    }

    // Update loan balance
    if (payment.loanId) {
      const loan = await prisma.loan.findUnique({ where: { id: payment.loanId } });
      if (loan) {
        const newAmountPaid = Number(loan.amountPaid) + Number(payment.amount);
        const newOutstanding = Math.max(0, Number(loan.outstandingBalance) - Number(payment.amount));
        const allPaid = newOutstanding <= 0;

        await prisma.loan.update({
          where: { id: loan.id },
          data: {
            amountPaid: newAmountPaid,
            outstandingBalance: newOutstanding,
            status: allPaid ? "completed" : loan.status === "delinquent" ? "active" : loan.status,
            completedAt: allPaid ? new Date() : null,
          },
        });

        // Create loan transaction
        await prisma.loanTransaction.create({
          data: {
            loanId: loan.id,
            type: "repayment",
            amount: Number(payment.amount),
            balanceBefore: Number(loan.outstandingBalance),
            balanceAfter: newOutstanding,
            reference,
            description: `Repayment via ${provider.name}`,
          },
        });
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: payment.userId,
        action: "payment_success",
        entity: "payment",
        entityId: payment.id,
        after: { reference, amount: Number(payment.amount) } as any,
      },
    });

    logger.info("Payment processed successfully", { reference, amount: Number(payment.amount) });
  }

  private async handleChargeFailed(payload: any) {
    const { reference } = payload.data;

    const payment = await prisma.payment.findUnique({
      where: { providerReference: reference },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          failedAt: new Date(),
          failureReason: payload.data.gateway_response || "Payment failed",
          providerResponse: payload.data as any,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: payment.userId,
          action: "payment_fail",
          entity: "payment",
          entityId: payment.id,
        },
      });
    }
  }

  private async handleTransferSuccess(payload: any) {
    const { reference } = payload.data;
    logger.info("Transfer successful", { reference });

    const payout = await prisma.landlordPayout.findUnique({
      where: { providerReference: reference },
    });

    if (payout) {
      await prisma.landlordPayout.update({
        where: { id: payout.id },
        data: {
          status: "successful",
          providerResponse: payload.data as any,
          completedAt: new Date(),
        },
      });
    }
  }

  private async handleTransferFailed(payload: any) {
    const { reference } = payload.data;
    logger.error("Transfer failed", { reference });

    const payout = await prisma.landlordPayout.findUnique({
      where: { providerReference: reference },
    });

    if (payout) {
      await prisma.landlordPayout.update({
        where: { id: payout.id },
        data: {
          status: "failed",
          failureReason: payload.data.reason || "Transfer failed",
          failedAt: new Date(),
          providerResponse: payload.data as any,
        },
      });
    }
  }

  async getPaymentHistory(userId: string, loanId?: string) {
    const where: any = { userId };
    if (loanId) where.loanId = loanId;

    return prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async getPaymentById(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        loan: { select: { loanNumber: true } },
        repaymentSchedule: { select: { installmentNo: true, dueDate: true } },
      },
    });
    if (!payment) throw new NotFoundError("Payment not found");
    return payment;
  }
}

export const paymentService = new PaymentService();
