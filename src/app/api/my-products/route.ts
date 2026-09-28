import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/my-products
 * يُعيد منتجات التاجر الحالي فقط.
 * يُستخدم في صفحة "منتجاتي" الخاصة بتاجر الجملة.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "unauthorized", products: [] },
        { status: 401 }
      );
    }

    // قراءة الدور
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role;

    // المدير يرى كل المنتجات
    if (role === "admin" || role === "owner") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json(
          { ok: false, error: error.message, products: [] },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true, products: data || [] });
    }

    // التاجر يرى منتجاته فقط
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("supplier_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, products: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, products: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ غير متوقع", products: [] },
      { status: 500 }
    );
  }
}
