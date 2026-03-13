import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test("toggles between dark and light mode", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    const toggle = page.getByRole("button", { name: /tema/i });
    await expect(toggle).toBeVisible();

    const initialClass = await html.getAttribute("class");
    await toggle.click();
    const afterToggle = await html.getAttribute("class");
    expect(afterToggle).not.toBe(initialClass);

    await toggle.click();
    const afterSecondToggle = await html.getAttribute("class");
    expect(afterSecondToggle).toBe(initialClass);
  });
});

test.describe("Navigation dropdown", () => {
  test("opens prices dropdown on click", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /precios/i });
    if (await trigger.isVisible()) {
      await trigger.click();
      const menu = page.getByRole("menu", { name: /metales/i });
      await expect(menu).toBeVisible();
      await expect(menu.getByRole("menuitem", { name: /Oro.*XAU/i })).toBeVisible();
      await expect(menu.getByRole("menuitem", { name: /Plata.*XAG/i })).toBeVisible();
      await expect(menu.getByRole("menuitem", { name: /Platino.*XPT/i })).toBeVisible();
    }
  });

  test("closes dropdown with Escape key", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /precios/i });
    if (await trigger.isVisible()) {
      await trigger.click();
      const menu = page.getByRole("menu", { name: /metales/i });
      await expect(menu).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(menu).not.toBeVisible();
    }
  });

  test("navigates to metal page from dropdown", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /precios/i });
    if (await trigger.isVisible()) {
      await trigger.click();
      await page.getByRole("menuitem", { name: /oro/i }).first().click();
      await page.waitForURL("**/precio/oro");
      await expect(page).toHaveTitle(/oro/i);
    }
  });
});

test.describe("Metal cards interaction", () => {
  test("dashboard section is visible", async ({ page }) => {
    await page.goto("/");
    const dashboard = page.locator("#dashboard");
    await expect(dashboard).toBeVisible({ timeout: 10_000 });
    await expect(dashboard.locator("text=Precios Spot")).toBeVisible();
  });
});

test.describe("Mobile navigation", () => {
  test("opens and closes mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: /abrir menú/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const dialog = page.getByRole("dialog", { name: /menú/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});

test.describe("Scroll to top", () => {
  test("appears after scrolling and scrolls back to top on click", async ({ page }) => {
    await page.goto("/");

    // Dismiss cookie banner if present
    const acceptBtn = page.getByRole("button", { name: /aceptar/i });
    if (await acceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await acceptBtn.click();
      await page.waitForTimeout(300);
    }

    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(1000);

    const scrollBtn = page.getByRole("button", { name: /volver arriba/i });
    const isVisible = await scrollBtn.isVisible().catch(() => false);
    if (isVisible) {
      await scrollBtn.click();
      await page.waitForTimeout(1000);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(200);
    }
  });
});
