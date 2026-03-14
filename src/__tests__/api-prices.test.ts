import { METALS } from "@/lib/providers/metals";
import type { MetalSpot } from "@/lib/providers/metals";

const ALL_SYMBOLS = Object.keys(METALS);

function ensureAllMetals(
  prices: MetalSpot[],
  fallback: MetalSpot[]
): MetalSpot[] {
  const bySymbol = new Map(prices.map((p) => [p.symbol, p]));
  for (const fb of fallback) {
    if (!bySymbol.has(fb.symbol)) {
      bySymbol.set(fb.symbol, fb);
    }
  }
  return ALL_SYMBOLS
    .map((s) => bySymbol.get(s))
    .filter((p): p is MetalSpot => !!p);
}

const mockSpot = (symbol: string, price: number): MetalSpot => ({
  symbol,
  name: symbol,
  price,
  change: 0,
  changePct: 0,
  updatedAt: new Date().toISOString(),
});

describe("ensureAllMetals (price merge logic)", () => {
  it("returns all 5 metals when DB has all", () => {
    const db = [mockSpot("XAU", 2000), mockSpot("XAG", 25), mockSpot("XPT", 900), mockSpot("XPD", 1000), mockSpot("HG", 4.5)];
    const result = ensureAllMetals(db, []);
    expect(result).toHaveLength(5);
    expect(result.map((r) => r.symbol)).toEqual(["XAU", "XAG", "XPT", "XPD", "HG"]);
  });

  it("fills missing metals from fallback", () => {
    const db = [mockSpot("XAU", 2000)];
    const fallback = [mockSpot("XAU", 1999), mockSpot("XAG", 25), mockSpot("XPT", 900), mockSpot("XPD", 1000), mockSpot("HG", 4.5)];
    const result = ensureAllMetals(db, fallback);
    expect(result).toHaveLength(5);
    expect(result[0].price).toBe(2000);
    expect(result[1].price).toBe(25);
    expect(result[2].price).toBe(900);
  });

  it("preserves DB prices over fallback", () => {
    const db = [mockSpot("XAU", 5000), mockSpot("XAG", 80)];
    const fallback = [mockSpot("XAU", 4999), mockSpot("XAG", 79), mockSpot("XPT", 2000), mockSpot("XPD", 1000), mockSpot("HG", 4.5)];
    const result = ensureAllMetals(db, fallback);
    expect(result[0].price).toBe(5000);
    expect(result[1].price).toBe(80);
    expect(result[2].price).toBe(2000);
  });

  it("returns metals in correct order", () => {
    const scrambled = [mockSpot("XPT", 900), mockSpot("HG", 4.5), mockSpot("XAU", 2000), mockSpot("XPD", 1000), mockSpot("XAG", 25)];
    const result = ensureAllMetals(scrambled, []);
    expect(result.map((r) => r.symbol)).toEqual(["XAU", "XAG", "XPT", "XPD", "HG"]);
  });

  it("handles empty primary, uses all from fallback", () => {
    const fallback = [mockSpot("XAU", 2000), mockSpot("XAG", 25), mockSpot("XPT", 900), mockSpot("XPD", 1000), mockSpot("HG", 4.5)];
    const result = ensureAllMetals([], fallback);
    expect(result).toHaveLength(5);
  });
});
