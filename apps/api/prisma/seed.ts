import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create super admin
  const superAdminPassword = await bcrypt.hash("Admin@12345", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@rentfin.ng" },
    update: {},
    create: {
      email: "admin@rentfin.ng",
      phone: "+2348000000001",
      passwordHash: superAdminPassword,
      firstName: "Super",
      lastName: "Admin",
      role: UserRole.super_admin,
      status: UserStatus.active,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log(`Super admin: ${superAdmin.email}`);

  // Create credit officer
  const creditOfficerPassword = await bcrypt.hash("Credit@12345", 12);
  const creditOfficer = await prisma.user.upsert({
    where: { email: "credit@rentfin.ng" },
    update: {},
    create: {
      email: "credit@rentfin.ng",
      phone: "+2348000000002",
      passwordHash: creditOfficerPassword,
      firstName: "Credit",
      lastName: "Officer",
      role: UserRole.credit_officer,
      status: UserStatus.active,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log(`Credit officer: ${creditOfficer.email}`);

  // Create test tenant
  const tenantPassword = await bcrypt.hash("Tenant@12345", 12);
  const tenant = await prisma.user.upsert({
    where: { email: "ada@example.com" },
    update: {},
    create: {
      email: "ada@example.com",
      phone: "+2348012345678",
      passwordHash: tenantPassword,
      firstName: "Ada",
      lastName: "Okonkwo",
      role: UserRole.tenant,
      status: UserStatus.active,
      emailVerified: true,
      phoneVerified: true,
      tenantProfile: {
        create: {
          dateOfBirth: new Date("1996-05-15"),
          address: "12 Admiralty Way, Lekki Phase 1",
          city: "Lagos",
          state: "Lagos",
          employmentStatus: "employed",
          employerName: "TechCorp Nigeria",
          jobTitle: "Software Engineer",
          employmentStartDate: new Date("2022-03-01"),
          monthlyIncome: 450000,
          salaryFrequency: "monthly",
          salaryBank: "GTBank",
          incomeVerified: false,
        },
      },
    },
  });
  console.log(`Tenant: ${tenant.email}`);

  // Create sample landlord
  const landlord = await prisma.landlord.upsert({
    where: { id: "sample-landlord-1" },
    update: {},
    create: {
      id: "sample-landlord-1",
      firstName: "Chukwuemeka",
      lastName: "Adeyemi",
      email: "adeyemi@example.com",
      phone: "+2348098765432",
      bankName: "First Bank",
      bankAccountNumber: "3012345678",
      bankAccountName: "Chukwuemeka Adeyemi",
    },
  });
  console.log(`Landlord: ${landlord.firstName} ${landlord.lastName}`);

  // Create sample property
  const property = await prisma.property.upsert({
    where: { id: "sample-property-1" },
    update: {},
    create: {
      id: "sample-property-1",
      address: "45 Admiralty Way, Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
      propertyType: "apartment",
      landlordId: landlord.id,
    },
  });
  console.log(`Property: ${property.address}`);

  // Platform config defaults
  const defaultConfigs = [
    {
      key: "lending_policy",
      value: {
        maxFinancingAmount: 5000000,
        minMonthlyIncome: 150000,
        maxRentToIncomeRatio: 0.4,
        maxFinancingToIncomeRatio: 0.5,
        minEmploymentDurationMonths: 3,
        defaultRepaymentPeriodMonths: 12,
        financingFeePercent: 0.05,
        annualInterestRate: 0.12,
        lateFeePercent: 0.02,
        offerExpiryDays: 14,
      },
      description: "Default lending policy configuration",
    },
    {
      key: "application_config",
      value: {
        allowedDocumentTypes: [
          "government_id",
          "employment_letter",
          "bank_statement",
          "tenancy_agreement",
          "proof_of_income",
          "property_document",
        ],
        maxFileSizeMB: 10,
        maxDocumentsPerApplication: 10,
        applicationExpiryDays: 30,
      },
      description: "Application configuration",
    },
  ];

  for (const config of defaultConfigs) {
    await prisma.platformConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    });
  }
  console.log("Platform config seeded");

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
