import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const device = JSON.stringify(userAgent(request)); 
  const ip = request.ip || request.headers.get('x-real-ip');

  response.cookies.set('client-ip', ip || 'undefined-mw');
  response.cookies.set('device-info', device || '');
  
  return response;
}

export const config = {
  matcher: '/:path*',
}