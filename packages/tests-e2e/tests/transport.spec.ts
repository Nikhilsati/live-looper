import { test, expect } from "@playwright/test";

test.describe("Transport & Playback", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#/looper");
    await page.getByRole("button").filter({ hasText: "Create Project" }).click();
    const projectName = "Transport Test";
    await page.getByPlaceholder("Project Name...").fill(projectName);
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page).toHaveURL(/\/#\/projects\/.+/);
    await expect(page.locator("h1").filter({ hasText: projectName })).toBeVisible();
  });

  test("should toggle play/stop", async ({ page }) => {
    const transportBtn = page.getByTestId("transport-button");
    await expect(transportBtn).toBeVisible();

    // Start playback
    await transportBtn.click();

    // Button should switch to danger variant for Stop
    await expect(transportBtn).toHaveClass(/danger/);

    // Stop playback
    await transportBtn.click();
    await expect(transportBtn).toHaveClass(/primary/);
  });

  test("should change BPM", async ({ page }) => {
    // Open BPM popup
    await page.getByTestId("bpm-button").click();

    // Wait for popover transition
    await page.waitForTimeout(350);

    const bpmInput = page.getByTestId("bpm-input");
    await expect(bpmInput).toBeVisible();

    // Fill the input directly
    await bpmInput.fill("105");

    // Check if BPM value updated via the input. Default 100 -> 105.
    await expect(bpmInput).toHaveValue("105");
  });
});
