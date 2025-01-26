import { expect } from '@playwright/test';
import { test, ensureDatabaseSeeded } from '../fixtures';

test.describe('Authentication', () => {
    test.beforeAll(async () => {
        await ensureDatabaseSeeded();
    });

    test('should login and navigate to tickets page', async ({ authenticatedPage: page }) => {
        // Verify we're on the tickets page
        await expect(page.getByRole('heading', { name: 'Inbox' })).toBeVisible();

        // Verify the search input is present
        await expect(page.getByPlaceholder('Search tickets...')).toBeVisible();
    });
}); 