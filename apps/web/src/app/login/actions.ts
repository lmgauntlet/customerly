'use server'

import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export async function createUserRecord(authUserId: string, email: string) {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Check if user exists in our database by email
    const { data: existingUser, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single()

    if (error) {
        console.error('Error fetching user:', error)
        return { success: false, error: error.message }
    }

    if (existingUser) {
        return { success: true, user: existingUser }
    }

    return { success: false, error: 'User not found' }
} 