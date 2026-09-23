import { z } from "zod";

// ── Nigerian phone number ──────────────────────────────────────────────────
export const nigerianPhoneSchema = z
  .string()
  .regex(/^\+234[789][01]\d{8}$/, "Invalid Nigerian phone number format");

// ── Pagination ─────────────────────────────────────────────────────────────
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().optional(),
});

// ── Auth ───────────────────────────────────────────────────────────────────
export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: nigerianPhoneSchema,
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// ── Tenant Profile ─────────────────────────────────────────────────────────
export const personalInfoSchema = z.object({
  dateOfBirth: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  bvn: z.string().optional(),
  nin: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
});

export const employmentInfoSchema = z.object({
  employmentStatus: z.string().optional(),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  employmentStartDate: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
  monthlyIncome: z.coerce.number().positive().optional(),
  salaryFrequency: z.string().optional(),
  salaryBank: z.string().optional(),
});

// ── Application ────────────────────────────────────────────────────────────
export const propertySchema = z.object({
  address: z.string().min(5, "Property address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  propertyType: z.string().optional(),
  landlordId: z.string().optional(),
});

export const applicationSchema = z.object({
  propertyId: z.string().optional(),
  landlordId: z.string().optional(),
  annualRent: z.coerce.number().positive("Annual rent must be positive"),
  monthlyRent: z.coerce.number().positive("Monthly rent must be positive"),
  leaseDuration: z.coerce.number().int().min(1, "Lease duration is required"),
  tenantContribution: z.coerce.number().min(0),
  requestedAmount: z.coerce.number().positive("Requested amount must be positive"),
});
