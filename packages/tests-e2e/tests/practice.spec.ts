import { test, expect } from "@playwright/test";

test.describe("Guitar Practice Mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/practice");
    await expect(page.getByText("Guitar Practice").first()).toBeVisible({ timeout: 15000 });
  });

  test("should load practice view and toggle session audio", async ({ page }) => {
    // Assert elements are visible
    await expect(page.getByText("Guitar Practice").first()).toBeVisible();

    const startStopBtn = page.locator("#practice-start-stop-btn");
    await expect(startStopBtn).toBeVisible();
    await expect(startStopBtn).toContainText("START PLAYING");

    // Click to start session
    await startStopBtn.click();
    await expect(startStopBtn).toHaveAttribute("title", "Stop practice audio session");

    // Click to stop session
    await startStopBtn.click();
    await expect(startStopBtn).toHaveAttribute("title", /Start practice audio session/);
  });

  test("should toggle metronome in practice view", async ({ page }) => {
    const metronomeBtn = page.locator("#practice-metronome-btn");
    await expect(metronomeBtn).toBeVisible();

    // Toggle metronome state
    const title = await metronomeBtn.getAttribute("title");
    await metronomeBtn.click();

    if (title === "Enable metronome") {
      await expect(metronomeBtn).toHaveAttribute("title", "Mute metronome");
    } else {
      await expect(metronomeBtn).toHaveAttribute("title", "Enable metronome");
    }
  });

  test("should navigate back to landing page", async ({ page }) => {
    const exitBtn = page.getByTestId("practice-exit-btn");
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();

    // Should return to root URL
    await expect(page).toHaveURL(/\/$/);
  });
});
