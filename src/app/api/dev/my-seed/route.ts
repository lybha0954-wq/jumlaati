import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/dev/my-seed
 * يُنشئ منتجات تجريبية لحساب المستخدم الحالي (supplier).
 * لا يحتاج admin — يعمل بأي حساب مسجّل.
 */

const DEMO_PRODUCTS = [
  { name: "شاي العروسة 500g",   price: 5500,  category: "مشروبات",     stock: 120 },
  { name: "سكر ناعم 1kg",        price: 1750,  category: "مواد غذائية",  stock: 200 },
  { name: "زيت عافية 1.5L",      price: 4800,  category: "زيوت",        stock: 80 },
  { name: "معكرونة اسباجتي",     price: 1200,  category: "مواد غذائية",  stock: 300 },
  { name: "عصير برتقال 1L",      price: 2750,  category: "مشروبات",     stock: 150 },
  { name: "شامبو للشعر",         price: 6000,  category: "منظفات",      stock: 45 },
  { name: "معجون أسنان",         price: 3500,  category: "عناية",       stock: 90 },
  { name: "أرز بسمتي 5kg",       price: 18000, category: "مواد غذائية",  stock: 30 },
];

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    // فحص الدور — فقط supplier أو admin
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role;
    if (role !== "supplier" && role !== "admin" && role !== "owner") {
      return NextResponse.json(
        { ok: false, error: "هذه الأداة للتجار أو المديرين فقط" },
        { status: 403 }
      );
    }

    // حذف منتجاتنا القديمة (بنفس الأسماء فقط — لا نلمس منتجات أخرى)
    const names = DEMO_PRODUCTS.map((p) => p.name);
    await supabase
      .from("products")
      .delete()
      .eq("supplier_id", user.id)
      .in("name", names);

    // إضافة المنتجات
    const toInsert = DEMO_PRODUCTS.map((p) => ({
      supplier_id: user.id,
      name: p.name,
      final_price: p.price,
      cost_price: Math.round(p.price * 0.7),
      stock: p.stock,
      category: p.category,
      status: "متوفر",
      unit: "قطعة",
    }));

    const { data, error } = await supabase
      .from("products")
      .insert(toInsert)
      .select("id, name, final_price");

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `تمت إضافة ${data?.length || 0} منتجات لحسابك 🌱`,
      products: data || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
