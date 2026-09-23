import prisma from "../../database";
import { NotFoundError, ForbiddenError } from "../../utils/errors";
import { notificationService } from "../notifications/notification.service";

export class LoanService {
  async getLoan(loanId: string, userId?: string) {
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        offer: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        repayments: { orderBy: { dueDate: "asc" } },
        transactions: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!loan) throw new NotFoundError("Loan not found");
    if (userId && loan.userId !== userId) throw new ForbiddenError("Not your loan");
    return loan;
  }

  async getUserLoans(userId: string) {
    return prisma.loan.findMany({
      where: { userId },
      include: {
        offer: { select: { financingAmount: true, monthlyInstallment: true, repaymentPeriod: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllLoans(filters: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { loanNumber: { contains: filters.search, mode: "insensitive" } },
        { user: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { user: { lastName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          offer: { select: { monthlyInstallment: true, repaymentPeriod: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.loan.count({ where }),
    ]);

    return {
      data: loans,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRepaymentSchedule(loanId: string, userId?: string) {
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundError("Loan not found");
    if (userId && loan.userId !== userId) throw new ForbiddenError("Not your loan");

    return prisma.repaymentSchedule.findMany({
      where: { loanId },
      orderBy: { dueDate: "asc" },
    });
  }

  async recordPayment(data: {
    loanId: string;
    userId: string;
    amount: number;
    paymentMethod?: string;
    provider?: string;
    providerReference?: string;
    idempotencyKey?: string;
  }) {
    const loan = await prisma.loan.findUnique({
      where: { id: data.loanId },
      include: {
        repayments: { where: { status: { in: ["pending", "partial", "late"] } }, orderBy: { dueDate: "asc" } },
      },
    });
    if (!loan) throw new NotFoundError("Loan not found");
    if (loan.userId !== data.userId) throw new ForbiddenError("Not your loan");
    if (loan.status !== "active" && loan.status !== "delinquent") {
      throw new Error("Loan is not in an active state");
    }

    // Check idempotency
    if (data.idempotencyKey) {
      const existing = await prisma.payment.findUnique({
        where: { idempotencyKey: data.idempotencyKey },
      });
      if (existing) return existing;
    }

    let remainingAmount = data.amount;
    const updatedRepayments: any[] = [];

    for (const repayment of loan.repayments) {
      if (remainingAmount <= 0) break;

      const outstanding = Number(repayment.outstandingAmount);
      const paymentForInstallment = Math.min(remainingAmount, outstanding);
      remainingAmount -= paymentForInstallment;

      const newAmountPaid = Number(repayment.amountPaid) + paymentForInstallment;
      const newOutstanding = outstanding - paymentForInstallment;

      updatedRepayments.push(
        prisma.repaymentSchedule.update({
          where: { id: repayment.id },
          data: {
            amountPaid: newAmountPaid,
            outstandingAmount: Math.max(0, newOutstanding),
            status: newOutstanding <= 0 ? "paid" : "partial",
            paidAt: newOutstanding <= 0 ? new Date() : null,
          },
        })
      );
    }

    await prisma.$transaction(updatedRepayments);

    // Update loan balance
    const newAmountPaid = Number(loan.amountPaid) + data.amount;
    const newOutstanding = Number(loan.outstandingBalance) - data.amount;
    const allPaid = newOutstanding <= 0;

    await prisma.loan.update({
      where: { id: data.loanId },
      data: {
        amountPaid: newAmountPaid,
        outstandingBalance: Math.max(0, newOutstanding),
        status: allPaid ? "completed" : loan.status,
        completedAt: allPaid ? new Date() : null,
      },
    });

    // Create loan transaction record
    await prisma.loanTransaction.create({
      data: {
        loanId: data.loanId,
        type: "repayment",
        amount: data.amount,
        balanceBefore: Number(loan.outstandingBalance),
        balanceAfter: Math.max(0, newOutstanding),
        reference: data.providerReference,
        description: `Repayment of ₦${data.amount.toLocaleString()}`,
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: data.userId,
        loanId: data.loanId,
        amount: data.amount,
        status: "successful",
        paymentMethod: data.paymentMethod,
        provider: data.provider,
        providerReference: data.providerReference,
        idempotencyKey: data.idempotencyKey,
        completedAt: new Date(),
      },
    });

    // Notify user of successful payment (fire-and-forget)
    notificationService.notifyPaymentSuccessful(data.userId, loan.loanNumber, data.amount).catch(() => {});

    // Check if loan is fully paid
    if (allPaid) {
      notificationService.notifyLoanCompleted(data.userId, loan.loanNumber).catch(() => {});
    }

    return payment;
  }
}

export const loanService = new LoanService();
