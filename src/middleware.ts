import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { createSupbaseServerClient } from './supabase-server';

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request)
    await supabase.auth.getSession();
    return response;
}

function createClient(request: NextRequest) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  
    const supabase = createSupbaseServerClient();
    return { supabase, response }
  }
  