import { test, expect } from "@playwright/test";

test.describe("Latency Compensation & Performance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = `Latency Test ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
  });

  test("should toggle performance monitor and trigger calibration", async ({ page }) => {
    const perfBtn = page.getByTitle("Show Performance");
    await expect(perfBtn).toBeVisible();
    
    // Open LatencyMonitor
    await perfBtn.click();
    await expect(page.getByText("Performance")).toBeVisible();
    await expect(page.getByText("PROCESS JITTER")).toBeVisible();

    // Trigger RTL Calibration
    const calibrateBtn = page.getByTitle("Measure and compensate for microphone-to-speaker round-trip latency");
    await expect(calibrateBtn).toBeVisible();
    await calibrateBtn.click();

    // It should switch to "CALIBRATING..." state
    await expect(page.getByText("CALIBRATING...")).toBeVisible();

    // Close LatencyMonitor
    await page.getByTitle("Hide Performance").click();
    await expect(page.getByText("Performance")).not.toBeVisible();
  });

  test("should toggle Smart Snap in settings popover", async ({ page }) => {
    const settingsBtn = page.getByTitle("Settings", { exact: true });
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    // Find smart snap checkbox
    const snapCheckbox = page.getByTitle("Toggle auto-aligning of recorded loops to the nearest bar boundary");
    await expect(snapCheckbox).toBeVisible();

    // Toggle snap state
    const isChecked = await snapCheckbox.isChecked();
    await snapCheckbox.click();
    expect(await snapCheckbox.isChecked()).toBe(!isChecked);

    await snapCheckbox.click();
    expect(await snapCheckbox.isChecked()).toBe(isChecked);

    // Close settings popover by clicking settings button again
    await settingsBtn.click();
    await expect(snapCheckbox).not.toBeVisible();
  });
});
