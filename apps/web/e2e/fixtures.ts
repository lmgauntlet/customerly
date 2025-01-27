import { seedDb, emptyDb } from '@customerly/db/scripts/seed';
import { test as base, Page } from '@playwright/test';
import { testClient, TEST_USER } from './test-environment';

// Helper function to empty storage bucket
async function emptyStorageBucket() {
    const { data: files, error: listError } = await testClient.storage
        .from('customerly')
        .list();

    if (listError) {
        console.error('Failed to list files:', listError);
        return;
    }

    if (files && files.length > 0) {
        const filePaths = files.map(file => file.name);
        const { error: deleteError } = await testClient.storage
            .from('customerly')
            .remove(filePaths);

        if (deleteError) {
            console.error('Failed to delete files:', deleteError);
        }
    }
}

// Extend the test type to include authenticated page
type CustomFixtures = {
    authenticatedPage: Page;
};

// Create a test that includes our custom fixtures
export const test = base.extend<CustomFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Empty storage bucket before tests
        await emptyStorageBucket();

        // Navigate to login page
        await page.goto('/login');

        // Fill in login form
        await page.getByLabel('Email').fill(TEST_USER.email);
        await page.getByLabel('Password').fill(TEST_USER.password);

        // Click login button and wait for navigation
        await Promise.all([
            page.waitForNavigation(),
            page.getByRole('button', { name: 'Sign In' }).click(),
        ]);

        // Use the authenticated page
        await use(page);
    },
});

// Helper function to ensure database is seeded
export async function ensureDatabaseSeeded() {
    await emptyStorageBucket(); // Also clear storage when seeding
    await seedDb(true);
}

// Re-export everything from the base test
export { expect } from '@playwright/test'; 