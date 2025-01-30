import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ip = request.ip || request.headers.get('x-real-ip');
  response.cookies.set('client-ip', ip || 'undefined-mw');
  return response;
}

export const config = {
  matcher: '/:path*',
}