import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_PATH = '/sige';
const publicPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token')?.value;

  const isPublic = publicPaths.some((p) => pathname.startsWith(p)) || pathname === '/';

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL(`${BASE_PATH}/login`, request.url));
  }

  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL(`${BASE_PATH}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
