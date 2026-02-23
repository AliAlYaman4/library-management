import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin') && token?.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (path.startsWith('/librarian') && 
        token?.role !== UserRole.ADMIN && 
        token?.role !== UserRole.LIBRARIAN) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/librarian/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/history/:path*',
    '/api/admin/:path*',
    '/api/librarian/:path*',
    '/api/borrow/:path*',
    '/api/return/:path*',
    '/api/recommendations/:path*',
    '/api/ai/:path*',
  ],
};
