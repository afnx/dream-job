import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ENABLED = !!process.env.AUTH_PROVIDER;

export function middleware(request: NextRequest) {
    // If auth is not enabled, block access to /sign-in and allow all other requests
    if (!AUTH_ENABLED) {
        const { pathname } = request.nextUrl;
        if (pathname === '/sign-in') {
            return new NextResponse('Not Found', { status: 404 });
        }
        return NextResponse.next();
    }

    // If auth is enabled, protect routes except /sign-in
    const { pathname } = request.nextUrl;
    if (
        !request.cookies.get('accessToken') &&
        pathname !== '/sign-in'
    ) {
        const url = request.nextUrl.clone();
        url.pathname = '/sign-in';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|api|public|sign-in).*)',
    ],
};