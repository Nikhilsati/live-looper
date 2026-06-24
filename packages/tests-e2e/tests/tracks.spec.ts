import { test, expect } from "@playwright/test";

test.describe("Track Interactions & Controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = `Track Test ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
  });

  test("should toggle track arming", async ({ page }) => {
    const trackPad = page.getByTestId("track-pad-0");
    await expect(trackPad).toBeVisible();
    await expect(trackPad).toHaveAttribute("title", "Arm track for recording");

    // Arm track
    await trackPad.click();
    await expect(trackPad).toHaveAttribute("title", "Disarm recording");

    // Disarm track
    await trackPad.click();
    await expect(trackPad).toHaveAttribute("title", "Arm track for recording");
  });

  test("should mute and unmute track", async ({ page }) => {
    const muteBtn = page.locator("#track-0-mute-btn");
    await expect(muteBtn).toBeVisible();

    // Mute Track
    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute("title", "Unmute track");
    await expect(page.locator(".timeline-section-card").first()).toBeVisible(); // sanity

    // Unmute Track
    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute("title", "Mute track");
  });

  test("should solo and unsolo track", async ({ page }) => {
    const soloBtn = page.locator("#track-0-solo-btn");
    await expect(soloBtn).toBeVisible();

    // Solo Track
    await soloBtn.click();
    await expect(soloBtn).toHaveAttribute("title", "Clear solo");

    // Unsolo Track
    await soloBtn.click();
    await expect(soloBtn).toHaveAttribute("title", "Solo this track");
  });

  test("should configure input channel modes", async ({ page }) => {
    const channelSettingsBtn = page.getByTitle("Input channel settings (change device and Mono/Stereo mode)").first();
    await expect(channelSettingsBtn).toBeVisible();
    await expect(channelSettingsBtn).toContainText("stereo");

    // Open configuration popover
    await channelSettingsBtn.click();

    // Toggle to Mono mode
    const monoBtn = page.getByTitle("Set input channel mode to Mono (combines left & right inputs)");
    await expect(monoBtn).toBeVisible();
    await monoBtn.click();

    // Assert change propagates to trigger button
    await expect(channelSettingsBtn).toContainText("mono");

    // Toggle back to Stereo
    const stereoBtn = page.getByTitle("Set input channel mode to Stereo (keeps left & right inputs separate)");
    await expect(stereoBtn).toBeVisible();
    await stereoBtn.click();

    // Assert change propagates back
    await expect(channelSettingsBtn).toContainText("stereo");
  });
});
