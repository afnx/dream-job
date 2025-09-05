import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ENABLED = !!process.env.AUTH_PROVIDER;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // If auth is not enabled, block access to /sign-in and /verify-email and allow all other requests
    if (!AUTH_ENABLED) {
        if (pathname === '/sign-in' || pathname === '/verify-email') {
            return new NextResponse('Not Found', { status: 404 });
        }
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('accessToken');
    const pendingEmail = request.cookies.get('pendingEmail');

    // If authenticated, prevent access to sign-in and verify-email
    if (accessToken && (pathname === '/sign-in' || pathname === '/verify-email')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    // If not authenticated
    if (!accessToken) {
        // If pendingEmail, always redirect to /verify-email
        if (pendingEmail) {
            if (pathname !== '/verify-email') {
                const url = request.nextUrl.clone();
                url.pathname = '/verify-email';
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }
        // Allow access to sign-in for unauthenticated users without pendingEmail
        if (pathname === '/sign-in') {
            return NextResponse.next();
        }
        // Otherwise, redirect to sign-in
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|public).*)',
    ],
};