import { expect } from '@playwright/test';
import { test, ensureDatabaseSeeded } from '../fixtures';

test.describe('Authentication', () => {
    test.beforeAll(async () => {
        await ensureDatabaseSeeded();
    });

    test('should login and navigate to tickets page', async ({ authenticatedPage: page }) => {
        // Verify we're on the tickets page by checking for key elements
        await expect(page.getByRole('link', { name: 'Customerly' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Views' })).toBeVisible();

        // Verify the search input is present
        await expect(page.getByPlaceholder('Search tickets...')).toBeVisible();

        // Verify navigation items are present
        await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Inbox' })).toBeVisible();

        // Verify ticket list is present
        await expect(page.locator('[data-testid="ticket-list"]')).toBeVisible();
    });
}); 