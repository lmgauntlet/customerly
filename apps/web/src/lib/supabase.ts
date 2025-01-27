import { createBrowserClient } from '@supabase/ssr'

// Create a single instance to be shared across the app
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) 