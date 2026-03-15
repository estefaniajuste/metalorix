import { test, expect } from "@playwright/test";

test.describe("SEO", () => {
  test("homepage has meta description", async ({ page }) => {
    await page.goto("/");
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveAttribute("content", /.{20,}/);
  });

  test("homepage has canonical URL", async ({ page }) => {
    await page.goto("/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /metalorix/i);
  });

  test("homepage has JSON-LD schema", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).toContain("application/ld+json");
    expect(html).toContain("https://schema.org");
    expect(html).toContain("Metalorix");
  });

  test("sitemap.xml returns empty urlset", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<urlset");
  });

  test("robots.txt blocks all crawlers", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body.toLowerCase()).toContain("user-agent");
    expect(body).toContain("Disallow: /");
    expect(body).not.toContain("Sitemap");
  });

  test("metal pages have Open Graph tags", async ({ page }) => {
    await page.goto("/precio/oro");
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);
    const ogDesc = page.locator('meta[property="og:description"]');
    await expect(ogDesc).toHaveAttribute("content", /.+/);
  });
});
