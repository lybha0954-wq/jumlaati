import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { couponService } from '@/lib/services/couponService';
import { requireFeature } from "@/lib/feature-flags";

export async function GET() {
  try {
    const guard = await requireFeature("coupons");
    if (guard) return guard;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const coupons = await couponService.getAllCoupons();
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const guard = await requireFeature("coupons");
    if (guard) return guard;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const coupon = await couponService.createCoupon({
      code: body.code,
      discount_type: body.discount_type || 'percent',
      discount_value: Number(body.discount_value || 0),
      max_uses: Number(body.max_uses || 100),
      min_order: Number(body.min_order || 0),
      valid_to: body.valid_to || null,
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
