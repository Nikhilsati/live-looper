import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load landing page content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Play it.");
    await expect(page.locator("h1")).toContainText("Loop it.");
    await expect(page.locator("h1")).toContainText("Own it.");
  });

  test("Start playing button should navigate to practice", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start playing" }).click();
    await expect(page).toHaveURL(/\/#\/practice/);
  });

  test("Live Looper card should navigate to looper dashboard", async ({ page }) => {
    await page.goto("/");
    await page.locator(".ls-mode-card.looper").click();
    await expect(page).toHaveURL(/\/#\/looper/);
  });
});
