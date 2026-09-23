import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";

const app: Express = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Rate limiting ───────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later",
      code: "RATE_LIMITED",
    },
  })
);

// ── Body parsing ────────────────────────────────────────────────────────────
// Capture raw body for webhook signature verification
app.use("/api/v1/webhooks", express.json({
  limit: "10mb",
  verify: (req: any, _res, buf) => { req.rawBody = buf; },
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

// ── Request logging ─────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.debug(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });
  next();
});

// ── Health check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API routes ──────────────────────────────────────────────────────────────
import authRoutes from "./modules/auth/auth.routes";
import tenantRoutes from "./modules/tenants/tenant.routes";
import applicationRoutes from "./modules/applications/application.routes";
import riskRoutes from "./modules/risk/risk.routes";
import offerRoutes from "./modules/offers/offer.routes";
import loanRoutes from "./modules/loans/loan.routes";
import paymentRoutes from "./modules/payments/payment.routes";
import payoutRoutes from "./modules/payouts/payout.routes";
import webhookRoutes from "./modules/payments/webhooks/webhook.routes";
import notificationRoutes from "./modules/notifications/notification.routes";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/risk", riskRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/payouts", payoutRoutes);
app.use("/api/v1/notifications", notificationRoutes);

// Webhook routes — no auth, signature verification instead
app.use("/api/v1/webhooks", webhookRoutes);

// ── Error handling ──────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
