import { Router, type Router as RouterType } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { loanService } from "./loan.service";
import { UserRole } from "@prisma/client";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

// Tenant: get my loans
router.get("/my", async (req: any, res: any, next: any) => {
  try {
    const loans = await loanService.getUserLoans(req.user.id);
    res.json({ success: true, data: loans });
  } catch (error) {
    next(error);
  }
});

// Get loan detail
router.get("/:id", async (req: any, res: any, next: any) => {
  try {
    const loan = await loanService.getLoan(req.params.id, req.user.id);
    res.json({ success: true, data: loan });
  } catch (error) {
    next(error);
  }
});

// Get repayment schedule
router.get("/:id/schedule", async (req: any, res: any, next: any) => {
  try {
    const schedule = await loanService.getRepaymentSchedule(req.params.id, req.user.id);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
});

// Record payment (will be triggered by webhook, but allow manual too)
router.post("/:id/payments", async (req: any, res: any, next: any) => {
  try {
    const payment = await loanService.recordPayment({
      loanId: req.params.id,
      userId: req.user.id,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      provider: req.body.provider,
      providerReference: req.body.providerReference,
      idempotencyKey: req.body.idempotencyKey,
    });
    res.status(201).json({ success: true, message: "Payment recorded", data: payment });
  } catch (error) {
    next(error);
  }
});

// Admin: get all loans
router.get(
  "/admin/all",
  requireRole(UserRole.admin, UserRole.credit_officer, UserRole.super_admin, UserRole.finance) as any,
  async (req: any, res: any, next: any) => {
    try {
      const { page, limit, status, search } = req.query;
      const result = await loanService.getAllLoans({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as string,
        search: search as string,
      });
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
