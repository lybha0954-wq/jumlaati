import { NextResponse } from 'next/server';
import { commissionService } from '@/lib/services/commissionService';
import { rateLimit, buildKey, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // ═══ Rate Limit ═══
    const rlKey = buildKey(req);
    const rl = rateLimit(rlKey, { windowMs: 60000, max: 60 });
    if (!rl.allowed) return rateLimitResponse(rl);

    const body = await req.json().catch(() => ({}));
    const orderTotal = Number(body?.orderTotal);

    if (!isFinite(orderTotal) || orderTotal < 0 || orderTotal > 1_000_000_000) {
      return NextResponse.json({ error: 'قيمة غير صالحة' }, { status: 400 });
    }

    const commission = commissionService.calculateCommission(orderTotal);
    return NextResponse.json({ commission }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'خطأ في الحساب' }, { status: 400 });
  }
}
