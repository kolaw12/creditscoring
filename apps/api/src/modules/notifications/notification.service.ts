import prisma from "../../database";
import { NotificationType, NotificationStatus } from "@prisma/client";
import { renderTemplate, TemplateData } from "./templates/index";
import { sendEmail } from "./channels/email";
import { sendSms } from "./channels/sms";
import logger from "../../utils/logger";

interface SendNotificationInput {
  userId: string;
  templateName: string;
  data: TemplateData;
  channels?: NotificationType[];
  email?: string;
  phone?: string;
}

export class NotificationService {
  async sendNotification(input: SendNotificationInput): Promise<void> {
    const channels = input.channels || ["in_app", "email"];
    const template = renderTemplate(input.templateName, input.data);

    // Always create in-app notification
    if (channels.includes("in_app")) {
      await prisma.notification.create({
        data: {
          userId: input.userId,
          type: "in_app",
          subject: template.subject,
          body: template.body,
          metadata: { templateName: input.templateName, ...input.data },
          status: "delivered",
          sentAt: new Date(),
        },
      });
    }

    // Send email if configured
    if (channels.includes("email")) {
      const email = input.email || await this.getUserEmail(input.userId);
      if (email) {
        const sent = await sendEmail({
          to: email,
          subject: template.subject,
          body: template.body,
        });

        await prisma.notification.create({
          data: {
            userId: input.userId,
            type: "email",
            subject: template.subject,
            body: template.body,
            metadata: { templateName: input.templateName, email },
            status: sent ? "sent" : "failed",
            sentAt: sent ? new Date() : null,
          },
        });
      }
    }

    // Send SMS if configured
    if (channels.includes("sms") && template.smsBody) {
      const phone = input.phone || await this.getUserPhone(input.userId);
      if (phone) {
        const sent = await sendSms({
          to: phone,
          message: template.smsBody,
        });

        await prisma.notification.create({
          data: {
            userId: input.userId,
            type: "sms",
            body: template.smsBody,
            metadata: { templateName: input.templateName, phone },
            status: sent ? "sent" : "failed",
            sentAt: sent ? new Date() : null,
          },
        });
      }
    }
  }

  // Convenience methods for key events

  async notifyApplicationSubmitted(userId: string, applicationId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "application_submitted",
      data: { firstName: user.firstName, applicationId },
      email: user.email,
      phone: user.phone || undefined,
    });
  }

  async notifyApplicationApproved(userId: string, applicationId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "application_approved",
      data: { firstName: user.firstName, applicationId },
      email: user.email,
      phone: user.phone || undefined,
    });
  }

  async notifyApplicationDeclined(userId: string, applicationId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "application_declined",
      data: { firstName: user.firstName, applicationId },
      email: user.email,
    });
  }

  async notifyOfferCreated(userId: string, offerData: { amount: number; monthlyInstallment: number }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "offer_created",
      data: {
        firstName: user.firstName,
        amount: offerData.amount,
        monthlyInstallment: offerData.monthlyInstallment,
      },
      email: user.email,
      phone: user.phone || undefined,
    });
  }

  async notifyOfferAccepted(userId: string, loanNumber: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "offer_accepted",
      data: { firstName: user.firstName, loanNumber },
      email: user.email,
    });
  }

  async notifyDisbursement(userId: string, loanNumber: string, amount: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "disbursement_initiated",
      data: { firstName: user.firstName, loanNumber, amount },
      email: user.email,
      phone: user.phone || undefined,
    });
  }

  async notifyPaymentSuccessful(userId: string, loanNumber: string, amount: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "payment_successful",
      data: { firstName: user.firstName, loanNumber, amount },
      email: user.email,
    });
  }

  async notifyPaymentFailed(userId: string, loanNumber: string, amount: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "payment_failed",
      data: { firstName: user.firstName, loanNumber, amount },
      email: user.email,
    });
  }

  async notifyRepaymentReminder(userId: string, loanNumber: string, amount: number, dueDate: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "repayment_reminder",
      data: { firstName: user.firstName, loanNumber, amount, dueDate },
      email: user.email,
      phone: user.phone || undefined,
    });
  }

  async notifyLoanCompleted(userId: string, loanNumber: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.sendNotification({
      userId,
      templateName: "loan_completed",
      data: { firstName: user.firstName, loanNumber },
      email: user.email,
      phone: user.phone || undefined,
    });
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
    ]);

    return {
      data: notifications,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      return null;
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  private async getUserEmail(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    return user?.email || null;
  }

  private async getUserPhone(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });
    return user?.phone || null;
  }
}

export const notificationService = new NotificationService();
