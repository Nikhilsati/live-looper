import { test, expect } from '@playwright/test';

test.describe('Transport & Playback', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByRole('button', { name: 'Create Project' }).click();
        const projectName = 'Transport Test';
        await page.getByPlaceholder('Project Name...').fill(projectName);
        await page.getByRole('button', { name: 'Create', exact: true }).click();

        await expect(page).toHaveURL(/\/projects\/.+/);
    });

    test('should toggle play/stop', async ({ page }) => {
        const transportBtn = page.getByTestId('transport-button');
        await expect(transportBtn).toBeVisible();

        // Start playback
        await transportBtn.click();

        // Button should switch to danger variant for Stop
        await expect(transportBtn).toHaveClass(/danger/);

        // Stop playback
        await transportBtn.click();
        await expect(transportBtn).toHaveClass(/primary/);
    });

    test('should change BPM', async ({ page }) => {
        // Open BPM controls
        await page.getByTestId('bpm-button').click();

        // Find the +5 button and click it
        const plusFiveBtn = page.getByTestId('bpm-plus-5');
        await expect(plusFiveBtn).toBeVisible();
        await plusFiveBtn.click({ force: true });

        // Check if BPM value updated. Default 100 -> 105.
        await expect(page.getByTestId('bpm-value')).toHaveText('105', { timeout: 10000 });
    });
});
