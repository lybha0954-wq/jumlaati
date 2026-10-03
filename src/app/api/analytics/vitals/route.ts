import { NextResponse } from "next/server";

/**
 * يستقبل Web Vitals metrics
 * حالياً: تسجيل فقط
 * لاحقاً: تخزين في DB أو إرسال لخدمة تحليل
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body.name !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // في التطوير: console
    if (process.env.NODE_ENV === "development") {
      console.log(`[vitals] ${body.name}: ${body.value}ms (${body.url})`);
    }

    // في الإنتاج: يمكن تسجيله في جدول analytics_events
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
