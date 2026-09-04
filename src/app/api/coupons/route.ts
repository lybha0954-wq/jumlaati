import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { couponService } from '@/lib/services/couponService';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: adminCheck } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (adminCheck?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const coupons = await couponService.getAllCoupons();
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, discount_percent, max_uses } = await req.json();
    const coupon = await couponService.createCoupon(code, discount_percent, max_uses);
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
