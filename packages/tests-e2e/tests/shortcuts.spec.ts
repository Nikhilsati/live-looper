import { test, expect } from "@playwright/test";

test.describe("Keyboard Shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = `Shortcuts Test ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
    await page.locator("body").click();
  });

  test("Space shortcut should toggle playback", async ({ page }) => {
    const transportBtn = page.getByTestId("transport-button");
    await expect(transportBtn).toBeVisible();

    // Trigger Play via Space
    await page.keyboard.press("Space");
    await expect(transportBtn).toHaveClass(/danger/);

    // Trigger Stop via Space
    await page.keyboard.press("Space");
    await expect(transportBtn).toHaveClass(/primary/);
  });

  test("Number keys should toggle track arming", async ({ page }) => {
    const trackPad1 = page.getByTestId("track-pad-0");
    await expect(trackPad1).toBeVisible();
    await expect(trackPad1).toHaveAttribute("title", "Arm track for recording");

    // Press '1' to arm Track 1
    await page.keyboard.press("1");
    await expect(trackPad1).toHaveAttribute("title", "Disarm recording");

    // Press '1' again to disarm Track 1
    await page.keyboard.press("1");
    await expect(trackPad1).toHaveAttribute("title", "Arm track for recording");
  });

  test("R shortcut should control session recording depending on mode", async ({ page }) => {
    // In Planning Mode, the session record button should not be rendered
    const recordBtn = page.getByTitle("Arm Session Recording");
    await expect(recordBtn).not.toBeVisible();

    // Pressing 'r' in Planning Mode should do nothing
    await page.keyboard.press("r");
    await expect(recordBtn).not.toBeVisible();

    // Switch to Rehearsal Mode
    await page.getByRole("button", { name: "Practice", exact: true }).click();
    await expect(page.getByText("PRACTICE MODE")).toBeVisible();

    // In Rehearsal Mode, the button should now be visible
    await expect(recordBtn).toBeVisible();

    // In Rehearsal Mode, pressing 'R' should arm session recording
    await page.keyboard.press("r");
    await expect(page.getByTitle("Disarm Session Recording")).toBeVisible();

    // Pressing 'R' again should disarm session recording
    await page.keyboard.press("r");
    await expect(page.getByTitle("Arm Session Recording")).toBeVisible();
  });
});
