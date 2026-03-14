import { METALS, MockProvider } from "@/lib/providers/metals";
import type { MetalSymbol, TimeRange } from "@/lib/providers/metals";

describe("METALS constant", () => {
  it("contains all supported metals", () => {
    expect(Object.keys(METALS)).toEqual(["XAU", "XAG", "XPT", "XPD", "HG"]);
  });

  it("each metal has required properties", () => {
    for (const [, metal] of Object.entries(METALS)) {
      expect(metal).toHaveProperty("name");
      expect(metal).toHaveProperty("base");
      expect(metal).toHaveProperty("vol");
      expect(metal).toHaveProperty("color");
      expect(typeof metal.name).toBe("string");
      expect(typeof metal.base).toBe("number");
      expect(metal.base).toBeGreaterThan(0);
      expect(metal.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe("MockProvider.getSpotPrices", () => {
  it("returns 5 metals", async () => {
    const prices = await MockProvider.getSpotPrices();
    expect(prices).toHaveLength(5);
  });

  it("each price has required fields", async () => {
    const prices = await MockProvider.getSpotPrices();
    for (const p of prices) {
      expect(p).toHaveProperty("symbol");
      expect(p).toHaveProperty("name");
      expect(p).toHaveProperty("price");
      expect(p).toHaveProperty("change");
      expect(p).toHaveProperty("changePct");
      expect(p).toHaveProperty("updatedAt");
      expect(typeof p.price).toBe("number");
      expect(p.price).toBeGreaterThan(0);
    }
  });

  it("returns correct symbols in order", async () => {
    const prices = await MockProvider.getSpotPrices();
    expect(prices.map((p) => p.symbol)).toEqual(["XAU", "XAG", "XPT", "XPD", "HG"]);
  });

  it("gold is more expensive than silver", async () => {
    const prices = await MockProvider.getSpotPrices();
    const gold = prices.find((p) => p.symbol === "XAU")!;
    const silver = prices.find((p) => p.symbol === "XAG")!;
    expect(gold.price).toBeGreaterThan(silver.price);
  });
});

describe("MockProvider.getHistory", () => {
  const ranges: TimeRange[] = ["1D", "1W", "1M", "3M", "6M", "1Y", "2Y", "5Y"];
  const symbols: MetalSymbol[] = ["XAU", "XAG", "XPT", "XPD", "HG"];

  it.each(symbols)("returns data for %s", async (symbol) => {
    const result = await MockProvider.getHistory(symbol, "1M");
    expect(result.data.length).toBeGreaterThan(0);
    expect(result).toHaveProperty("change");
    expect(result).toHaveProperty("changePct");
  });

  it.each(ranges)("returns correct point count for range %s", async (range) => {
    const expectedPoints: Record<TimeRange, number> = {
      "1D": 48,
      "1W": 42,
      "1M": 30,
      "3M": 90,
      "6M": 26,
      "1Y": 52,
      "2Y": 52,
      "5Y": 60,
    };
    const result = await MockProvider.getHistory("XAU", range);
    expect(result.data).toHaveLength(expectedPoints[range]);
  });

  it("history points have timestamp and price", async () => {
    const result = await MockProvider.getHistory("XAU", "1D");
    for (const point of result.data) {
      expect(point).toHaveProperty("timestamp");
      expect(point).toHaveProperty("price");
      expect(typeof point.price).toBe("number");
      expect(point.price).toBeGreaterThan(0);
      expect(() => new Date(point.timestamp)).not.toThrow();
    }
  });

  it("history is deterministic (seeded random)", async () => {
    const a = await MockProvider.getHistory("XAU", "1M");
    const b = await MockProvider.getHistory("XAU", "1M");
    expect(a.data.map((d) => d.price)).toEqual(b.data.map((d) => d.price));
  });

  it("timestamps are chronologically ordered", async () => {
    const result = await MockProvider.getHistory("XAG", "1W");
    for (let i = 1; i < result.data.length; i++) {
      const prev = new Date(result.data[i - 1].timestamp).getTime();
      const curr = new Date(result.data[i].timestamp).getTime();
      expect(curr).toBeGreaterThan(prev);
    }
  });
});
