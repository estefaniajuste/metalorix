import { test, expect } from "@playwright/test";

test.describe("API routes", () => {
  test("GET /api/prices returns metal prices", async ({ request }) => {
    const response = await request.get("/api/prices");
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("prices");
    expect(Array.isArray(data.prices)).toBe(true);
    expect(data.prices.length).toBeGreaterThanOrEqual(1);

    const price = data.prices[0];
    expect(price).toHaveProperty("symbol");
    expect(price).toHaveProperty("price");
    expect(typeof price.price).toBe("number");
  });

  test("GET /api/exchange-rates returns rates", async ({ request }) => {
    const response = await request.get("/api/exchange-rates");
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("rates");
  });

  test("POST /api/vitals accepts metrics", async ({ request }) => {
    const response = await request.post("/api/vitals", {
      data: { name: "LCP", value: 1200, id: "test-e2e" },
    });
    expect(response.status()).toBe(200);
  });

  test("POST /api/errors accepts error reports", async ({ request }) => {
    const response = await request.post("/api/errors", {
      data: { message: "E2E test error", path: "/test", digest: "e2e" },
    });
    expect(response.status()).toBe(200);
  });
});
