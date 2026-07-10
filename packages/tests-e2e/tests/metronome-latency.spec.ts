import { test, expect } from "@playwright/test";

test.describe("Loop Metronome Latency & Export Test", () => {
  test.beforeEach(async ({ page }) => {
    // Start page
    await page.goto("/#/looper");
  });

  test("should record track 1 while metronome plays, then export the mix", async ({ page }) => {
    // 1. Create a project
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    
    const projectName = `Metronome Latency ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page.locator(`text=${projectName}`)).toBeVisible();

    // 2. Ensure Metronome is ON (it is on by default)
    // Wait for the UI to settle
    await page.waitForTimeout(1000);

    // 3. Start Recording Export
    await page.getByRole("button", { name: "Record Performance" }).click();
    await expect(page.getByRole("button", { name: "Stop Recording" })).toBeVisible();

    // 4. Start recording on Track 1
    const trackPad = page.getByTestId("track-pad-0");
    await trackPad.click();
    await expect(page.getByText("Waiting for bar end").first()).toBeVisible();
    
    // Play transport
    await page.getByTestId("transport-button").click();

    // Wait for it to become Recording
    await expect(page.getByText("Recording").first()).toBeVisible({ timeout: 10000 });

    // Wait a bit to record audio + metronome bleed (or fake stream)
    await page.waitForTimeout(4000);

    // Stop recording track 1
    await trackPad.click();
    await expect(page.getByText("Playing").first()).toBeVisible({ timeout: 10000 });

    // Stop transport
    await page.getByTestId("transport-button").click();

    // 5. Stop Export and verify download
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Stop Export" }).click();
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/Jam_Session_.*\.webm/);
    
    // The test passes if the file is downloaded successfully!
  });
});
