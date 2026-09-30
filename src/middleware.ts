import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const AUTH_PAGES = ['/login', '/register'];

const ROLE_TO_HOME: Record<string, string> = {
  admin: '/admin/home',
  supplier: '/wholesale/overview',
  retailer: '/retailer/overview',
  delivery: '/delivery/overview',
};

const ROLE_PREFIX: Record<string, string[]> = {
  '/admin':     ['admin'],
  '/wholesale': ['supplier'],
  '/retailer':  ['retailer'],
  '/delivery':  ['delivery'],
};

// Map legacy role names to canonical ones
const ROLE_ALIASES: Record<string, string> = {
  owner:      'admin',
  wholesaler: 'supplier',
  store:      'retailer',
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

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const matchedPrefix = Object.keys(ROLE_PREFIX).find((p) =>
    pathname.startsWith(p)
  );

  // Not logged in → protect dashboard routes
  if (!user && matchedPrefix) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (!user) return response;

  // Determine role: metadata first, then profiles table
  let rawRole: string = (user.user_metadata?.role as string) || '';

  if (!rawRole) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      rawRole = data?.role || 'retailer';
    } catch {
      rawRole = 'retailer';
    }
  }

  // Normalize legacy role names
  const userRole = ROLE_ALIASES[rawRole] || rawRole;
  const home = ROLE_TO_HOME[userRole] || '/retailer/overview';

  // Logged in → redirect away from auth pages
  if (isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = home;
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (matchedPrefix) {
    const allowedRoles = ROLE_PREFIX[matchedPrefix];
    if (!allowedRoles.includes(userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = home;
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
