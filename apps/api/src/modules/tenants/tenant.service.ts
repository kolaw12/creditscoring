import prisma from "../../database";
import { NotFoundError, BadRequestError } from "../../utils/errors";

export class TenantService {
  async getProfile(userId: string) {
    const profile = await prisma.tenantProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError("Tenant profile not found");
    }

    return profile;
  }

  async updatePersonalInfo(userId: string, data: {
    dateOfBirth?: string | Date;
    address?: string;
    city?: string;
    state?: string;
    bvn?: string;
    nin?: string;
    idType?: string;
    idNumber?: string;
  }) {
    const profile = await prisma.tenantProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError("Tenant profile not found");

    // Convert date string (e.g., "2003-07-22") to JS Date object for Prisma DateTime field
    const formattedData: any = { ...data };
    if (data.dateOfBirth && typeof data.dateOfBirth === "string") {
      formattedData.dateOfBirth = new Date(data.dateOfBirth);
    }

    const updated = await prisma.tenantProfile.update({
      where: { userId },
      data: formattedData,
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        entity: "tenant_profile",
        entityId: userId,
        before: profile,
        after: updated,
      },
    });

    return updated;
  }

  async updateEmploymentInfo(userId: string, data: {
    employmentStatus?: string;
    employerName?: string;
    jobTitle?: string;
    employmentStartDate?: string | Date;
    monthlyIncome?: number;
    salaryFrequency?: string;
    salaryBank?: string;
  }) {
    const profile = await prisma.tenantProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError("Tenant profile not found");

    const formattedData: any = { ...data };
    if (data.employmentStartDate && typeof data.employmentStartDate === "string") {
      formattedData.employmentStartDate = new Date(data.employmentStartDate);
    }

    const updated = await prisma.tenantProfile.update({
      where: { userId },
      data: {
        ...formattedData,
        monthlyIncome: data.monthlyIncome !== undefined
          ? data.monthlyIncome
          : undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        action: "update",
        entity: "tenant_profile",
        entityId: userId,
        before: profile,
        after: updated,
      },
    });

    return updated;
  }

  async getCompletionStatus(userId: string) {
    const profile = await prisma.tenantProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundError("Tenant profile not found");

    const steps = {
      personalInfo: Boolean(
        profile.dateOfBirth && profile.address && profile.city && profile.state
      ),
      employment: Boolean(
        profile.employmentStatus && profile.employerName && profile.monthlyIncome
      ),
      income: Boolean(profile.monthlyIncome && profile.salaryFrequency),
      documents: false, // Will check separately
      application: false, // Will check separately
    };

    const completedSteps = Object.values(steps).filter(Boolean).length;
    const totalSteps = Object.keys(steps).length;

    return {
      steps,
      completedSteps,
      totalSteps,
      completionPercent: Math.round((completedSteps / totalSteps) * 100),
    };
  }
}

export const tenantService = new TenantService();
