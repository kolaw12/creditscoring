import nodemailer from "nodemailer";
import { config } from "../../../config";
import logger from "../../../utils/logger";

interface EmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

// Create transporter — configured per environment
function createTransporter() {
  if (config.env === "development" && !config.email.smtpHost) {
    // Use ethereal for development
    return null;
  }

  return nodemailer.createTransport({
    host: config.email.smtpHost,
    port: config.email.smtpPort,
    secure: config.email.smtpPort === 465,
    auth: {
      user: config.email.smtpUser,
      pass: config.email.smtpPass,
    },
  });
}

function textToHtml(text: string): string {
  return text
    .split("\n")
    .map((line) => `<p style="margin:0 0 12px 0;">${line}</p>`)
    .join("");
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const transporter = createTransporter();

  if (!transporter) {
    // Development fallback — log the email
    logger.info("EMAIL (dev mode — not sent)", {
      to: options.to,
      subject: options.subject,
      body: options.body,
    });
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      text: options.body,
      html: options.html || textToHtml(options.body),
    });

    logger.info("Email sent", {
      to: options.to,
      subject: options.subject,
      messageId: info.messageId,
    });
    return true;
  } catch (error) {
    logger.error("Failed to send email", { to: options.to, error });
    return false;
  }
}
