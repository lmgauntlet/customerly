import { createBrowserClient } from '@supabase/ssr'

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  // Ensure URL is properly formatted
  try {
    new URL(url)
    return url
  } catch (error) {
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format')
  }
}

const getSupabaseKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return key
}

// Create a single instance of the Supabase client to be used across the app
export const supabase = createBrowserClient(
  getSupabaseUrl(),
  getSupabaseKey()
)
