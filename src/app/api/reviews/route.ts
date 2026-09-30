import { NextResponse } from 'next/server';
import { reviewService } from '@/lib/services/reviewService';
import { reviewSchema } from '@/lib/validations/review.schema';
import { requireFeature } from "@/lib/feature-flags";
import { rateLimit, buildKey, rateLimitResponse } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

  try {
    const data = await reviewService.getProductReviews(productId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {

    // ═══ Rate Limit ═══
    const rlKey = buildKey(req);
    const rl = rateLimit(rlKey, { windowMs: 60000, max: 10 });
    if (!rl.allowed) return rateLimitResponse(rl);

    const guard = await requireFeature("reviews");
    if (guard) return guard;
    const body = await req.json();
    const parsed = reviewSchema.parse(body);
    const data = await reviewService.createReview({ ...parsed, comment: parsed.comment || "" });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
