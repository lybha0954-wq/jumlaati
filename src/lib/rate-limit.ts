// ═══════════════════════════════════════════════════
// Rate Limiter — In-Memory
// ملاحظة: للاستخدام في بيئة خادم واحد
// عند Cloudflare Pages/Vercel → يستخدمون حلهم المدمج
// ═══════════════════════════════════════════════════

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// تنظيف دوري كل 5 دقائق
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt < now) buckets.delete(key);
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs?: number;      // النافذة الزمنية
  max?: number;           // الحد الأقصى
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

/**
 * فحص حد الطلبات
 * @param key - المعرف (userId أو IP)
 * @param options - الإعدادات
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs ?? 60_000; // دقيقة
  const max = options.max ?? 30;

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs, limit: max };
  }

  bucket.count += 1;
  const remaining = Math.max(0, max - bucket.count);
  const allowed = bucket.count <= max;

  return { allowed, remaining, resetAt: bucket.resetAt, limit: max };
}

/**
 * يبني مفتاح Rate Limit من request + user
 */
export function buildKey(req: Request, userId?: string | null): string {
  if (userId) return `user:${userId}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return `ip:${ip}`;
}

/**
 * Response عند تجاوز الحد
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "too_many_requests",
      message: "تجاوزت الحد الأقصى — حاول لاحقاً",
      retry_after: Math.ceil((result.resetAt - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    }
  );
}
