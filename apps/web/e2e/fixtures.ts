import { test as base, Page } from '@playwright/test';
import { testClient, TEST_USER } from './test-environment';

// Extend the test type to include authenticated page
type CustomFixtures = {
    authenticatedPage: Page;
};

// Create a test that includes our custom fixtures
export const test = base.extend<CustomFixtures>({
    authenticatedPage: async ({ page }, use) => {
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
    // We're using the global setup for seeding
    // This is just a placeholder in case we need additional seeding
}

// Re-export everything from the base test
export { expect } from '@playwright/test'; 