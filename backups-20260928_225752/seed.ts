import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* ═══════════════════════════════════════════════════
   🌱 بيانات تجريبية — جُمْلَتِي
   تُستخدم للتقييم والاختبار فقط.
   ═══════════════════════════════════════════════════ */

const DEMO_PRODUCTS = [
  { name: "شاي العروسة 500g",  price: 5500,  category: "مشروبات",  stock: 120 },
  { name: "سكر ناعم 1kg",       price: 1750,  category: "مواد غذائية", stock: 200 },
  { name: "زيت عافية 1.5L",     price: 4800,  category: "زيوت",     stock: 80 },
  { name: "معكرونة اسباجتي",    price: 1200,  category: "مواد غذائية", stock: 300 },
  { name: "عصير برتقال 1L",     price: 2750,  category: "مشروبات",  stock: 150 },
  { name: "شامبو للشعر",        price: 6000,  category: "منظفات",   stock: 45 },
  { name: "معجون أسنان",        price: 3500,  category: "عناية",    stock: 90 },
  { name: "أرز بسمتي 5kg",      price: 18000, category: "مواد غذائية", stock: 30 },
  { name: "دقيق فاخر 10kg",     price: 12000, category: "مواد غذائية", stock: 25 },
  { name: "تمر مجدول 1kg",      price: 8000,  category: "حلويات",   stock: 60 },
  { name: "حليب طويل الأجل",    price: 2000,  category: "ألبان",    stock: 180 },
  { name: "شاي أخضر بالنعنع",   price: 4500,  category: "مشروبات",  stock: 70 },
];

/* ═══════════════════════════════════════════════════ */

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    // التحقق: admin فقط
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin" && profile?.role !== "owner") {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    const log: string[] = [];

    // 1) جلب الحسابات الموجودة
    const { data: users } = await supabase
      .from("user_profiles")
      .select("id, role, full_name");

    const supplier = users?.find((u: any) => u.role === "supplier");
    const retailer = users?.find((u: any) => u.role === "retailer");
    const delivery = users?.find((u: any) => u.role === "delivery");

    if (!supplier || !retailer) {
      return NextResponse.json(
        { ok: false, error: "يلزم وجود تاجر جملة وسوبرماركت واحد على الأقل" },
        { status: 400 }
      );
    }

    log.push(`✅ وجدت الحسابات: مورد=${supplier.full_name}، سوبرماركت=${retailer.full_name}`);

    // 2) إضافة المنتجات (نتجاهل الموجود)
    const { data: existingProducts } = await supabase
      .from("products")
      .select("name")
      .eq("supplier_id", supplier.id);

    const existingNames = new Set((existingProducts || []).map((p: any) => p.name));
    const newProducts = DEMO_PRODUCTS.filter((p) => !existingNames.has(p.name));

    if (newProducts.length > 0) {
      const productsToInsert = newProducts.map((p) => ({
        supplier_id: supplier.id,
        name: p.name,
        final_price: p.price,
        price: p.price,
        cost_price: Math.round(p.price * 0.7),
        stock: p.stock,
        category: p.category,
        status: "متوفر",
        unit: "قطعة",
      }));

      const { error: prodErr, data: insertedProds } = await supabase
        .from("products")
        .insert(productsToInsert)
        .select("id, name, final_price");

      if (prodErr) {
        log.push(`⚠️ فشل إدراج المنتجات: ${prodErr.message}`);
      } else {
        log.push(`✅ أُضيفت ${insertedProds?.length || 0} منتجات`);
      }
    } else {
      log.push(`ℹ️ المنتجات موجودة مسبقاً`);
    }

    // 3) جلب المنتجات الفعلية (الموجودة + الجديدة)
    const { data: allProducts } = await supabase
      .from("products")
      .select("id, name, final_price, price")
      .eq("supplier_id", supplier.id)
      .limit(6);

    if (!allProducts || allProducts.length === 0) {
      return NextResponse.json(
        { ok: false, error: "لا توجد منتجات للاستخدام" },
        { status: 400 }
      );
    }

    // 4) حذف الطلبات التجريبية القديمة
    await supabase
      .from("orders")
      .delete()
      .eq("retailer_profile_id", retailer.id)
      .like("order_number", "DEMO-%");

    log.push("🗑️ حُذفت الطلبات التجريبية القديمة");

    // 5) إنشاء 5 طلبات بحالات مختلفة
    const statuses = ["reviewing", "processing", "shipped", "delivered", "cancelled"];
    const deliveryIds = [
      null,
      null,
      delivery?.id || null,
      delivery?.id || null,
      null,
    ];

    const createdOrders: any[] = [];

    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      const productCount = 2 + (i % 3); // 2-4 منتجات
      const items = [];

      let total = 0;
      for (let j = 0; j < productCount; j++) {
        const p = allProducts[(i + j) % allProducts.length];
        const qty = 1 + ((i + j) % 5);
        const price = Number(p.final_price || p.price || 0);
        const subtotal = price * qty;
        total += subtotal;
        items.push({
          product_id: p.id,
          name: p.name,
          unit_price: price,
          quantity: qty,
          subtotal,
        });
      }

      const orderNumber = `DEMO-${Date.now()}-${i}`;

      // حساب تاريخ مختلف لكل طلب
      const createdAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          status: status,
          payment_status: status === "delivered" ? "paid" : "pending",
          total: total,
          commission: Math.round(total * 0.01),
          buyer_name: retailer.full_name || "سوبرماركت",
          delivery_address: "كربلاء المقدسة — حي الحسين — شارع الجمهورية — محل " + (10 + i),
          retailer_profile_id: retailer.id,
          supplier_profile_id: supplier.id,
          delivery_profile_id: deliveryIds[i],
          created_at: createdAt,
        })
        .select()
        .single();

      if (orderErr) {
        log.push(`⚠️ فشل إنشاء طلب: ${orderErr.message}`);
        continue;
      }

      createdOrders.push(order);

      // إدراج الأصناف
      const itemsToInsert = items.map((it) => ({
        order_id: order.id,
        product_id: it.product_id,
        quantity: it.quantity,
        unit_price: it.unit_price,
        price: it.unit_price,
        subtotal: it.subtotal,
      }));

      const { error: itemsErr } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsErr) {
        log.push(`⚠️ فشل إدراج الأصناف: ${itemsErr.message}`);
      }
    }

    log.push(`✅ أُنشئت ${createdOrders.length} طلبات بحالات مختلفة`);

    return NextResponse.json({
      ok: true,
      message: "تم إنشاء البيانات التجريبية بنجاح 🌱",
      log,
      counts: {
        products: allProducts.length,
        orders: createdOrders.length,
      },
    });
  } catch (err: any) {
    console.error("[seed] error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ غير متوقع" },
      { status: 500 }
    );
  }
}

/* ═══════════════════════════════════════════════════ */

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin" && profile?.role !== "owner") {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    // حذف الطلبات التجريبية (order_items تُحذف بـ cascade)
    const { error } = await supabase
      .from("orders")
      .delete()
      .like("order_number", "DEMO-%");

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // حذف المنتجات التي تبدأ بـ أسماء تجريبية
    await supabase
      .from("products")
      .delete()
      .in("name", DEMO_PRODUCTS.map((p) => p.name));

    return NextResponse.json({
      ok: true,
      message: "تم حذف البيانات التجريبية 🗑️",
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ غير متوقع" },
      { status: 500 }
    );
  }
}
