import { test, expect } from "@playwright/test";

test.describe("Accessibility basics", () => {
  test("page has lang attribute", async ({ page }) => {
    await page.goto("/");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBeTruthy();
  });

  test("skip-to-content link exists", async ({ page }) => {
    await page.goto("/");
    const skip = page.locator('a[href="#main-content"]');
    expect(await skip.count()).toBeGreaterThanOrEqual(1);
  });

  test("images have alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });

  test("no broken heading hierarchy on homepage", async ({ page }) => {
    await page.goto("/");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });

  test("interactive elements are keyboard-focusable", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    expect(["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"]).toContain(focused);
  });
});
