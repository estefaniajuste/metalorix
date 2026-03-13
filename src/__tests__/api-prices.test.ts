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
  it("returns all 3 metals when DB has all", () => {
    const db = [mockSpot("XAU", 2000), mockSpot("XAG", 25), mockSpot("XPT", 900)];
    const result = ensureAllMetals(db, []);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.symbol)).toEqual(["XAU", "XAG", "XPT"]);
  });

  it("fills missing metals from fallback", () => {
    const db = [mockSpot("XAU", 2000)];
    const fallback = [mockSpot("XAU", 1999), mockSpot("XAG", 25), mockSpot("XPT", 900)];
    const result = ensureAllMetals(db, fallback);
    expect(result).toHaveLength(3);
    expect(result[0].price).toBe(2000); // DB price wins for XAU
    expect(result[1].price).toBe(25);    // Fallback for XAG
    expect(result[2].price).toBe(900);   // Fallback for XPT
  });

  it("preserves DB prices over fallback", () => {
    const db = [mockSpot("XAU", 5000), mockSpot("XAG", 80)];
    const fallback = [mockSpot("XAU", 4999), mockSpot("XAG", 79), mockSpot("XPT", 2000)];
    const result = ensureAllMetals(db, fallback);
    expect(result[0].price).toBe(5000);
    expect(result[1].price).toBe(80);
    expect(result[2].price).toBe(2000);
  });

  it("returns metals in correct order (XAU, XAG, XPT)", () => {
    const scrambled = [mockSpot("XPT", 900), mockSpot("XAU", 2000), mockSpot("XAG", 25)];
    const result = ensureAllMetals(scrambled, []);
    expect(result.map((r) => r.symbol)).toEqual(["XAU", "XAG", "XPT"]);
  });

  it("handles empty primary, uses all from fallback", () => {
    const fallback = [mockSpot("XAU", 2000), mockSpot("XAG", 25), mockSpot("XPT", 900)];
    const result = ensureAllMetals([], fallback);
    expect(result).toHaveLength(3);
  });
});
