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
});
