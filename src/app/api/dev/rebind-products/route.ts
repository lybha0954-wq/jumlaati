import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/dev/rebind-products
 * يربط المنتجات اليتيمة (supplier_id = null) بالمستخدم الحالي.
 * يجب أن يكون المستخدم supplier.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "supplier" && profile?.role !== "admin") {
      return NextResponse.json(
        { ok: false, error: "فقط للتجار أو المديرين" },
        { status: 403 }
      );
    }

    // نجلب المنتجات اليتيمة أولاً
    const { data: orphans, error: fetchErr } = await supabase
      .from("products")
      .select("id, name")
      .is("supplier_id", null);

    if (fetchErr) {
      return NextResponse.json({ ok: false, error: fetchErr.message }, { status: 500 });
    }

    if (!orphans || orphans.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "لا توجد منتجات يتيمة",
        bound: 0,
      });
    }

    // نربطها بالمستخدم الحالي
    const ids = orphans.map((p: any) => p.id);
    const { error: updateErr } = await supabase
      .from("products")
      .update({ supplier_id: user.id })
      .in("id", ids);

    if (updateErr) {
      return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: `تم ربط ${ids.length} منتج بـ ${profile.full_name} 🌱`,
      bound: ids.length,
      products: orphans,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ" },
      { status: 500 }
    );
  }
}
