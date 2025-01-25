import { supabase } from './supabase'
import type { User as AuthUser } from '@supabase/supabase-js'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: 'customer' | 'agent' | 'admin'
  preferences: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Gets the current authenticated user's record from the database
 * @throws Error if user is not logged in or not found in database
 * @returns The user record
 */
export async function getCurrentUser(): Promise<User> {
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!session?.user) {
    throw new Error('You must be logged in')
  }

  return getUser(session.user)
}

/**
 * Gets a user's record from their auth user data
 * @param authUser The Supabase auth user
 * @returns The user record from the database
 * @throws Error if user not found in database
 */
export async function getUser(authUser: AuthUser): Promise<User> {
  // Get the user record from our database
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, name, avatarUrl:avatar_url, role, preferences, created_at, updated_at')
    .eq('email', authUser.email)
    .single()

  if (userError || !user) {
    throw new Error('Failed to find user record')
  }

  return user
}
