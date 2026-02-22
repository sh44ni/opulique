import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

// Simple rate limiter storage
// Note: In Next.js Middleware, this is reset on every worker start, 
// which is usually fine for a basic layer of protection.
const rateLimitCache = new LRUCache<string, number>({
    max: 500, // max number of IPs to track
    ttl: 1000 * 60 * 15, // 15 minutes
});

import { verifySession } from './lib/auth/session';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get IP from headers (Next.js 16 proxy pattern)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'anonymous';

    // 1. Rate Limiting for API routes
    if (pathname.startsWith('/api')) {
        const count = rateLimitCache.get(ip) || 0;
        if (count > 100) { // Limit to 100 requests per 15 mins
            return new NextResponse('Too Many Requests', { status: 429 });
        }
        rateLimitCache.set(ip, count + 1);
    }

    // 2. Admin Authentication Enforcement (Server-side)
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        // Skip login page
        if (pathname === '/admin/login' || pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('admin_session')?.value;
        const session = token ? verifySession(token) : null;

        if (!session) {
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            // For pages, redirect to login
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            url.searchParams.set('from', pathname);
            return NextResponse.redirect(url);
        }
    }

    // 3. Security Headers
    const response = NextResponse.next();

    // Protect against clickjacking
    response.headers.set('X-Frame-Options', 'DENY');

    // Protect against MIME snifing
    response.headers.set('X-Content-Type-Options', 'nosniff');

    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (Basic)
    // Adjust this based on your specific needs (e.g. allowing Cloudinary)
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com; font-src 'self' data:;"
    );

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
