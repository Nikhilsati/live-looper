import { test, expect } from '@playwright/test';

test.describe('Project Management', () => {
    test('should create and delete a project', async ({ page }) => {
        await page.goto('/');

        // Create project
        await page.getByRole('button', { name: 'Create Project' }).click();
        const projectName = `Test Project ${Date.now()}`;
        await page.getByPlaceholder('Project Name...').fill(projectName);
        await page.getByRole('button', { name: 'Create', exact: true }).click();

        // Should navigate to workspace
        await expect(page).toHaveURL(/\/projects\/.+/);
        // Specifically look for the heading in the workspace, which usually has "Session started" text nearby
        await expect(page.locator('h1').filter({ hasText: projectName })).toBeVisible();

        // Go back to dashboard
        await page.goto('/');

        // Delete project
        const projectCard = page.locator('.project-card').filter({ hasText: projectName });
        await expect(projectCard).toBeVisible();

        // Handle the delete confirmation dialog
        page.on('dialog', dialog => dialog.accept());

        // The second button in the card is delete (Trash2 icon)
        await projectCard.locator('button').nth(1).click();

        await expect(projectCard).not.toBeVisible();
    });
});
