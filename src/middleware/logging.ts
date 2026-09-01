import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  console.log(`[LOG] ${new Date().toISOString()} - ${req.method} ${req.nextUrl.pathname}`)
  return NextResponse.next()
}
