import { sendEmail } from "@/lib/utils/email";
import { sendSMS } from "@/lib/utils/sms";
import { logger } from "@/lib/utils/logger";
import type { NotificationType } from "@/config/notifications";

interface NotificationPayload {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  email?: string;
  phone?: string;
}

export const notificationService = {
  // إرسال إشعار داخل التطبيق (سيتم حفظه في قاعدة البيانات لاحقاً)
  async sendInApp(payload: NotificationPayload): Promise<void> {
    logger.info(`[Notification] Sending in-app to user ${payload.userId}: ${payload.title}`);
    // يمكن استدعاء Supabase هنا لحفظ الإشعار في جدول notifications
    // await supabase.from('notifications').insert({...})
  },

  // إرسال إشعار عبر البريد الإلكتروني
  async sendEmail(payload: NotificationPayload): Promise<void> {
    if (!payload.email) return;
    const html = `<h1>${payload.title}</h1><p>${payload.message}</p>`;
    try {
      await sendEmail(payload.email, payload.title, html);
    } catch (error) {
      logger.error("Failed to send notification email", error);
    }
  },

  // إرسال إشعار عبر رسالة نصية SMS
  async sendSMS(payload: NotificationPayload): Promise<void> {
    if (!payload.phone) return;
    try {
      await sendSMS(payload.phone, `${payload.title}: ${payload.message}`);
    } catch (error) {
      logger.error("Failed to send notification SMS", error);
    }
  },

  // إرسال إشعار متعدد القنوات (كل الوسائل المتاحة)
  async notify(payload: NotificationPayload): Promise<void> {
    await this.sendInApp(payload);
    await this.sendEmail(payload);
    await this.sendSMS(payload);
  }
};
