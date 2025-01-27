import { test, expect, ensureDatabaseSeeded } from '../fixtures';

test.describe('Ticket Messages', () => {
    test.use({ actionTimeout: 5000 });

    test.beforeAll(async () => {
        await ensureDatabaseSeeded();
    });

    test('should send text message', async ({ authenticatedPage: page }) => {
        await page.goto('/tickets');
        
        // Wait for and select first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();
        
        // Type and send message
        const replyInput = page.locator('textarea[placeholder="Type your reply..."]');
        await replyInput.fill('Test message A');
        await page.getByRole('button', { name: /send reply/i }).click();
        
        // Verify message appears
        await expect(page.getByText('Test message A')).toBeVisible();
    });

    test('should send internal note', async ({ authenticatedPage: page }) => {
        await page.goto('/tickets');
        
        // Wait for and select first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();
        
        // Switch to internal note
        await page.getByRole('button', { name: /internal note/i }).click();
        
        // Type and send note
        const noteInput = page.locator('textarea[placeholder="Add an internal note..."]');
        await noteInput.fill('Internal note B');
        await page.getByRole('button', { name: /add note/i }).click();
        
        // Verify note appears with internal indicator
        await expect(page.getByText('Internal note B')).toBeVisible();
        await expect(page.getByText('• Internal')).toBeVisible();
    });

    test('should upload and send file', async ({ authenticatedPage: page }) => {
        await page.goto('/tickets');
        
        // Wait for and select first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();
        
        // Upload file
        await page.setInputFiles('input[type="file"]', {
            name: 'test-file-c.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('Test content C')
        });
        
        // Send message with file
        await page.getByRole('button', { name: /send reply/i }).click();
        
        // Verify file appears
        await expect(page.getByText('test-file-c.txt')).toBeVisible();
    });

    test('should preview image', async ({ authenticatedPage: page }) => {
        await page.goto('/tickets');
        
        // Wait for and select first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();
        
        // Upload image
        await page.setInputFiles('input[type="file"]', {
            name: 'test-image-d.png',
            mimeType: 'image/png',
            buffer: Buffer.from('fake-image-data-d')
        });
        
        // Send message with image
        await page.getByRole('button', { name: /send reply/i }).click();
        
        // Verify image appears and can be previewed
        await expect(page.getByText('test-image-d.png')).toBeVisible();
        await page.getByText('test-image-d.png').click();
        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('should handle multiple attachments', async ({ authenticatedPage: page }) => {
        await page.goto('/tickets');
        
        // Wait for and select first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();
        
        // Upload multiple files
        await page.setInputFiles('input[type="file"]', [
            {
                name: 'file-e1.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('Content E1')
            },
            {
                name: 'file-e2.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('Content E2')
            }
        ]);
        
        // Add message text and send
        const replyInput = page.locator('textarea[placeholder="Type your reply..."]');
        await replyInput.fill('Multiple files E');
        await page.getByRole('button', { name: /send reply/i }).click();
        
        // Verify all content appears
        await expect(page.getByText('Multiple files E')).toBeVisible();
        await expect(page.getByText('file-e1.txt')).toBeVisible();
        await expect(page.getByText('file-e2.txt')).toBeVisible();
    });
}); 