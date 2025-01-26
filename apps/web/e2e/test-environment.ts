import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const testClient = createClient(supabaseUrl, supabaseKey);

export const TEST_USER = {
    email: process.env.PLAYWRIGHT_TEST_USER!,
    password: process.env.PLAYWRIGHT_TEST_PASSWORD!
};

export async function setupTestData() {
    // Add test data setup here if needed
}

export async function cleanupTestData() {
    // Add cleanup logic here if needed
} 