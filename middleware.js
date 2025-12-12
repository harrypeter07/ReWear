import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Allow the code entry page and code API
    if (pathname.startsWith('/admin/code') || pathname.startsWith('/api/auth/admin-code')) {
        return NextResponse.next();
    }

    // Protect /admin pages and /api/admin routes
    const needsGuard = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
    if (!needsGuard) return NextResponse.next();

    // Check for admin code cookie
    const codeCookie = req.cookies.get?.('admin_code')?.value;
    const requiredCode = process.env.ADMIN_ACCESS_CODE;

    // Check for user role from JWT token (original method)
    let userRole = null;
    try {
        const accessToken = req.cookies.get?.('accessToken')?.value;
        if (accessToken) {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            userRole = decoded.role;
        }
    } catch (err) {
        // Token invalid or missing, continue to check other methods
    }

    // Allow if user has admin role (original authentication method)
    if (userRole === 'admin') {
        return NextResponse.next();
    }

    // If admin code is required, check for code cookie
    if (requiredCode) {
        if (codeCookie && codeCookie === requiredCode) {
            return NextResponse.next();
        }
        // Redirect to code page if code is required but not provided
        const redirectUrl = new URL('/admin/code', req.url);
        return NextResponse.redirect(redirectUrl);
    }

    // If no code required and no admin role, allow (for development)
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};


