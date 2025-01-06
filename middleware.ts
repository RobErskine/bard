import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Handle CORS preflight requests for Outstatic routes
  if (request.method === 'OPTIONS' && 
    (request.nextUrl.pathname.startsWith('/outstatic') || 
     request.nextUrl.pathname.startsWith('/api/outstatic'))
  ) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET,OPTIONS,POST,DELETE',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  // Skip middleware for all Outstatic routes (non-OPTIONS requests)
  if (
    request.nextUrl.pathname.startsWith('/outstatic') || 
    request.nextUrl.pathname.startsWith('/api/outstatic')
  ) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }

  // Handle Supabase auth for all other routes
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}