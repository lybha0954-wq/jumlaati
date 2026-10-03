import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * فحص صحة قاعدة البيانات
 * admin فقط
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // فحص admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    // ═══ فحوصات ═══
    const start = Date.now();

    // 1) Latency
    await supabase.from("profiles").select("id").limit(1);
    const latency = Date.now() - start;

    // 2) إحصائيات الجداول الرئيسية
    const [
      { count: profilesCount },
      { count: ordersCount },
      { count: productsCount },
      { count: notificationsCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("notifications").select("*", { count: "exact", head: true }),
    ]);

    // 3) آخر نشاط
    const { data: lastOrder } = await supabase
      .from("orders")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      latency_ms: latency,
      counts: {
        profiles: profilesCount || 0,
        orders: ordersCount || 0,
        products: productsCount || 0,
        notifications: notificationsCount || 0,
      },
      last_activity: lastOrder?.created_at || null,
      checked_at: new Date().toISOString(),
      status: latency < 300 ? "healthy" : latency < 1000 ? "degraded" : "slow",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e.message },
      { status: 500 }
    );
  }
}
