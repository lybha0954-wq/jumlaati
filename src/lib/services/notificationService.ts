import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/utils/email";
import { sendSMS } from "@/lib/utils/sms";
import { logger } from "@/lib/utils/logger";
import type { NotificationType } from "@/config/notifications";

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title?: string;
  message?: string;
  email?: string;
  phone?: string;
}

export const notificationService = {
  async sendInApp(payload: NotificationPayload): Promise<void> {
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("notifications").insert({
        user_id: payload.userId,
        type: payload.type,
        title: payload.title ?? null,
        message: payload.message ?? null,
      });
      if (error) throw new Error(error.message);
      logger.info(`[Notification] Sent to ${payload.userId}: ${payload.title ?? payload.type}`);
    } catch (err) {
      logger.error("Failed to send in-app notification", err);
      throw err;
    }
  },

  async sendEmail(payload: NotificationPayload): Promise<void> {
    if (!payload.email) return;
    const html = `<h1>${payload.title ?? ""}</h1><p>${payload.message ?? ""}</p>`;
    try {
      await sendEmail(payload.email, payload.title ?? "إشعار", html);
    } catch (err) {
      logger.error("Failed to send notification email", err);
    }
  },

  async sendSMS(payload: NotificationPayload): Promise<void> {
    if (!payload.phone) return;
    try {
      await sendSMS(payload.phone, `${payload.title ?? ""}: ${payload.message ?? ""}`);
    } catch (err) {
      logger.error("Failed to send notification SMS", err);
    }
  },
};
