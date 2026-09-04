import { NextResponse } from 'next/server';
import { couponService } from '@/lib/services/couponService';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

    const coupon = await couponService.validateCoupon(code);
    return NextResponse.json({ valid: true, discount_percent: coupon.discount_percent, coupon });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 400 });
  }
}
