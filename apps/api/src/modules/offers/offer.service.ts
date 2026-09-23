import prisma from "../../database";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../utils/errors";

export class OfferService {
  async createOffer(data: {
    applicationId: string;
    financingAmount: number;
    tenantContribution: number;
    financingFee: number;
    interestRate: number;
    repaymentPeriod: number;
    firstPaymentDate?: string;
    createdBy: string;
  }) {
    const application = await prisma.application.findUnique({
      where: { id: data.applicationId },
    });
    if (!application) throw new NotFoundError("Application not found");
    if (application.status !== "approved") throw new BadRequestError("Application must be approved before creating an offer");

    // Check existing offer
    const existingOffer = await prisma.financingOffer.findUnique({
      where: { applicationId: data.applicationId },
    });
    if (existingOffer && existingOffer.status !== "cancelled" && existingOffer.status !== "expired") {
      throw new BadRequestError("An active offer already exists for this application");
    }

    const monthlyInterest = data.interestRate / 12;
    const totalPrincipal = data.financingAmount + data.financingFee;
    const monthlyInstallment = this.calculateMonthlyPayment(
      totalPrincipal,
      monthlyInterest,
      data.repaymentPeriod
    );
    const totalRepayment = monthlyInstallment * data.repaymentPeriod;

    const version = existingOffer ? existingOffer.version + 1 : 1;

    const offer = await prisma.financingOffer.create({
      data: {
        applicationId: data.applicationId,
        status: "sent",
        sentAt: new Date(),
        version,
        financingAmount: data.financingAmount,
        tenantContribution: data.tenantContribution,
        financingFee: data.financingFee,
        interestRate: data.interestRate,
        monthlyInstallment: Math.round(monthlyInstallment * 100) / 100,
        repaymentPeriod: data.repaymentPeriod,
        totalRepaymentAmount: Math.round(totalRepayment * 100) / 100,
        firstPaymentDate: data.firstPaymentDate ? new Date(data.firstPaymentDate) : null,
        createdBy: data.createdBy,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: data.createdBy,
        action: "offer_create",
        entity: "financing_offer",
        entityId: offer.id,
        after: offer as any,
      },
    });

    return offer;
  }

  async acceptOffer(offerId: string, userId: string) {
    const offer = await prisma.financingOffer.findUnique({
      where: { id: offerId },
      include: { application: true },
    });
    if (!offer) throw new NotFoundError("Offer not found");
    if (offer.application.userId !== userId) throw new ForbiddenError("Not your offer");
    if (offer.status !== "sent" && offer.status !== "viewed") {
      throw new BadRequestError("Offer cannot be accepted in its current state");
    }
    if (offer.expiresAt && offer.expiresAt < new Date()) {
      throw new BadRequestError("Offer has expired");
    }

    const updatedOffer = await prisma.financingOffer.update({
      where: { id: offerId },
      data: {
        status: "accepted",
        acceptedAt: new Date(),
      },
    });

    // Create loan
    const loanNumber = `RF-${Date.now().toString(36).toUpperCase()}`;
    const loan = await prisma.loan.create({
      data: {
        offerId,
        userId,
        status: "approved",
        loanNumber,
        principalAmount: offer.financingAmount,
        totalPayable: offer.totalRepaymentAmount,
        outstandingBalance: offer.totalRepaymentAmount,
        financingFee: offer.financingFee,
        firstPaymentDate: offer.firstPaymentDate,
      },
    });

    // Generate repayment schedule
    const schedule = this.generateRepaymentSchedule(
      loan.id,
      Number(offer.totalRepaymentAmount),
      offer.repaymentPeriod,
      offer.firstPaymentDate || new Date()
    );

    await prisma.repaymentSchedule.createMany({ data: schedule });

    // Create loan status history
    await prisma.loanStatusHistory.create({
      data: {
        loanId: loan.id,
        toStatus: "approved",
        changedBy: userId,
        note: "Loan created from accepted offer",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "offer_accept",
        entity: "financing_offer",
        entityId: offerId,
      },
    });

    return { offer: updatedOffer, loan };
  }

  async getOffer(offerId: string) {
    const offer = await prisma.financingOffer.findUnique({
      where: { id: offerId },
      include: {
        application: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true } },
            property: true,
          },
        },
      },
    });
    if (!offer) throw new NotFoundError("Offer not found");
    return offer;
  }

  async getOfferByApplicationId(applicationId: string) {
    return prisma.financingOffer.findUnique({
      where: { applicationId },
    });
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, periods: number): number {
    if (monthlyRate === 0) return principal / periods;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, periods)) /
      (Math.pow(1 + monthlyRate, periods) - 1);
  }

  private generateRepaymentSchedule(
    loanId: string,
    totalAmount: number,
    periods: number,
    firstPaymentDate: Date
  ) {
    const monthlyPayment = Math.round((totalAmount / periods) * 100) / 100;
    const schedule = [];

    for (let i = 1; i <= periods; i++) {
      const dueDate = new Date(firstPaymentDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const isLast = i === periods;
      const amountDue = isLast
        ? totalAmount - monthlyPayment * (periods - 1)
        : monthlyPayment;

      schedule.push({
        loanId,
        installmentNo: i,
        dueDate,
        amountDue: Math.round(amountDue * 100) / 100,
        amountPaid: 0,
        outstandingAmount: Math.round(amountDue * 100) / 100,
        status: "pending" as const,
      });
    }

    return schedule;
  }
}

export const offerService = new OfferService();
