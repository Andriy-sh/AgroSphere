import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TENANT_COOKIE_KEY = 'tenant_id';

// Routes that don't require any authentication
const PUBLIC_ROUTES = [
  '/api/auth',
  '/auth/logout-callback',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
] as const;

// Routes that require authentication but NOT tenant selection
const AUTH_ONLY_ROUTES = [
  '/organisation-selection',
  '/settings/billing',
] as const;

/**
 * Check if pathname matches any route in the list (prefix match)
 */
function matchesRoute(pathname: string, routes: readonly string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

/**
 * Create redirect response and clear tenant cookie
 */
function redirectWithClearTenant(url: URL): NextResponse {
  const response = NextResponse.redirect(url);
  response.cookies.delete(TENANT_COOKIE_KEY);
  return response;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Public routes - no auth needed
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }
  // 2. Auth-only routes now behave as regular routes in no-auth mode
  if (matchesRoute(pathname, AUTH_ONLY_ROUTES)) {
    return NextResponse.next();
  }

  // 3. Keep tenant selection guard for business context
  const tenantId =
    req.cookies.get(TENANT_COOKIE_KEY)?.value || req.headers.get('x-tenant');

  if (!tenantId) {
    return NextResponse.redirect(new URL('/organisation-selection', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/proxy/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
