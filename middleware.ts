import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers}})

  // إنشاء عميل Supabase للخادم
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request})
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        }}}
  )

  // التحقق من الجلسة
  const {
    data: { user }} = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // إذا لم يكن المستخدم مسجلاً دخول ويحاول الوصول لصفحات محمية
  if (!user && pathname !== '/sign-up-login') {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-up-login'
    return NextResponse.redirect(url)
  }

  // إذا كان المستخدم مسجلاً ويحاول الوصول لصفحة الدخول
  if (user && pathname === '/sign-up-login') {
    // جلب دوره من البيانات الوصفية لإعادة توجيهه لصفحته
    const role = user.user_metadata?.role as string || 'retailer'
    const redirectMap: Record<string, string> = {
      admin: '/admin-dashboard',
      supplier: '/supplier-dashboard',
      retailer: '/retailer-dashboard',
      delivery: '/delivery-dashboard'}
    const url = request.nextUrl.clone()
    url.pathname = redirectMap[role] || '/retailer-dashboard'
    return NextResponse.redirect(url)
  }

  // حماية مسارات الأدوار: منع المستخدم من الدخول لمسار ليس من صلاحياته
  if (user && pathname.startsWith('/admin') && user.user_metadata?.role !== 'admin') {
    return NextResponse.redirect(new URL('/404', request.url))
  }
  if (user && pathname.startsWith('/supplier') && user.user_metadata?.role !== 'supplier') {
    return NextResponse.redirect(new URL('/404', request.url))
  }
  if (user && pathname.startsWith('/retailer') && user.user_metadata?.role !== 'retailer') {
    return NextResponse.redirect(new URL('/404', request.url))
  }
  if (user && pathname.startsWith('/delivery') && user.user_metadata?.role !== 'delivery') {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  return response
}

// تحديد المسارات التي يغطيها هذا الوسيط
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
