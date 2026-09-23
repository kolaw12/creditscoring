import { Router, type Router as RouterType } from "express";
import { tenantController } from "./tenant.controller";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

router.get("/profile", tenantController.getProfile as any);
router.put("/profile/personal", tenantController.updatePersonalInfo as any);
router.put("/profile/employment", tenantController.updateEmploymentInfo as any);
router.get("/profile/status", tenantController.getCompletionStatus as any);

export default router;
