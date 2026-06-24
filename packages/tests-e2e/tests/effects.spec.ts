import { test, expect } from "@playwright/test";

test.describe("Effects Engine & Presets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = `FX Test ${Date.now()}`;
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();
    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
  });

  test("should toggle effects modules and save a preset", async ({ page }) => {
    // Open FX panel for Track 1
    const configFxBtn = page.getByTitle("Configure track effects and mix").first();
    await expect(configFxBtn).toBeVisible();
    await configFxBtn.click();

    // Verify FX Modal is open
    await expect(page.getByText("Track 1 · Pedalboard")).toBeVisible();

    // Find Drive FX module container
    const driveModule = page.locator(".fx-module").filter({ hasText: "Drive" });
    await expect(driveModule).toBeVisible();

    // Verify default state (e.g., enable module)
    const enableBtn = driveModule.getByTitle("Enable Module");
    const bypassBtn = driveModule.getByTitle("Bypass Module");
    
    // Toggle Drive state
    if (await enableBtn.isVisible()) {
      await enableBtn.click();
      await expect(driveModule.getByTitle("Bypass Module")).toBeVisible();
    } else {
      await bypassBtn.click();
      await expect(driveModule.getByTitle("Enable Module")).toBeVisible();
    }

    // Save a custom preset using dialog handler
    const presetsBtn = driveModule.getByTitle("Presets");
    await expect(presetsBtn).toBeVisible();
    await presetsBtn.click();

    const savePresetBtn = page.getByTitle("Save current configuration as a preset");
    await expect(savePresetBtn).toBeVisible();

    // Setup dialog listener to handle the window.prompt
    const customPresetName = `My Drive Preset ${Date.now()}`;
    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("prompt");
      await dialog.accept(customPresetName);
    });

    await savePresetBtn.click();

    // Re-open presets menu to verify it is listed
    await presetsBtn.click();
    await expect(page.getByText(customPresetName)).toBeVisible();

    // Close the FX Panel modal
    const closeBtn = page.getByTitle("Close Pedalboard");
    await closeBtn.click();
    await expect(page.getByText("Track 1 · Pedalboard")).not.toBeVisible();
  });
});
