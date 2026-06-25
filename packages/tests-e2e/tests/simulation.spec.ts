import { test, expect } from "@playwright/test";

// Force video recording for this specific test suite
test.use({ video: "on" });

test.describe("Full Looper Jam Session Simulation", () => {

  test("should run a 1.5 minute dummy jam session, record loops, modify FX, and change modes", async ({ page }) => {
    // 120 seconds timeout to prevent the test from timing out during the long simulation
    test.setTimeout(120000);

    console.log("Starting full jam simulation...");

    // ─── STEP 1: INITIALIZE ───
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    
    const projectName = `SimJam ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
    
    console.log("Project created:", projectName);

    // ─── STEP 2: CONFIGURE BPM ───
    await page.getByTestId("bpm-button").click();
    await page.waitForTimeout(300);
    const bpmInput = page.getByTestId("bpm-input");
    await expect(bpmInput).toBeVisible();
    await bpmInput.fill("115");
    await expect(bpmInput).toHaveValue("115");
    // Close BPM modal/popup by clicking the overlay
    await page.locator(".ui-modal-overlay").click({ position: { x: 5, y: 5 } });
    await page.waitForTimeout(500);

    // ─── STEP 3: RECORD TRACK 1 (BASE LOOP) ───
    console.log("Recording Track 1...");
    const trackPad1 = page.getByTestId("track-pad-0");
    await trackPad1.click();
    await expect(page.getByText("Armed").first()).toBeVisible();

    // Start playback & recording
    const transportBtn = page.getByTestId("transport-button");
    await transportBtn.click();
    await expect(page.getByText("Recording").first()).toBeVisible({ timeout: 5000 });

    // The looper will record for 1 section (approx 8.3s at 115 BPM) and auto-commit to "Playing"
    await expect(page.getByText("Playing").first()).toBeVisible({ timeout: 15000 });
    console.log("Track 1 recorded successfully!");

    // ─── STEP 4: CONFIGURE EFFECTS ON TRACK 1 ───
    console.log("Configuring Effects on Track 1...");
    const configFxBtn = page.getByTitle("Configure track effects and mix").first();
    await expect(configFxBtn).toBeVisible();
    await configFxBtn.click();

    // Verify FX Pedalboard modal is open
    await expect(page.getByText("Track 1 · Pedalboard")).toBeVisible();

    // Enable Drive module
    const driveModule = page.locator(".fx-module").filter({ hasText: "Drive" });
    const enableBtn = driveModule.getByTitle("Enable Module");
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
    }
    await page.waitForTimeout(1000); // let the effect apply

    // Close Pedalboard
    const closeBtn = page.getByTitle("Close Pedalboard");
    await closeBtn.click();
    await page.waitForTimeout(500);

    // ─── STEP 5: RECORD TRACK 2 (OVERDUB/MELODY LOOP) ───
    console.log("Recording Track 2...");
    const trackPad2 = page.getByTestId("track-pad-1");
    // Arm Track 2 (whilst transport is running, it will sync-arm and then record)
    await trackPad2.click();
    await expect(page.getByText("Armed").first()).toBeVisible();
    
    // Wait for the recording state to start on Track 2 (on section loop boundary)
    await expect(page.getByText("Recording").first()).toBeVisible({ timeout: 12000 });
    
    // The looper will record for 1 section and auto-commit Track 2 to "Playing"
    await expect(page.getByText("Playing").nth(1)).toBeVisible({ timeout: 15000 });
    console.log("Track 2 recorded successfully!");

    // ─── STEP 6: PERFORMER MIX (MUTE / SOLO ACTIONS) ───
    console.log("Testing Track Mix Mute and Solo...");
    const track1MuteBtn = page.locator("#track-0-mute-btn");
    
    // Mute Track 1
    await track1MuteBtn.click();
    await page.waitForTimeout(4000);
    
    // Unmute Track 1
    await track1MuteBtn.click();
    await page.waitForTimeout(2000);

    // Solo Track 1
    const track1SoloBtn = page.locator("#track-0-solo-btn");
    await track1SoloBtn.click();
    await page.waitForTimeout(4000);
    
    // Unsolo Track 1
    await track1SoloBtn.click();
    await page.waitForTimeout(2000);

    // ─── STEP 7: TRANSITION TO PRACTICE MODE ───
    console.log("Switching to Practice Mode...");
    await page.getByRole("button", { name: "Practice", exact: true }).click();
    await expect(page.getByText("PRACTICE MODE")).toBeVisible();
    
    // Interact with master volume slider in Practice Mode
    const volumeSlider = page.locator('input[title="Adjust master output volume"], input[data-tooltip="Adjust master output volume"]');
    if (await volumeSlider.isVisible()) {
      await volumeSlider.fill("0.75");
      await page.waitForTimeout(1000);
    }
    
    // Toggle Mute Output
    const muteOutputBtn = page.locator("#practice-mute-btn");
    if (await muteOutputBtn.isVisible()) {
      await muteOutputBtn.click();
      await page.waitForTimeout(2000);
      await muteOutputBtn.click();
      await page.waitForTimeout(1000);
    }

    // ─── STEP 8: TRANSITION TO LIVE PERFORMANCE MODE ───
    console.log("Switching to Live Performance Mode...");
    await page.getByRole("button", { name: "● LIVE" }).click();
    await expect(page.getByText("LIVE MODE")).toBeVisible();

    // Verify UI components constraints (Settings are hidden)
    const settingsBtn = page.getByTitle("Settings", { exact: true });
    await expect(settingsBtn).not.toBeVisible();

    // Let the live loop session run for another 15 seconds
    await page.waitForTimeout(15000);

    // ─── STEP 9: WRAP UP ───
    console.log("Ending simulation...");
    // Go back to Plan mode to stop transport if needed, or stop it here
    await page.getByRole("button", { name: "Plan", exact: true }).click();
    await expect(page.getByText("PLANNING MODE")).toBeVisible();

    // Stop playback
    await transportBtn.click();
    await page.waitForTimeout(2000);

    console.log("Jam session simulation complete!");
  });
});
