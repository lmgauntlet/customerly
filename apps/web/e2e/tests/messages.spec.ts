import { expect } from '@playwright/test';
import { test, ensureDatabaseSeeded } from '../fixtures';
import { createClient } from '@supabase/supabase-js';

// Set default timeout to 5 seconds
test.describe.configure({ timeout: 10000 });

test.describe('Messages and Attachments', () => {
    let supabase: ReturnType<typeof createClient>;
    let testId: string;

    test.beforeAll(async () => {
        await ensureDatabaseSeeded();
        supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
        );
    });

    test.beforeEach(async () => {
        testId = Math.random().toString(36).substring(2);
    });

    test.afterEach(async () => {
        const { data: files } = await supabase.storage
            .from('customerly')
            .list(`tickets/test_${testId}`);

        if (files?.length) {
            await supabase.storage
                .from('customerly')
                .remove(files.map(file => `tickets/test_${testId}/${file.name}`));
        }
    });

    test('should handle messages and attachments', async ({ authenticatedPage: page }) => {
        // Open first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();

        // Send text message
        const testMessage = 'Test message ' + testId;
        const replyInput = page.getByPlaceholder('Type your reply...');
        await replyInput.waitFor();
        await replyInput.fill(testMessage);
        await page.getByRole('button', { name: 'Send Reply' }).click();

        // Verify message appears
        const sentMessage = page.getByText(testMessage);
        await sentMessage.waitFor();

        // Send file attachment
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: 'test.txt',
            mimeType: 'text/plain',
            buffer: Buffer.from('test content')
        });
        await page.getByRole('button', { name: 'Send Reply' }).click();

        // Verify file appears
        const sentFile = page.getByText('test.txt');
        await sentFile.waitFor();
    });

    test('should handle image preview', async ({ authenticatedPage: page }) => {
        // Open first ticket
        const ticketList = page.locator('[data-testid="ticket-list"]');
        await ticketList.waitFor();
        await ticketList.getByRole('button').first().click();

        // Send image
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: 'test.png',
            mimeType: 'image/png',
            buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
        });
        await page.getByRole('button', { name: 'Send Reply' }).click();

        // Verify image appears and preview works
        const sentImage = page.getByText('test.png');
        await sentImage.waitFor();
        await sentImage.click();
        await page.locator('div[role="dialog"]').waitFor();
        await page.keyboard.press('Escape');
    });
}); 