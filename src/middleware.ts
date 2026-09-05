import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('rs_session_token')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === '/landing' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/api/auth');

  // Protect dashboard routes
  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated user away from login/signup/landing to dashboard
  if (token && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
