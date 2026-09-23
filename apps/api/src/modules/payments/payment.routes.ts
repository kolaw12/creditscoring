import { Router, type Router as RouterType } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { paymentService } from "./payment.service";
import { UserRole } from "@prisma/client";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

// Tenant: initialize repayment
router.post("/repay/:loanId", async (req: any, res: any, next: any) => {
  try {
    const result = await paymentService.initializeRepayment(req.params.loanId, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Tenant: get payment history
router.get("/history", async (req: any, res: any, next: any) => {
  try {
    const { loanId } = req.query;
    const payments = await paymentService.getPaymentHistory(req.user.id, loanId);
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
});

// Get payment detail
router.get("/:id", async (req: any, res: any, next: any) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
});

export default router;
