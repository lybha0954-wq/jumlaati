import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('role')?.value // يمكن تعديل هذا لجلب الدور من الجلسة
  const url = req.nextUrl.pathname

  if (url.startsWith('/dashboard/admin') && token !== 'admin') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  if (url.startsWith('/dashboard/retailer') && token !== 'retailer') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
