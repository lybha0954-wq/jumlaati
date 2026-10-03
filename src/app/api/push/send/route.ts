import { NextResponse } from "next/server";

/**
 * ⚠️ Push Notifications — قيد التطوير
 *
 * مكتبة `web-push` تعتمد على Node crypto, ولا تعمل على Cloudflare Workers.
 * البديل: @pushforge/builder (سنتعامل معه في جلسة منفصلة)
 *
 * حالياً: نُعيد 503 مع رسالة واضحة (بلا crash).
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Push notifications are coming soon",
      message: "الإشعارات الفورية قيد التطوير — قريباً",
      code: "PUSH_NOT_AVAILABLE",
    },
    { status: 503 }
  );
}

export async function GET() {
  return NextResponse.json(
    { status: "coming_soon", message: "Push notifications in development" },
    { status: 503 }
  );
}
