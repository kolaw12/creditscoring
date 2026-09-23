import { Router, type Router as RouterType } from "express";
import { authenticate } from "../../middleware/auth";
import { notificationService } from "./notification.service";

const router: ReturnType<typeof Router> = Router();

router.use(authenticate as any);

// Get notifications
router.get("/", async (req: any, res: any, next: any) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const result = await notificationService.getUserNotifications(req.user.id, page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// Get unread count
router.get("/unread-count", async (req: any, res: any, next: any) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
});

// Mark one as read
router.patch("/:id/read", async (req: any, res: any, next: any) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
});

// Mark all as read
router.patch("/read-all", async (req: any, res: any, next: any) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
});

export default router;
