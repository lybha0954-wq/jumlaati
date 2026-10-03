/**
 * Push Sender — معطّل مؤقتاً
 *
 * السبب: مكتبة `web-push` لا تعمل على Cloudflare Workers
 * (تعتمد على Node crypto).
 *
 * البديل القادم: @pushforge/builder أو Supabase Edge Functions.
 * حالياً: نُعيد 0 بصمت (لا يُسبب crash، فقط لا يُرسل).
 */

export interface PushPayload {
  title: string;
  body?: string;
  url?: string;
  tag?: string;
}

/**
 * Stub — يُعيد 0 دائماً.
 * لا يُرسل أي إشعار حتى نُفعّل Push الحقيقي.
 */
export async function sendPushToUser(
  _userId: string,
  _payload: PushPayload
): Promise<number> {
  // Push in development — لا شيء يُرسل الآن
  return 0;
}
