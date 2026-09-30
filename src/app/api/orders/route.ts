import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 401 });

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const role = profile?.role || 'retailer';

    let query = supabase
      .from('orders')
      .select(`
        id, order_number, status, payment_status,
        subtotal, delivery_fee, commission, total_amount,
        buyer_name, delivery_address,
        retailer_id, supplier_id, delivery_id,
        created_at, accepted_at, shipped_at,
        picked_up_at, delivered_at, cancelled_at
      `)
      .order('created_at', { ascending: false });

    if (role === 'supplier') {
      query = query.eq('supplier_id', user.id);
    } else if (role === 'retailer') {
      query = query.eq('retailer_id', user.id);
    } else if (role === 'delivery') {
      query = query.eq('delivery_id', user.id);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[api/orders] query error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const ids = new Set<string>();
    (data || []).forEach((o: any) => {
      if (o.retailer_id) ids.add(o.retailer_id);
      if (o.supplier_id) ids.add(o.supplier_id);
      if (o.delivery_id) ids.add(o.delivery_id);
    });

    let nameMap: Record<string, string> = {};
    if (ids.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(ids));
      (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name; });
    }

    const orders = (data || []).map((o: any) => ({
      ...o,
      retailer_name: o.retailer_id ? nameMap[o.retailer_id] : null,
      supplier_name: o.supplier_id ? nameMap[o.supplier_id] : null,
      delivery_name: o.delivery_id ? nameMap[o.delivery_id] : null,
    }));

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('[api/orders] catch:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });

    const body = await req.json();
    const { supplier_id, items, delivery_address, buyer_name, coupon_code, payment_method } = body;

    // ═══ ثوابت النموذج المالي ═══
    const DELIVERY_FEE = 3000;        // رسوم التوصيل على السوبرماركت
    const DELIVERY_SHARE = 2000;      // حصة المندوب
    const PLATFORM_COMMISSION_RATE = 0.01; // 1% على تاجر الجملة


    if (!supplier_id || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    const productIds = items.map((i: any) => i.product_id);
    const { data: prods } = await supabase
      .from('products')
      .select('id, name, price, supplier_id, stock_quantity')
      .in('id', productIds);

    if (!prods || prods.length === 0) {
      return NextResponse.json({ error: 'المنتجات غير موجودة' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems: any[] = [];
    for (const item of items) {
      const p = prods.find((x: any) => x.id === item.product_id);
      if (!p) continue;
      if (p.supplier_id !== supplier_id) continue;
      const qty = Number(item.quantity) || 0;
      if (qty <= 0) continue;
      if (Number(p.stock_quantity) < qty) {
        return NextResponse.json(
          { error: `الكمية المتوفرة من "${p.name}" ${p.stock_quantity} فقط` },
          { status: 400 }
        );
      }
      const lineTotal = Number(p.price) * qty;
      subtotal += lineTotal;
      orderItems.push({
        product_id: p.id,
        product_name: p.name,
        quantity: qty,
        unit_price: Number(p.price),
        subtotal: lineTotal,
        current_stock: Number(p.stock_quantity),
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json({ error: 'لا أصناف صالحة' }, { status: 400 });
    }

    // ═══ حساب الخصم (كوبون) ═══
    let discount = 0;
    let couponId: string | null = null;
    if (coupon_code) {
      try {
        const { data: c } = await supabase
          .from('coupons')
          .select('*')
          .eq('code', String(coupon_code).toUpperCase().trim())
          .eq('is_active', true)
          .maybeSingle();

        if (c) {
          const minOrder = Number(c.min_order || 0);
          const validNow = !c.valid_to || new Date(c.valid_to) >= new Date();
          const notExhausted = c.used_count < c.max_uses;
          if (validNow && notExhausted && subtotal >= minOrder) {
            if (c.discount_type === 'percent') {
              discount = Math.round(subtotal * (Number(c.discount_value) / 100));
            } else {
              discount = Math.min(Number(c.discount_value), subtotal);
            }
            couponId = c.id;
          }
        }
      } catch (e) {
        console.error('[api/orders] coupon apply failed:', e);
      }
    }

    // ═══ النموذج المالي ═══
    const delivery_fee = DELIVERY_FEE;
    const commission = Math.round(subtotal * PLATFORM_COMMISSION_RATE);
    const total_amount = Math.max(0, subtotal + delivery_fee - discount);

    // ═══ الحصص ═══
    // السوبرماركت: total_amount (subtotal + delivery - discount)
    // التاجر يستلم: subtotal - commission
    // المندوب يستلم: DELIVERY_SHARE
    // المنصة تستلم: commission + (delivery_fee - DELIVERY_SHARE)
    const supplier_net = subtotal - commission;
    const delivery_net = DELIVERY_SHARE;
    const platform_net = commission + (delivery_fee - DELIVERY_SHARE);

    const orderNumber = `ORD-${Date.now()}`;
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        retailer_id: user.id,
        supplier_id,
        status: 'pending',
        payment_status: 'unpaid',
        subtotal,
        delivery_fee,
        commission,
        total_amount,
        buyer_name: buyer_name || null,
        delivery_address: delivery_address || null,
        notes: discount > 0 ? `خصم كوبون: ${discount} د.ع` : null,
        payment_method: payment_method || 'cash',
      })
      .select()
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: orderErr?.message || 'فشل إنشاء الطلب' },
        { status: 500 }
      );
    }

    // Insert order items (without current_stock field)
    const rows = orderItems.map(({ current_stock, ...it }) => ({
      ...it,
      order_id: order.id,
    }));
    const { error: itemsErr } = await supabase.from('order_items').insert(rows);
    if (itemsErr) {
      return NextResponse.json({ error: itemsErr.message }, { status: 500 });
    }

    // Decrement stock
    const stockErrors: string[] = [];
    for (const it of orderItems) {
      const newStock = Math.max(0, it.current_stock - it.quantity);
      const { error: stockErr } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', it.product_id);
      if (stockErr) {
        stockErrors.push(`منتج #${it.product_id}: ${stockErr.message}`);
      }
    }

    // ═══ زيادة استخدام الكوبون ═══
    if (couponId) {
      try {
        const { data: c } = await supabase
          .from('coupons').select('used_count').eq('id', couponId).single();
        await supabase
          .from('coupons')
          .update({ used_count: (c?.used_count || 0) + 1 })
          .eq('id', couponId);
      } catch (e) {
        console.error('[api/orders] coupon increment failed:', e);
      }
    }

    // Notify supplier
    try {
      await supabase.from('notifications').insert({
        user_id: supplier_id,
        type: 'order',
        title: 'طلب جديد ' + orderNumber,
        body: 'بقيمة ' + total_amount + ' د.ع',
        order_id: order.id,
      });
    } catch (e) {
      console.error('[api/orders] notification failed:', e);
    }

    return NextResponse.json({
      ok: true,
      order,
      breakdown: {
        subtotal,
        discount,
        delivery_fee,
        total_amount,
        commission,
        supplier_net,
        delivery_net,
        platform_net,
      },
      stock_warnings: stockErrors.length > 0 ? stockErrors : undefined,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
