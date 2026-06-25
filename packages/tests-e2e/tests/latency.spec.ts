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
    const settingsBtn = page.locator('[title="Settings"], [data-tooltip="Settings"]').first();
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    // Find smart snap checkbox
    const snapCheckbox = page.locator('input[title="Toggle auto-aligning of recorded loops to the nearest bar boundary"]');
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

  test("should toggle Separate Cue Mix and show/hide performer output selection", async ({ page }) => {
    // Open Settings popover using a robust selector
    const settingsBtn = page.locator('[title="Settings"], [data-tooltip="Settings"]').first();
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    // Verify Performer Output header is not visible initially
    const performerOutputHeader = page.getByText("Performer Output");
    await expect(performerOutputHeader).not.toBeVisible();

    // Find and check Separate Cue Mix checkbox
    const cueMixCheckbox = page.locator('input[title="Toggle separate routing for performer monitoring (cue mix) vs main audience mix"]');
    await expect(cueMixCheckbox).toBeVisible();
    await expect(cueMixCheckbox).not.toBeChecked();

    // Check it
    await cueMixCheckbox.click();
    await expect(cueMixCheckbox).toBeChecked();

    // Verify Performer Output header is now visible
    await expect(performerOutputHeader).toBeVisible();

    // Uncheck it
    await cueMixCheckbox.click();
    await expect(cueMixCheckbox).not.toBeChecked();

    // Verify Performer Output header is hidden again
    await expect(performerOutputHeader).not.toBeVisible();

    // Close settings popover
    await settingsBtn.click();
    await expect(cueMixCheckbox).not.toBeVisible();
  });
});

