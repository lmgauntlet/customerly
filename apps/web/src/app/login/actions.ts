'use server'

import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function createUserRecord(authUserId: string, email: string) {
    const supabase = createServerClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

    if (existingUser) {
        return existingUser
    }

    // Create new user record
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([
            {
                id: authUserId,
                email,
                role: 'customer',
            },
        ])
        .select()
        .single()

    if (error) {
        throw error
    }

    return newUser
}