import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* ═══════════════════════════════════════════════════
   🌱 seed — أعمدة صحيحة بعد introspection
   ═══════════════════════════════════════════════════ */

const DEMO_PRODUCTS = [
  { name: "شاي العروسة 500g",  price: 5500,  category: "مشروبات",     stock: 120 },
  { name: "سكر ناعم 1kg",       price: 1750,  category: "مواد غذائية",  stock: 200 },
  { name: "زيت عافية 1.5L",     price: 4800,  category: "زيوت",         stock: 80 },
  { name: "معكرونة اسباجتي",    price: 1200,  category: "مواد غذائية",  stock: 300 },
  { name: "عصير برتقال 1L",     price: 2750,  category: "مشروبات",      stock: 150 },
  { name: "شامبو للشعر",        price: 6000,  category: "منظفات",       stock: 45 },
  { name: "معجون أسنان",        price: 3500,  category: "عناية",        stock: 90 },
  { name: "أرز بسمتي 5kg",      price: 18000, category: "مواد غذائية",  stock: 30 },
];

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin" && profile?.role !== "owner") {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }

    const log: string[] = [];

    // 1) نجلب كل المستخدمين
    const { data: users } = await supabase
      .from("user_profiles")
      .select("id, role, full_name");

    const supplier = users?.find((u: any) => u.role === "supplier");
    const retailer = users?.find((u: any) => u.role === "retailer");
    const delivery = users?.find((u: any) => u.role === "delivery");

    if (!supplier) {
      return NextResponse.json(
        { ok: false, error: "لا يوجد تاجر جملة — سجّل واحداً أولاً" },
        { status: 400 }
      );
    }

    log.push(`✅ مورد: ${supplier.full_name}`);

    // 2) إضافة المنتجات — لكن نربطها بالموّرد
    const { data: existing } = await supabase
      .from("products")
      .select("id, name, supplier_id");

    // ربط المنتجات اليتيمة
    const orphans = (existing || []).filter((p: any) => !p.supplier_id);
    if (orphans.length > 0) {
      await supabase
        .from("products")
        .update({ supplier_id: supplier.id })
        .in("id", orphans.map((p: any) => p.id));
      log.push(`✅ رُبطت ${orphans.length} منتجات يتيمة بـ ${supplier.full_name}`);
    }

    // إضافة منتجات جديدة
    const existingNames = new Set((existing || []).map((p: any) => p.name));
    const newProducts = DEMO_PRODUCTS.filter((p) => !existingNames.has(p.name));

    if (newProducts.length > 0) {
      const toInsert = newProducts.map((p) => ({
        supplier_id: supplier.id,
        name: p.name,
        final_price: p.price,
        cost_price: Math.round(p.price * 0.7),
        stock: p.stock,
        category: p.category,
        status: "متوفر",
        unit: "قطعة",
      }));

      const { error: pErr } = await supabase.from("products").insert(toInsert);
      if (pErr) log.push(`⚠️ فشل إدراج: ${pErr.message}`);
      else log.push(`✅ أُضيفت ${toInsert.length} منتجات`);
    } else {
      log.push("ℹ️ كل المنتجات موجودة");
    }

    // 3) إنشاء الطلبات — بأعمدة صحيحة
    if (retailer) {
      // نحذف الطلبات التجريبية القديمة
      await supabase.from("orders").delete().like("order_number", "DEMO-%");

      // نجلب المنتجات الفعلية
      const { data: allProducts } = await supabase
        .from("products")
        .select("id, name, final_price")
        .eq("supplier_id", supplier.id)
        .limit(6);

      if (allProducts && allProducts.length > 0) {
        const statuses = ["reviewing", "delivering", "completed", "cancelled"];

        for (let i = 0; i < statuses.length; i++) {
          const status = statuses[i];
          const productCount = 2 + (i % 3);
          let total = 0;
          const items: any[] = [];

          for (let j = 0; j < productCount; j++) {
            const p = allProducts[(i + j) % allProducts.length];
            const qty = 1 + ((i + j) % 5);
            const price = Number(p.final_price || 0);
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
          const createdAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();

          // نجرب إدراج بأعمدة معروفة من الكود
          const { data: order, error: orderErr } = await supabase
            .from("orders")
            .insert({
              order_number: orderNumber,
              status: status,
              payment_status: status === "completed" ? "paid" : "pending",
              total: total,
              commission: Math.round(total * 0.01),
              buyer_name: retailer.full_name || "سوبرماركت",
              delivery_address: "كربلاء المقدسة — حي الحسين — محل " + (10 + i),
              retailer_profile_id: retailer.id,
              supplier_profile_id: supplier.id,
              delivery_profile_id: delivery?.id || null,
              created_at: createdAt,
            })
            .select()
            .single();

          if (orderErr) {
            log.push(`⚠️ فشل طلب ${i}: ${orderErr.message}`);
            continue;
          }

          // الأصناف
          const itemsInsert = items.map((it) => ({
            order_id: order.id,
            product_id: it.product_id,
            quantity: it.quantity,
            unit_price: it.unit_price,
            price: it.unit_price,
            subtotal: it.subtotal,
          }));

          const { error: itErr } = await supabase.from("order_items").insert(itemsInsert);
          if (itErr) log.push(`⚠️ أصناف طلب ${i}: ${itErr.message}`);
        }

        log.push(`✅ أُنشئت ${statuses.length} طلبات`);
      }
    } else {
      log.push("⚠️ لا يوجد سوبرماركت — لم نُنشئ طلبات");
    }

    return NextResponse.json({ ok: true, message: "تم 🌱", log });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "خطأ" },
      { status: 500 }
    );
  }
}

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

    // حذف الطلبات التجريبية
    await supabase.from("orders").delete().like("order_number", "DEMO-%");

    return NextResponse.json({ ok: true, message: "حُذفت البيانات التجريبية" });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "خطأ" }, { status: 500 });
  }
}
