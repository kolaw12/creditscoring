import prisma from "../../database";
import { NotFoundError, BadRequestError, ForbiddenError } from "../../utils/errors";
import { ApplicationStatus } from "@prisma/client";
import { notificationService } from "../notifications/notification.service";

const VALID_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ["submitted"],
  submitted: ["verification"],
  verification: ["under_review", "additional_information_required"],
  under_review: ["approved", "declined", "additional_information_required"],
  additional_information_required: ["under_review", "submitted"],
  approved: [],
  declined: [],
  expired: [],
};

export class ApplicationService {
  async createApplication(userId: string, data: {
    propertyId?: string;
    landlordId?: string;
    annualRent: number;
    monthlyRent: number;
    leaseDuration: number;
    tenantContribution?: number;
    requestedAmount: number;
  }) {
    // Validate financial consistency
    if (data.requestedAmount > data.annualRent) {
      throw new BadRequestError("Requested financing cannot exceed annual rent");
    }

    const totalCoverage = (data.tenantContribution || 0) + data.requestedAmount;
    if (totalCoverage > data.annualRent) {
      throw new BadRequestError("Tenant contribution + requested amount cannot exceed annual rent");
    }

    // Check for existing active application
    const existingActive = await prisma.application.findFirst({
      where: {
        userId,
        status: { in: ["draft", "submitted", "verification", "under_review", "additional_information_required"] },
      },
    });

    if (existingActive) {
      throw new BadRequestError("You already have an active application");
    }

    const application = await prisma.application.create({
      data: {
        userId,
        status: "draft",
        propertyId: data.propertyId,
        landlordId: data.landlordId,
        annualRent: data.annualRent,
        monthlyRent: data.monthlyRent,
        leaseDuration: data.leaseDuration,
        tenantContribution: data.tenantContribution || 0,
        requestedAmount: data.requestedAmount,
      },
    });

    // Create initial status history
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        toStatus: "draft",
        changedBy: userId,
        note: "Application created",
      },
    });

    return application;
  }

  async submitApplication(applicationId: string, userId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) throw new NotFoundError("Application not found");
    if (application.userId !== userId) throw new ForbiddenError("Not your application");

    if (application.status !== "draft") {
      throw new BadRequestError("Only draft applications can be submitted");
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "submitted",
        submittedAt: new Date(),
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus: "draft",
        toStatus: "submitted",
        changedBy: userId,
        note: "Application submitted for review",
      },
    });

    // Send notification (fire-and-forget)
    notificationService.notifyApplicationSubmitted(userId, applicationId).catch(() => {});

    return updated;
  }

  async getApplication(applicationId: string, userId?: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        property: true,
        landlord: true,
        riskAssessment: true,
        offer: true,
        documents: {
          select: {
            id: true,
            type: true,
            title: true,
            status: true,
            uploadedAt: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!application) throw new NotFoundError("Application not found");
    if (userId && application.userId !== userId) throw new ForbiddenError("Not your application");

    return application;
  }

  async getUserApplications(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      include: {
        property: { select: { address: true, city: true, state: true } },
        offer: { select: { status: true, financingAmount: true, monthlyInstallment: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllApplications(filters: {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    search?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { user: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { user: { lastName: { contains: filters.search, mode: "insensitive" } } },
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          property: true,
          landlord: true,
          riskAssessment: { select: { riskLevel: true, recommendation: true, riskScore: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    adminUserId: string,
    note?: string
  ) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) throw new NotFoundError("Application not found");

    const validTransitions = VALID_TRANSITIONS[application.status];
    if (!validTransitions.includes(newStatus)) {
      throw new BadRequestError(
        `Cannot transition from "${application.status}" to "${newStatus}"`
      );
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
        reviewedBy: adminUserId,
        decisionNote: note || application.decisionNote,
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        fromStatus: application.status,
        toStatus: newStatus,
        changedBy: adminUserId,
        note: note || `Status changed to ${newStatus}`,
      },
    });

    // Send notifications based on status change (fire-and-forget)
    if (newStatus === "approved") {
      notificationService.notifyApplicationApproved(application.userId, applicationId).catch(() => {});
    } else if (newStatus === "declined") {
      notificationService.notifyApplicationDeclined(application.userId, applicationId).catch(() => {});
    }

    return updated;
  }
}

export const applicationService = new ApplicationService();
