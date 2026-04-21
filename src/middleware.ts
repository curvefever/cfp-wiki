import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  if (!supabase) {
    return response;
  }

    await supabase.auth.getSession();
    return response;
}

function createClient(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const hasAuthCookie = request.cookies.getAll().some(({ name }) => name.startsWith('sb-') && name.includes('-auth-token'));
  if (!hasAuthCookie) {
    return { supabase: null, response };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  );

  return { supabase, response }
}

export const config = {
  matcher: ['/:slug/edit/:path*', '/:slug/history/:path*'],
}
  