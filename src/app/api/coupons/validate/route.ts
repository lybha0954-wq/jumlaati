import { NextResponse } from 'next/server';
import { couponService } from '@/lib/services/couponService';
import { rateLimit, buildKey, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {

    // ═══ Rate Limit ═══
    const rlKey = buildKey(req);
    const rl = rateLimit(rlKey, { windowMs: 60000, max: 20 });
    if (!rl.allowed) return rateLimitResponse(rl);

    const { code } = await req.json();
    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

    const coupon = await couponService.validateCoupon(code);
    return NextResponse.json({
      valid: true,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      coupon,
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 400 });
  }
}
