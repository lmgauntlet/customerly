import { createUserRecord } from '../actions'
import { createServerClient } from '@/utils/supabase'

// Mock the supabase client
jest.mock('@/utils/supabase', () => ({
    createServerClient: jest.fn(),
}))

// Mock the cookies
jest.mock('next/headers', () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
    })),
}))

describe('createUserRecord', () => {
    let mockSupabase: any

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks()

        // Create a mock Supabase client
        mockSupabase = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
        }

            // Set up the createServerClient mock
            ; (createServerClient as jest.Mock).mockReturnValue(mockSupabase)
    })

    it('should return success and user when user exists', async () => {
        // Mock existing user
        const mockUser = {
            id: 'test-id',
            email: 'test@example.com',
            role: 'customer',
        }
        mockSupabase.single.mockResolvedValue({ data: mockUser })

        const result = await createUserRecord('auth-id', 'test@example.com')

        expect(result).toEqual({
            success: true,
            user: mockUser,
        })
        expect(mockSupabase.from).toHaveBeenCalledWith('users')
        expect(mockSupabase.eq).toHaveBeenCalledWith('email', 'test@example.com')
    })

    it('should return error when user does not exist', async () => {
        // Mock no user found
        mockSupabase.single.mockResolvedValue({ data: null })

        const result = await createUserRecord('auth-id', 'test@example.com')

        expect(result).toEqual({
            success: false,
            error: 'User not found',
        })
    })

    it('should return error when database query fails', async () => {
        // Mock database error
        const mockError = new Error('Database error')
        mockSupabase.single.mockResolvedValue({ error: mockError })

        const result = await createUserRecord('auth-id', 'test@example.com')

        expect(result).toEqual({
            success: false,
            error: mockError.message,
        })
    })
}) 