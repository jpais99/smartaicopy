// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get('auth_session');

  // Check for auth session on protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged in users away from auth pages
  if (authSession && (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup']
};