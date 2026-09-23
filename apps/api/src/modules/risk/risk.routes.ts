import { Router, type Router as RouterType } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { riskService } from "./risk.service";
import { UserRole } from "@prisma/client";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

// Admin: run risk assessment on an application
router.post(
  "/assess/:applicationId",
  requireRole(UserRole.admin, UserRole.credit_officer, UserRole.super_admin) as any,
  async (req: any, res: any, next: any) => {
    try {
      const result = await riskService.assessApplication(req.params.applicationId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

// Get risk assessment for an application
router.get(
  "/:applicationId",
  async (req: any, res: any, next: any) => {
    try {
      const assessment = await riskService.getAssessment(req.params.applicationId);
      res.json({ success: true, data: assessment });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
