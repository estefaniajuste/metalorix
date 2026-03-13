import { NextResponse } from "next/server";

const CURRENCIES = ["EUR", "GBP", "CHF", "JPY"];
const CACHE_TTL = 3600 * 1000; // 1 hour

let cachedRates: Record<string, number> | null = null;
let cachedAt = 0;

async function fetchRates(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() - cachedAt < CACHE_TTL) {
    return cachedRates;
  }

  try {
    const res = await fetch(
      `https://api.exchangerate.host/latest?base=USD&symbols=${CURRENCIES.join(",")}&access_key=`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error(`Exchange rate API ${res.status}`);
    const data = await res.json();
    if (data.rates) {
      cachedRates = data.rates;
      cachedAt = Date.now();
      return data.rates;
    }
  } catch {}

  // Fallback: try frankfurter.app (free, no key)
  try {
    const res = await fetch(
      `https://api.frankfurter.app/latest?from=USD&to=${CURRENCIES.join(",")}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Frankfurter API ${res.status}`);
    const data = await res.json();
    if (data.rates) {
      cachedRates = data.rates;
      cachedAt = Date.now();
      return data.rates;
    }
  } catch {}

  // Hardcoded approximate fallback
  const fallback: Record<string, number> = {
    EUR: 0.92,
    GBP: 0.79,
    CHF: 0.88,
    JPY: 150.5,
  };
  cachedRates = fallback;
  cachedAt = Date.now();
  return fallback;
}

export async function GET() {
  const rates = await fetchRates();
  return NextResponse.json({
    base: "USD",
    rates,
    updatedAt: new Date().toISOString(),
  });
}
