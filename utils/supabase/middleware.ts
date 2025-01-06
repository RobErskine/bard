import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // First, check if this is a CMS route
  if (
    request.nextUrl.pathname.startsWith('/outstatic') || 
    request.nextUrl.pathname.startsWith('/api/outstatic')
  ) {
    // For CMS routes, bypass Supabase middleware completely
    return NextResponse.next();
  }

  // For all other routes, handle Supabase auth
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Refresh session if expired
    await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    // Handle protected routes
    if (request.nextUrl.pathname.startsWith("/account") && !user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (request.nextUrl.pathname === "/" && user) {
      return NextResponse.redirect(new URL("/account", request.url));
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
