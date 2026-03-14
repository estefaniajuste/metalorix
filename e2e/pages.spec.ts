import { test, expect } from "@playwright/test";

const publicPages = [
  { path: "/", titleMatch: /Metalorix/i },
  { path: "/precio/oro", titleMatch: /oro/i },
  { path: "/precio/plata", titleMatch: /plata/i },
  { path: "/precio/platino", titleMatch: /platino/i },
  { path: "/precio/paladio", titleMatch: /paladio/i },
  { path: "/precio/cobre", titleMatch: /cobre/i },
  { path: "/herramientas", titleMatch: /herramientas/i },
  { path: "/noticias", titleMatch: /noticias/i },
  { path: "/aprende", titleMatch: /aprende|learn/i },
  { path: "/guia-inversion", titleMatch: /inversión|inversion|guía|guia/i },
  { path: "/privacidad", titleMatch: /privacidad/i },
  { path: "/alertas", titleMatch: /alertas/i },
];

for (const { path, titleMatch } of publicPages) {
  test(`${path} loads successfully`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page).toHaveTitle(titleMatch);
    await expect(page.locator("body")).not.toBeEmpty();
  });
}
