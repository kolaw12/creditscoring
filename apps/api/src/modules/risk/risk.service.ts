import prisma from "../../database";
import { RiskRecommendation, RiskLevel } from "@prisma/client";

interface RiskInputs {
  monthlyIncome: number;
  requestedAmount: number;
  annualRent: number;
  tenantContribution: number;
  employmentStatus: string;
  employmentDurationMonths?: number;
  hasVerifiedIncome: boolean;
}

interface RiskResult {
  rentToIncomeRatio: number;
  financingToIncomeRatio: number;
  affordabilityScore: number;
  riskScore: number;
  riskLevel: RiskLevel;
  recommendation: RiskRecommendation;
  recommendedAmount: number;
  recommendedDownPayment: number;
}

export class RiskService {
  async assessApplication(applicationId: string): Promise<RiskResult> {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          include: { tenantProfile: true },
        },
      },
    });

    if (!application) throw new Error("Application not found");

    const profile = application.user.tenantProfile;
    if (!profile) throw new Error("Tenant profile not found");

    const inputs: RiskInputs = {
      monthlyIncome: Number(profile.monthlyIncome || 0),
      requestedAmount: Number(application.requestedAmount),
      annualRent: Number(application.annualRent),
      tenantContribution: Number(application.tenantContribution),
      employmentStatus: profile.employmentStatus || "unknown",
      employmentDurationMonths: profile.employmentStartDate
        ? Math.floor(
            (Date.now() - new Date(profile.employmentStartDate).getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          )
        : 0,
      hasVerifiedIncome: profile.incomeVerified,
    };

    const result = this.calculateRisk(inputs);

    // Store the risk assessment
    const existing = await prisma.riskAssessment.findUnique({
      where: { applicationId },
    });

    const riskData = {
      applicationId,
      rentToIncomeRatio: result.rentToIncomeRatio,
      financingToIncomeRatio: result.financingToIncomeRatio,
      employmentDuration: inputs.employmentDurationMonths,
      hasVerifiedIncome: inputs.hasVerifiedIncome,
      affordabilityScore: result.affordabilityScore,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      recommendation: result.recommendation,
      recommendedAmount: result.recommendedAmount,
      recommendedDownPayment: result.recommendedDownPayment,
      modelVersion: "v1.0",
      calculatedBy: "system",
    };

    if (existing) {
      await prisma.riskAssessment.update({
        where: { applicationId },
        data: riskData,
      });
    } else {
      await prisma.riskAssessment.create({ data: riskData });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: application.userId,
        action: "risk_decision",
        entity: "application",
        entityId: applicationId,
        after: riskData as any,
      },
    });

    return result;
  }

  private calculateRisk(inputs: RiskInputs): RiskResult {
    const monthlyRent = inputs.annualRent / 12;
    const rentToIncomeRatio = inputs.monthlyIncome > 0 ? monthlyRent / inputs.monthlyIncome : 1;
    const financingToIncomeRatio = inputs.monthlyIncome > 0
      ? inputs.requestedAmount / inputs.monthlyIncome
      : 1;

    // Affordability score (0-1, higher is better)
    let affordabilityScore = 1.0;

    // Penalize high rent-to-income ratio
    if (rentToIncomeRatio > 0.5) affordabilityScore -= 0.3;
    else if (rentToIncomeRatio > 0.4) affordabilityScore -= 0.2;
    else if (rentToIncomeRatio > 0.3) affordabilityScore -= 0.1;

    // Penalize high financing-to-income ratio
    if (financingToIncomeRatio > 4) affordabilityScore -= 0.3;
    else if (financingToIncomeRatio > 3) affordabilityScore -= 0.2;
    else if (financingToIncomeRatio > 2) affordabilityScore -= 0.1;

    // Employment factors
    if (inputs.employmentStatus === "employed") affordabilityScore += 0.1;
    else if (inputs.employmentStatus === "self_employed") affordabilityScore += 0.05;
    else if (inputs.employmentStatus === "contract") affordabilityScore -= 0.05;
    else if (inputs.employmentStatus === "intern") affordabilityScore -= 0.1;

    // Duration factor
    if (inputs.employmentDurationMonths && inputs.employmentDurationMonths >= 12) {
      affordabilityScore += 0.1;
    } else if (inputs.employmentDurationMonths && inputs.employmentDurationMonths >= 6) {
      affordabilityScore += 0.05;
    } else if (inputs.employmentDurationMonths && inputs.employmentDurationMonths < 3) {
      affordabilityScore -= 0.1;
    }

    // Verified income bonus
    if (inputs.hasVerifiedIncome) affordabilityScore += 0.1;

    // Clamp
    affordabilityScore = Math.max(0, Math.min(1, affordabilityScore));

    // Risk score (0-1, lower is better)
    const riskScore = 1 - affordabilityScore;

    // Risk level
    let riskLevel: RiskLevel;
    if (riskScore < 0.3) riskLevel = "low";
    else if (riskScore < 0.5) riskLevel = "moderate";
    else if (riskScore < 0.7) riskLevel = "high";
    else riskLevel = "very_high";

    // Recommendation
    let recommendation: RiskRecommendation;
    if (affordabilityScore >= 0.7) recommendation = "approve";
    else if (affordabilityScore >= 0.4) recommendation = "manual_review";
    else recommendation = "decline";

    // Recommended amounts
    const maxAffordableMonthly = inputs.monthlyIncome * 0.35; // 35% of income for rent payment
    const recommendedMonthlyPayment = Math.min(maxAffordableMonthly, monthlyRent);
    const recommendedAmount = Math.round(recommendedMonthlyPayment * 12 * 0.85); // 85% of annual
    const recommendedDownPayment = inputs.annualRent - recommendedAmount;

    return {
      rentToIncomeRatio: Math.round(rentToIncomeRatio * 10000) / 10000,
      financingToIncomeRatio: Math.round(financingToIncomeRatio * 10000) / 10000,
      affordabilityScore: Math.round(affordabilityScore * 10000) / 10000,
      riskScore: Math.round(riskScore * 10000) / 10000,
      riskLevel,
      recommendation,
      recommendedAmount: Math.max(0, recommendedAmount),
      recommendedDownPayment: Math.max(0, recommendedDownPayment),
    };
  }

  async getAssessment(applicationId: string) {
    return prisma.riskAssessment.findUnique({
      where: { applicationId },
    });
  }
}

export const riskService = new RiskService();
