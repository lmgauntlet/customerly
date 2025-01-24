import { supabase } from './supabase'

export interface DbUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

/**
 * Gets the current authenticated user's database record
 * @throws Error if user is not logged in or database record not found
 * @returns The user's database record
 */
export async function getCurrentDbUser(): Promise<DbUser> {
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) {
    throw new Error('You must be logged in')
  }

  // Get the user record from our database
  const { data: dbUser, error: userError } = await supabase
    .from('users')
    .select('id, email, name, avatarUrl:avatar_url')
    .eq('email', session.user.email)
    .single()

  if (userError || !dbUser) {
    throw new Error('Failed to find user record')
  }

  return dbUser
}
