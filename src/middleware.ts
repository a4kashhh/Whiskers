import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('petverse-session');

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/api/'));

  if (!isPublic && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionCookie && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)',
  ],
};
