"use client";

import { useEffect, useState } from "react";
import type { MetalSpot, MetalSymbol } from "@/lib/providers/metals";
import { METALS } from "@/lib/providers/metals";

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "Dólar estadounidense", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "Libra esterlina", flag: "🇬🇧" },
  { code: "CHF", symbol: "Fr", name: "Franco suizo", flag: "🇨🇭" },
  { code: "JPY", symbol: "¥", name: "Yen japonés", flag: "🇯🇵" },
];

function formatCurrency(val: number, code: string) {
  if (code === "JPY") {
    return val.toLocaleString("es-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return val.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyConverter() {
  const [metal, setMetal] = useState<MetalSymbol>("XAU");
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pricesRes, ratesRes] = await Promise.all([
          fetch("/api/prices"),
          fetch("/api/exchange-rates"),
        ]);
        const pricesData = await pricesRes.json();
        const ratesData = await ratesRes.json();

        const map: Record<string, number> = {};
        pricesData.prices.forEach((p: MetalSpot) => {
          map[p.symbol] = p.price;
        });
        setPrices(map);
        setRates(ratesData.rates || {});
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const priceUSD = prices[metal] ?? 0;

  if (loading) {
    return (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
        <div className="h-6 w-48 bg-surface-2 rounded-xs animate-shimmer mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-surface-2 rounded-sm animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <h3 className="text-lg font-bold text-content-0 mb-2">
        Precio en divisas
      </h3>
      <p className="text-xs text-content-3 mb-5">
        Precio por onza troy en las principales divisas mundiales
      </p>

      {/* Metal selector */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {(Object.keys(METALS) as MetalSymbol[]).map((sym) => (
          <button
            key={sym}
            onClick={() => setMetal(sym)}
            className={`text-sm font-medium py-2 rounded-sm transition-all ${
              metal === sym
                ? "bg-brand-gold text-surface-0"
                : "bg-surface-2 text-content-2 hover:bg-surface-2/80"
            }`}
          >
            {METALS[sym].name}
          </button>
        ))}
      </div>

      {/* Price list */}
      <div className="space-y-2">
        {CURRENCIES.map((curr) => {
          const rate = curr.code === "USD" ? 1 : (rates[curr.code] ?? 0);
          const converted = priceUSD * rate;

          return (
            <div
              key={curr.code}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm border transition-colors ${
                curr.code === "EUR"
                  ? "bg-surface-2 border-border-hover"
                  : "bg-surface-0 border-border"
              }`}
            >
              <span className="text-lg flex-shrink-0">{curr.flag}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-content-0">
                  {curr.code}
                </div>
                <div className="text-[10px] text-content-3 truncate">
                  {curr.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-content-0 tabular-nums">
                  {curr.symbol}{formatCurrency(converted, curr.code)}
                </div>
                {curr.code !== "USD" && rate > 0 && (
                  <div className="text-[10px] text-content-3 tabular-nums">
                    1 USD = {rate < 10 ? rate.toFixed(4) : rate.toFixed(2)} {curr.code}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-content-3 mt-4 text-center">
        Tipos de cambio actualizados cada hora. Pueden diferir del mercado real.
      </p>
    </div>
  );
}
