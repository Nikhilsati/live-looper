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

  test("should adjust master output volume and reset panning on double click", async ({ page }) => {
    const volumeSlider = page.locator('input[title="Adjust master output volume"], input[data-tooltip="Adjust master output volume"]');
    await expect(volumeSlider).toBeVisible();

    // Adjust volume slider and verify it updates
    await volumeSlider.fill("0.5");
    await expect(volumeSlider).toHaveValue("0.5");

    const panSlider = page.locator(".pan-slider");
    await expect(panSlider).toBeVisible();

    // Adjust pan and verify value
    await panSlider.fill("0.8");
    await expect(panSlider).toHaveValue("0.8");

    // Double-click to reset panning to center (0)
    await panSlider.dblclick();
    await expect(panSlider).toHaveValue("0");
  });

  test("should adjust tempo via buttons and tap tempo", async ({ page }) => {
    const bpmButton = page.locator("#practice-tap-tempo-btn");
    await expect(bpmButton).toBeVisible();
    
    // Expect default BPM to be visible (e.g. 100)
    await expect(bpmButton.locator("span").first()).toHaveText("100");

    // Increase BPM by 1
    const increaseBtn = page.locator('[title="Increase tempo by 1 BPM"], [data-tooltip="Increase tempo by 1 BPM"]');
    await expect(increaseBtn).toBeVisible();
    await increaseBtn.click();
    await expect(bpmButton.locator("span").first()).toHaveText("101");

    // Decrease BPM by 1 (twice)
    const decreaseBtn = page.locator('[title="Decrease tempo by 1 BPM"], [data-tooltip="Decrease tempo by 1 BPM"]');
    await expect(decreaseBtn).toBeVisible();
    await decreaseBtn.click();
    await decreaseBtn.click();
    await expect(bpmButton.locator("span").first()).toHaveText("99");

    // Tap tempo multiple times fast to set to a higher BPM
    await bpmButton.click();
    await page.waitForTimeout(150);
    await bpmButton.click();
    await page.waitForTimeout(150);
    await bpmButton.click();

    // The calculated BPM should update to a value >= 130 due to fast tapping
    const bpmText = await bpmButton.locator("span").first().textContent();
    const bpmVal = parseInt(bpmText || "0");
    expect(bpmVal).toBeGreaterThanOrEqual(130);
    expect(bpmVal).toBeLessThanOrEqual(220);
  });



  test("should toggle mute output", async ({ page }) => {
    // Start practice audio session to ensure engine is fully active
    const startStopBtn = page.locator("#practice-start-stop-btn");
    await expect(startStopBtn).toBeVisible();
    await startStopBtn.click();

    const muteBtn = page.locator("#practice-mute-btn");
    await expect(muteBtn).toBeVisible();
    
    await expect.poll(async () => {
      return await muteBtn.getAttribute("title") || await muteBtn.getAttribute("data-tooltip");
    }).toBe("Mute output");

    // Click to mute
    await muteBtn.click();
    await expect.poll(async () => {
      return await muteBtn.getAttribute("title") || await muteBtn.getAttribute("data-tooltip");
    }).toBe("Unmute output");

    // Click to unmute
    await muteBtn.click();
    await expect.poll(async () => {
      return await muteBtn.getAttribute("title") || await muteBtn.getAttribute("data-tooltip");
    }).toBe("Mute output");

    // Stop practice audio session
    await startStopBtn.click();
  });
});





