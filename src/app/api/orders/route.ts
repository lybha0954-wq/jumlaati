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

    // ✅ اقرأ الدور من public.users — لا من JWT
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'retailer';

    let query = supabase
      .from('orders')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false });

    if (role === 'wholesaler') {
      query = query.eq('wholesaler_id', user.id);
    } else if (role === 'retailer') {
      query = query.eq('user_id', user.id);
    } else if (role === 'delivery') {
      query = query.eq('delivery_id', user.id);
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

    let discountPercent = 0;
    let appliedCouponId = null;
    if (parsed.coupon_code) {
      const coupon = await couponService.validateCoupon(parsed.coupon_code);
      discountPercent = coupon.discount_percent;
      appliedCouponId = coupon.id;
      await couponService.incrementUsage(coupon.id);
    }

    const groupedItems: { [wholesalerId: string]: typeof parsed.items } = {};
    for (const item of parsed.items) {
      if (!groupedItems[item.wholesalerId]) groupedItems[item.wholesalerId] = [];
      groupedItems[item.wholesalerId].push(item);
    }

    const retailerId = user.id;
    const createdOrders = [];

    for (const [wholesalerId, items] of Object.entries(groupedItems)) {
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal - (subtotal * discountPercent) / 100;

      const order = await retailerService.createOrder({
        user_id: retailerId,
        wholesaler_id: wholesalerId,
        items: items,
        total: total,
        address: parsed.address,
      });

      await commissionService.createCommission(order.id, retailerId, total);
      await notificationService.sendInApp({
        userId: wholesalerId,
        type: "order",
        title: "طلب جديد من تاجر تجزئة!",
        message: `طلب بقيمة ${total.toLocaleString()} د.ع بانتظار معالجتك.`,
      });

      createdOrders.push(order);
    }

    return NextResponse.json({ success: true, orders: createdOrders }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'فشل إنشاء الطلب' }, { status: 400 });
  }
}
