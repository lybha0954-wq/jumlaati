import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { retailerService } from '@/lib/services/retailerService';
import { commissionService } from '@/lib/services/commissionService';
import { notificationService } from '@/lib/services/notificationService';
import { couponService } from '@/lib/services/couponService';
import { createOrderSchema } from '@/lib/validations/order.schema';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json([], { status: 401 });

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'retailer';

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (role === 'supplier') {
      query = query.eq('supplier_profile_id', user.id);
    } else if (role === 'retailer') {
      query = query.eq('retailer_profile_id', user.id);
    } else if (role === 'delivery') {
      query = query.eq('delivery_profile_id', user.id);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول أولاً' }, { status: 401 });

    const body = await req.json();
    const parsed = createOrderSchema.parse(body);

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    const buyerName = profile?.full_name || 'زبون';

    let discountPercent = 0;
    if (parsed.coupon_code) {
      const coupon = await couponService.validateCoupon(parsed.coupon_code);
      discountPercent = coupon.discount_percent;
      await couponService.incrementUsage(coupon.id);
    }

    const productIds = parsed.items.map((it: any) => it.productId);
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds);
    const nameById: Record<string, string> = {};
    (products || []).forEach((p: any) => { nameById[p.id] = p.name; });

    const groupedItems: Record<string, any[]> = {};
    for (const item of parsed.items as any[]) {
      const supplierId = item.wholesalerId || item.supplierId;
      if (!supplierId) continue;
      if (!groupedItems[supplierId]) groupedItems[supplierId] = [];
      groupedItems[supplierId].push(item);
    }

    const createdOrders = [];
    let idx = 0;
    for (const [supplierId, items] of Object.entries(groupedItems)) {
      const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
      const total = Math.round(subtotal - (subtotal * discountPercent) / 100);
      const commissionAmount = commissionService.calculateCommission(total);
      const orderNumber = `ORD-${Date.now()}-${idx++}-${Math.floor(Math.random() * 1000)}`;

      const order = await retailerService.createOrder({
        supplier_profile_id: supplierId,
        retailer_profile_id: user.id,
        buyer_name: buyerName,
        delivery_address: parsed.address,
        total,
        commission: commissionAmount,
        order_number: orderNumber,
        items: items.map((it: any) => ({
          product_id: it.productId,
          name: nameById[it.productId] || 'منتج',
          unit_price: it.price,
          quantity: it.quantity,
        })),
      });

      try {
        await commissionService.createCommission(order.id, user.id, supplierId, total);
      } catch (e) {
        console.error('[orders POST] commission failed:', e);
      }

      try {
        await notificationService.sendInApp({
          userId: supplierId,
          type: 'order',
          title: 'طلب جديد',
          message: `طلب بقيمة ${total.toLocaleString()} د.ع بانتظار معالجتك.`,
        });
      } catch (e) {
        console.error('[orders POST] notification failed:', e);
      }

      createdOrders.push(order);
    }

    return NextResponse.json({ success: true, orders: createdOrders }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
