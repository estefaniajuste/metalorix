import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Metalorix/i);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("renders navigation with key links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: /herramientas/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /noticias/i })).toBeVisible();
  });

  test("renders footer", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Metalorix");
  });

  test("theme toggle works", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const initialClass = await html.getAttribute("class");
    const toggle = page.getByRole("button", { name: /tema|theme|modo/i });
    if (await toggle.isVisible()) {
      await toggle.click();
      const newClass = await html.getAttribute("class");
      expect(newClass).not.toBe(initialClass);
    }
  });
});
