'use server'

import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export async function createUserRecord(authUserId: string, email: string) {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Check if user exists in our database by email
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single()

    if (existingUser) {
        return { success: true, user: existingUser }
    }

    // If user doesn't exist, create a new one
    const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
            {
                id: authUserId,
                email,
                role: 'customer',
                preferences: {},
            }
        ])
        .select()
        .single()

    if (createError) {
        console.error('Error creating user:', createError)
        return { success: false, error: createError.message }
    }

    return { success: true, user: newUser }
}