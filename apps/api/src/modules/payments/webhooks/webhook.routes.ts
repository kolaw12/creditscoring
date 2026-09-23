import { Router, type Router as RouterType, Request, Response } from "express";
import { paymentService } from "../payment.service";
import { getPaymentProvider } from "../providers/paystack.provider";
import logger from "../../../utils/logger";

const router: ReturnType<typeof Router> = Router();
const provider = getPaymentProvider();

// Paystack webhook endpoint
router.post("/paystack", async (req: Request, res: Response) => {
  try {
    // Verify webhook signature
    const signature = req.headers["x-paystack-signature"] as string;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    if (!provider.verifyWebhookSignature(rawBody, signature)) {
      logger.warn("Invalid webhook signature");
      res.status(400).json({ message: "Invalid signature" });
      return;
    }

    const event = req.body;
    const result = await paymentService.handleWebhook(event.event, event);

    res.json({ status: result.status });
  } catch (error) {
    logger.error("Webhook processing error", { error });
    // Always return 200 to webhook to prevent retries for processing errors
    res.status(200).json({ status: "error_acknowledged" });
  }
});

// Generic webhook endpoint for testing
router.post("/generic", async (req: Request, res: Response) => {
  try {
    const event = req.body;
    const result = await paymentService.handleWebhook(event.event || event.type, event);
    res.json({ status: result.status });
  } catch (error) {
    logger.error("Generic webhook processing error", { error });
    res.status(200).json({ status: "error_acknowledged" });
  }
});

export default router;
