import { config } from "../../../config";
import logger from "../../../utils/logger";

interface SmsOptions {
  to: string;
  message: string;
}

export async function sendSms(options: SmsOptions): Promise<boolean> {
  if (!config.sms.apiKey) {
    // Development fallback — log the SMS
    logger.info("SMS (dev mode — not sent)", {
      to: options.to,
      message: options.message,
    });
    return true;
  }

  try {
    // Termii SMS API integration
    const response = await fetch("https://api.termii.com/api/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: config.sms.apiKey,
        to: options.to,
        from: config.sms.senderId || "RentFin",
        sms: options.message,
        type: "plain",
        channel: "generic",
      }),
    });

    const result: any = await response.json();

    if (result.code === "200") {
      logger.info("SMS sent", { to: options.to });
      return true;
    } else {
      logger.error("SMS send failed", { to: options.to, result });
      return false;
    }
  } catch (error) {
    logger.error("SMS send error", { to: options.to, error });
    return false;
  }
}
