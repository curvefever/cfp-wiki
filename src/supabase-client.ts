import { createBrowserClient } from '@supabase/ssr'

export function createSupbaseBrowserClient() {
  return createBrowserClient(
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '',
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '',
  );
}