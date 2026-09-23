import { Router, type Router as RouterType } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { payoutService } from "./payout.service";
import { UserRole } from "@prisma/client";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

// Admin: initiate payout / disbursement
router.post(
  "/initiate/:loanId",
  requireRole(UserRole.admin, UserRole.finance, UserRole.super_admin) as any,
  async (req: any, res: any, next: any) => {
    try {
      const payout = await payoutService.initiatePayout(req.params.loanId, req.user.id);
      res.status(201).json({ success: true, message: "Payout initiated", data: payout });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: list all payouts
router.get(
  "/",
  requireRole(UserRole.admin, UserRole.finance, UserRole.super_admin) as any,
  async (req: any, res: any, next: any) => {
    try {
      const { page, limit, status } = req.query;
      const result = await payoutService.getAllPayouts({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
);

// Admin: get payout detail
router.get(
  "/:id",
  requireRole(UserRole.admin, UserRole.finance, UserRole.super_admin) as any,
  async (req: any, res: any, next: any) => {
    try {
      const payout = await payoutService.getPayout(req.params.id);
      res.json({ success: true, data: payout });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
