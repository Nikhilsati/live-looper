import { test, expect } from "@playwright/test";

test.describe("Mode System", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    await page.getByPlaceholder("Project Name...").fill("Mode Test");
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: "Mode Test" })).toBeVisible();
  });

  test("should switch between modes", async ({ page }) => {
    // Current mode should be Planning by default
    await expect(page.getByText("PLANNING MODE")).toBeVisible();

    // Switch to Practice
    await page.getByRole("button", { name: "Practice", exact: true }).click();
    await expect(page.getByText("PRACTICE MODE")).toBeVisible();

    // Switch to Live
    await page.getByRole("button", { name: "● LIVE" }).click();
    await expect(page.getByText("LIVE MODE")).toBeVisible();
  });

  test("should enforce interface visibility constraints in Live Mode", async ({ page }) => {
    // Verify "Settings" button and "Add Section" buttons are visible in Planning Mode
    const settingsBtn = page.getByTitle("Settings", { exact: true });
    await expect(settingsBtn).toBeVisible();

    const addSectionBtn = page.getByRole("button", { name: "Add Section" });
    await expect(addSectionBtn).toBeVisible();

    // Switch to LIVE mode
    await page.getByRole("button", { name: "● LIVE" }).click();
    await expect(page.getByText("LIVE MODE")).toBeVisible();

    // Verify "Settings" button and "Add Section" button are hidden
    await expect(settingsBtn).not.toBeVisible();
    await expect(addSectionBtn).not.toBeVisible();

    // Switch back to Planning Mode
    await page.getByRole("button", { name: "Plan", exact: true }).click();
    await expect(page.getByText("PLANNING MODE")).toBeVisible();

    // Verify buttons are restored to visible
    await expect(settingsBtn).toBeVisible();
    await expect(addSectionBtn).toBeVisible();
  });
});

