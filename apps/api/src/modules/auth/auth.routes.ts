import { Router, type Router as RouterType } from "express";
import { authController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/auth";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
} from "../../utils/validation";

const router: ReturnType<typeof Router> = Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", validate(forgotPasswordSchema), (_req, res) => {
  // TODO: Implement forgot password (Phase 8 — notifications)
  res.json({ success: true, message: "If an account exists, a reset link has been sent" });
});
router.post("/reset-password", (_req, res) => {
  // TODO: Implement reset password (Phase 8 — notifications)
  res.json({ success: true, message: "Password reset not yet implemented" });
});
router.get("/me", authenticate as any, authController.getProfile as any);

export default router;
