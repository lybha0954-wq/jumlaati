import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const rateLimitMap = new Map()

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const limit = 100 // 100 طلب لكل دقيقة
  const current = rateLimitMap.get(ip) || 0
  
  if (current > limit) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
  }
  rateLimitMap.set(ip, current + 1)
  return NextResponse.next()
}
