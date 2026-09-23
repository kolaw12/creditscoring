import { Router, type Router as RouterType } from "express";
import { applicationController } from "./application.controller";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { validate } from "../../middleware/validate";
import { applicationSchema } from "../../utils/validation";
import { UserRole } from "@prisma/client";

const router: ReturnType<typeof Router> = Router();

// Tenant routes
router.use(authenticate as any);
router.post("/", applicationController.create as any);
router.post("/:id/submit", applicationController.submit as any);
router.get("/my", applicationController.getMyApplications as any);
router.get("/:id", applicationController.getOne as any);

// Admin routes
router.get(
  "/admin/all",
  requireRole(UserRole.admin, UserRole.credit_officer, UserRole.super_admin) as any,
  applicationController.getAll as any
);
router.patch(
  "/admin/:id/status",
  requireRole(UserRole.admin, UserRole.credit_officer, UserRole.super_admin) as any,
  applicationController.updateStatus as any
);

export default router;
