import { expect } from '@playwright/test';
import { test, ensureDatabaseSeeded } from '../fixtures';

test.describe('Tickets Page', () => {
    test.beforeAll(async () => {
        await ensureDatabaseSeeded();
    });

    test('should filter tickets by search query', async ({ authenticatedPage: page }) => {
        // Wait for tickets to load
        await page.waitForSelector('[data-testid="ticket-list"]', { state: 'visible' });

        // Get initial ticket count
        const initialTickets = await page.locator('[data-testid="ticket-list"] > button').count();
        expect(initialTickets).toBeGreaterThan(0);

        // Get the first ticket's title
        const firstTicketTitle = await page.locator('[data-testid="ticket-list"] > button').first().locator('h3').textContent();
        expect(firstTicketTitle).toBeTruthy();

        // Search for the first ticket's title
        await page.getByPlaceholder('Search tickets...').fill(firstTicketTitle!);

        // Wait for the UI to update (no need to wait for API since filtering is client-side)
        await page.waitForTimeout(100); // Small delay for React to update

        // Get filtered ticket count
        const filteredTickets = await page.locator('[data-testid="ticket-list"] > button').count();
        expect(filteredTickets).toBeLessThanOrEqual(initialTickets);
        expect(filteredTickets).toBeGreaterThan(0);

        // Clear search
        await page.getByPlaceholder('Search tickets...').clear();

        // Wait for the UI to update
        await page.waitForTimeout(100); // Small delay for React to update

        // Verify all tickets are shown again
        const resetTickets = await page.locator('[data-testid="ticket-list"] > button').count();
        expect(resetTickets).toBe(initialTickets);
    });
}); 