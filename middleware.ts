import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register'];

const ROLE_TO_HOME: Record<string, string> = {
  admin: '/admin/overview',
  wholesaler: '/wholesale/overview',
  retailer: '/retailer/overview',
  delivery: '/delivery/overview',
};

const ROLE_PREFIX: Record<string, string> = {
  '/admin': 'admin',
  '/wholesale': 'wholesaler',
  '/retailer': 'retailer',
  '/delivery': 'delivery',
};

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // Logged-in user on auth page → redirect to their dashboard
  if (user && isAuthPage) {
    const role = (user.user_metadata?.role as string) || 'retailer';
    const url = request.nextUrl.clone();
    url.pathname = ROLE_TO_HOME[role] || ROLE_TO_HOME.retailer;
    return NextResponse.redirect(url);
  }

  // Protected route detection
  const matchedPrefix = Object.keys(ROLE_PREFIX).find((p) =>
    pathname.startsWith(p)
  );

  // Guest trying to access protected area → login
  if (!user && matchedPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (user && matchedPrefix) {
    const role = (user.user_metadata?.role as string) || 'retailer';
    const requiredRole = ROLE_PREFIX[matchedPrefix];
    if (role !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = ROLE_TO_HOME[role] || '/login';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
