import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const session = req.auth;
  const pathname = req.nextUrl.pathname;
  const isAdmin = session?.user?.role === 'admin';
  const isApplicant = session?.user?.role === 'applicant';
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/internships') ||
    isAuthPage;

  // Allow public routes
  if (isPublicRoute && !pathname.startsWith('/dashboard')) {
    // Redirect authenticated users away from auth pages
    if (isAuthPage && session) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/dashboard/admin', req.url));
      }
      if (isApplicant) {
        return NextResponse.redirect(new URL('/dashboard/applicant', req.url));
      }
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith('/dashboard/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (!isAdmin) {
      if (isApplicant) {
        return NextResponse.redirect(new URL('/dashboard/applicant', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protect applicant routes
  if (pathname.startsWith('/dashboard/applicant')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (!isApplicant) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/dashboard/admin', req.url));
      }
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Require authentication for other protected routes
  if (!session && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
