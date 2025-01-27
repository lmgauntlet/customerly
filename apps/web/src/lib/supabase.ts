import { createBrowserClient as createBrowserSupabaseClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
if (!supabaseKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')

// Create a single supabase client for interacting with your database
export const createBrowserClient = () => {
  return createBrowserSupabaseClient(supabaseUrl, supabaseKey)
} 