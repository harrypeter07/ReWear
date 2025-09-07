import { NextResponse } from 'next/server';

export function middleware(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const codeCookie = req.cookies.get?.('admin_code')?.value;
    const required = process.env.ADMIN_ACCESS_CODE;

    // If no code required, allow
    if (!required) return NextResponse.next();

    // Allow the code entry page and code API
    if (pathname.startsWith('/admin/code') || pathname.startsWith('/api/auth/admin-code')) {
        return NextResponse.next();
    }

    // Protect /admin pages and /api/admin routes
    const needsGuard = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
    if (!needsGuard) return NextResponse.next();

    if (codeCookie && codeCookie === required) {
        return NextResponse.next();
    }

    const redirectUrl = new URL('/admin/code', req.url);
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};


