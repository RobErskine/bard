import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Skip middleware completely for Outstatic routes and their cookies
  if (
    request.nextUrl.pathname.startsWith('/outstatic') || 
    request.nextUrl.pathname.startsWith('/api/outstatic')
  ) {
    return NextResponse.next({
      request: {
        headers: new Headers({
          'x-middleware-skip': '1',
          ...Object.fromEntries(request.headers)
        })
      }
    });
  }

  // Rest of your middleware code...
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}
