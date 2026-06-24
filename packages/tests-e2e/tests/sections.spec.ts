import { test, expect } from "@playwright/test";

test.describe("Song Timeline & Sections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = `Timeline Test ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
  });

  test("should manage timeline sections", async ({ page }) => {
    // Assert 1 default section exists (Verse)
    const initialSections = page.locator(".timeline-section-card");
    await expect(initialSections).toHaveCount(1);
    await expect(initialSections.nth(0)).toContainText("Verse");

    // Add Section -> Section 2
    await page.getByRole("button", { name: "Add Section" }).click();
    await expect(initialSections).toHaveCount(2);
    await expect(initialSections.nth(1)).toContainText("Section 2");

    // Add Section -> Section 3
    await page.getByRole("button", { name: "Add Section" }).click();
    await expect(initialSections).toHaveCount(3);
    await expect(initialSections.nth(2)).toContainText("Section 3");

    // Add Section -> Section 4
    await page.getByRole("button", { name: "Add Section" }).click();
    await expect(initialSections).toHaveCount(4);
    await expect(initialSections.nth(3)).toContainText("Section 4");

    // Rename Section
    await page.getByText("Section 4").click();
    await page.locator("input[value='Section 4']").fill("Outro");
    await page.locator("input[value='Outro']").press("Enter");
    await expect(initialSections.nth(3)).toContainText("Outro");

    // Move Section Left
    const moveLeftBtn = initialSections.nth(3).getByTitle("Move section left");
    await expect(moveLeftBtn).toBeEnabled();
    await moveLeftBtn.click();
    // Outro should now be the 3rd section (index 2)
    await expect(initialSections.nth(2)).toContainText("Outro");

    // Toggle Carry-Forward link (left edge port dot of Section 2 at index 1)
    const portDot = page.getByTitle(/Track 1 carry-forward/).first();
    await expect(portDot).toBeVisible();
    await portDot.click();
    await expect(page.getByTitle(/Track 1 carry-forward/).first()).toBeVisible();

    // Delete Section
    const deleteBtn = initialSections.nth(2).getByTitle("Delete section");
    await deleteBtn.click();
    await expect(page.locator(".timeline-section-card")).toHaveCount(3);
    await expect(page.locator(".timeline-section-card").filter({ hasText: "Outro" })).not.toBeVisible();
  });
});
