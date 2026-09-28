import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/dev/debug
 * يعرض تشخيصاً كاملاً لحالة المستخدم والمنتجات.
 * فقط للمستخدمين المسجّلين.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "not logged in", user: null },
        { status: 401 }
      );
    }

    // ملف المستخدم
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    // كل المنتجات (بدون فلترة)
    const { data: allProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, name, supplier_id, status, final_price, price")
      .order("created_at", { ascending: false });

    // منتجات المستخدم الحالي فقط
    const { data: myProducts } = await supabase
      .from("products")
      .select("id, name, supplier_id")
      .eq("supplier_id", user.id);

    // قائمة كل الموردين
    const { data: allSuppliers } = await supabase
      .from("user_profiles")
      .select("id, full_name, email, role")
      .eq("role", "supplier");

    return NextResponse.json({
      ok: true,
      currentUser: {
        id: user.id,
        email: user.email,
        meta_role: user.user_metadata?.role,
      },
      profile: profile || null,
      counts: {
        allProducts: allProducts?.length || 0,
        myProducts: myProducts?.length || 0,
        allSuppliers: allSuppliers?.length || 0,
      },
      myProducts: myProducts || [],
      allProductsSummary: (allProducts || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        supplier_id: p.supplier_id,
        status: p.status,
        is_mine: p.supplier_id === user.id,
      })),
      allSuppliers: allSuppliers || [],
      error: prodErr?.message || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ", user: null },
      { status: 500 }
    );
  }
}
