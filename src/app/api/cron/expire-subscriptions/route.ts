import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Cron Endpoint — يُستدعى يومياً
 * يحوّل الاشتراكات المنتهية من "active" إلى "expired"
 *
 * الاستدعاء:
 *   GET /api/cron/expire-subscriptions
 *   مع header: x-cron-secret: <secret>
 */
export async function GET(req: Request) {
  try {
    // حماية: سر خاص
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const provided = req.headers.get("x-cron-secret");
      if (provided !== secret) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
    }

    const supabase = await createClient();
    const now = new Date().toISOString();

    // جلب الاشتراكات المنتهية
    const { data: expired, error: getErr } = await supabase
      .from("user_subscriptions")
      .select("id, user_id, plan_key, expires_at")
      .eq("status", "active")
      .lt("expires_at", now);

    if (getErr) {
      return NextResponse.json({ error: getErr.message }, { status: 500 });
    }

    if (!expired || expired.length === 0) {
      return NextResponse.json({ ok: true, expired: 0 });
    }

    // تحديث الحالة
    const ids = expired.map((s: any) => s.id);
    const { error: updErr } = await supabase
      .from("user_subscriptions")
      .update({ status: "expired" })
      .in("id", ids);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // إشعارات Push للمستخدمين (اختياري)
    try {
      for (const sub of expired) {
        await supabase.from("notifications").insert({
          user_id: sub.user_id,
          type: "info",
          title: "انتهى اشتراكك",
          body: `باقة "${sub.plan_key}" انتهت — جدّد لمواصلة الميزات`,
        });
      }
    } catch (e) {
      console.error("[cron/expire-subs] notifications failed:", e);
    }

    return NextResponse.json({
      ok: true,
      expired: expired.length,
      ids,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
