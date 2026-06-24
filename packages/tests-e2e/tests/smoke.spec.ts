import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("should load the dashboard", async ({ page }) => {
    await page.goto("/#/looper");
    await expect(
      page.getByRole("heading", { name: "My Projects" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button").filter({ hasText: "Create Project" }),
    ).toBeVisible();
  });
});
