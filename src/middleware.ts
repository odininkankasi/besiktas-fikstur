import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // www.bjk.8080.tr -> bjk.8080.tr 301 Yönlendirmesi (SEO & Canonical Koruması)
  if (host.startsWith('www.bjk.8080.tr')) {
    url.host = 'bjk.8080.tr';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Yalnızca sayfa isteklerini yakala (Statik varlıkları ve API'leri yormasın)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, bjk-logo.svg
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|bjk-logo.svg).*)',
  ],
};
