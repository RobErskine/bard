import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // For Outstatic routes, preserve cookies but skip Supabase auth
  if (
    request.nextUrl.pathname.startsWith('/outstatic') || 
    request.nextUrl.pathname.startsWith('/api/outstatic')
  ) {
    // const response = NextResponse.next();
    
    // // Preserve all existing cookies
    // const cookies = request.cookies.getAll();
    // cookies.forEach(cookie => {
    //   // Only set cookies that are related to GitHub/Outstatic
    //   if (cookie.name.includes('gh_') || 
    //       cookie.name.includes('_octo') || 
    //       cookie.name.includes('_Host-user_session') ||
    //       cookie.name.includes('user_session')) {
    //     response.cookies.set(cookie.name, cookie.value);
    //   }
    // });

    // return response;
  }

  // For all other routes, use Supabase auth
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}
