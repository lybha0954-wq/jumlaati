import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@jumlati.iq";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    throw new Error("VAPID keys missing");
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  configured = true;
}

export interface PushPayload {
  title: string;
  body?: string;
  url?: string;
  tag?: string;
}

/**
 * يُرسل إشعار Push لكل اشتراكات مستخدم معيّن.
 * يحذف الاشتراكات المنتهية تلقائياً.
 * آمن: لا يُلقي أخطاء (يُسجّل فقط).
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<number> {
  try {
    ensureConfigured();
    const supabase = await createClient();

    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", userId);

    if (!subs || subs.length === 0) return 0;

    const json = JSON.stringify(payload);
    let sent = 0;

    for (const s of subs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          json
        );
        sent++;
      } catch (err: any) {
        // 410 / 404 = اشتراك منتهي → احذفه
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", s.id);
        }
      }
    }
    return sent;
  } catch (e) {
    console.error("[push/sendToUser] failed:", e);
    return 0;
  }
}
