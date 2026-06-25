import { test, expect } from "@playwright/test";

test.describe("Loop Recording & Playback (Live Dummy Session)", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    
    // Navigate to local app looper
    await page.goto("/#/looper");
    
    // Create a new test project
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = `Recording Spec Project ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    
    // Wait for the project workspace to load
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
  });

  test("should arm a track, record fake audio, and transition to playing state", async ({ page }) => {
    // 1. Identify Track 1 Pad
    const trackPad = page.getByTestId("track-pad-0");
    await expect(trackPad).toBeVisible();
    await expect(page.getByText("Idle").first()).toBeVisible();

    // 2. Arm Track 1 for recording
    await trackPad.click();
    
    // Since the transport is stopped, the track pad visual state should show "Armed"
    await expect(page.getByText("Armed").first()).toBeVisible();

    // 3. Start the transport (playback & recording)
    const transportBtn = page.getByTestId("transport-button");
    await expect(transportBtn).toBeVisible();
    await transportBtn.click();

    // 4. Wait for recording to begin (it starts on transport play)
    // The visual state should transition from "Armed" to "Recording"
    await expect(page.getByText("Recording").first()).toBeVisible({ timeout: 10000 });

    // 5. Let it record for a few seconds (e.g. 5 seconds)
    await page.waitForTimeout(5000);

    // 6. Disarm the track to finish/save the loop layer
    await trackPad.click();

    // 7. Verify the track transitions to "Playing" state (meaning it successfully captured audio)
    await expect(page.getByText("Playing").first()).toBeVisible({ timeout: 10000 });

    // 8. Stop the transport
    await transportBtn.click();
    
    // The transport button should return to primary variant, and track should stay in "Playing" mode
    await expect(page.getByText("Playing").first()).toBeVisible();
  });

  test("should persist recorded track layers across page reload/refresh", async ({ page }) => {
    // 1. Identify Track 1 Pad
    const trackPad = page.getByTestId("track-pad-0");
    await expect(trackPad).toBeVisible();
    await expect(page.getByText("Idle").first()).toBeVisible();

    // Toggle metronome off before recording
    const metronomeBtn = page.locator('button[title="Mute Metronome"], button[title="Unmute Metronome"]');
    await expect(metronomeBtn).toHaveAttribute("title", "Mute Metronome");
    await metronomeBtn.click();
    await expect(metronomeBtn).toHaveAttribute("title", "Unmute Metronome");

    // 2. Arm Track 1 for recording
    await trackPad.click();
    await expect(page.getByText("Armed").first()).toBeVisible();

    // 3. Start the transport
    const transportBtn = page.getByTestId("transport-button");
    await transportBtn.click();

    // 4. Wait for recording to start
    await expect(page.getByText("Recording").first()).toBeVisible({ timeout: 10000 });

    // 5. Record for 3 seconds
    await page.waitForTimeout(3000);

    // 6. Disarm the track to stop recording and commit layer
    await trackPad.click();

    // 7. Verify the track transitions to "Playing" state
    await expect(page.getByText("Playing").first()).toBeVisible({ timeout: 10000 });
    
    // We should also see "1 Layer" label in the layer row indicator
    await expect(page.getByText("1 Layer")).toBeVisible();

    // 8. Stop transport
    await transportBtn.click();

    // 9. Reload page to simulate browser refresh
    await page.reload();

    // 10. Wait for the page/project workspace to reload
    await expect(page.getByTestId("track-pad-0")).toBeVisible();
    
    // 11. Assert that the layer has been correctly persisted and is loaded back
    await expect(page.getByText("Playing").first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("1 Layer")).toBeVisible();

    // Verify metronome state remains "off" (Unmute Metronome title) after page reload
    await expect(metronomeBtn).toHaveAttribute("title", "Unmute Metronome");
  });
});
