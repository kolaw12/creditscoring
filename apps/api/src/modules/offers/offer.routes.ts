import { Router, type Router as RouterType } from "express";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { offerService } from "./offer.service";
import { UserRole } from "@prisma/client";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

// Admin: create offer
router.post(
  "/",
  requireRole(UserRole.admin, UserRole.credit_officer, UserRole.super_admin) as any,
  async (req: any, res: any, next: any) => {
    try {
      const offer = await offerService.createOffer({
        ...req.body,
        createdBy: req.user.id,
      });
      res.status(201).json({ success: true, message: "Offer created", data: offer });
    } catch (error) {
      next(error);
    }
  }
);

// Get offer
router.get("/:id", async (req: any, res: any, next: any) => {
  try {
    const offer = await offerService.getOffer(req.params.id);
    res.json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
});

// Tenant: accept offer
router.post("/:id/accept", async (req: any, res: any, next: any) => {
  try {
    const result = await offerService.acceptOffer(req.params.id, req.user.id);
    res.json({ success: true, message: "Offer accepted. Loan created.", data: result });
  } catch (error) {
    next(error);
  }
});

// Get offer by application
router.get("/application/:applicationId", async (req: any, res: any, next: any) => {
  try {
    const offer = await offerService.getOfferByApplicationId(req.params.applicationId);
    res.json({ success: true, data: offer });
  } catch (error) {
    next(error);
  }
});

export default router;
