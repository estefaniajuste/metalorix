"use client";

import { useEffect, useState } from "react";
import type { MetalSpot } from "@/lib/providers/metals";

interface ForexRates {
  [key: string]: number;
}

const CURRENCIES = [
  { code: "USD", name: "Dólar estadounidense", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "Libra esterlina", symbol: "£", flag: "🇬🇧" },
  { code: "CHF", name: "Franco suizo", symbol: "CHF", flag: "🇨🇭" },
  { code: "JPY", name: "Yen japonés", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Dólar australiano", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Dólar canadiense", symbol: "C$", flag: "🇨🇦" },
  { code: "CNY", name: "Yuan chino", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Rupia india", symbol: "₹", flag: "🇮🇳" },
  { code: "MXN", name: "Peso mexicano", symbol: "MX$", flag: "🇲🇽" },
  { code: "BRL", name: "Real brasileño", symbol: "R$", flag: "🇧🇷" },
];

const METALS = [
  { symbol: "XAU", name: "Oro" },
  { symbol: "XAG", name: "Plata" },
  { symbol: "XPT", name: "Platino" },
];

const TROY_OZ_GRAMS = 31.1035;

type UnitType = "oz" | "g" | "kg";

function convertPrice(
  usdPerOz: number,
  currencyCode: string,
  rates: ForexRates,
  unit: UnitType
): number {
  let price = usdPerOz;

  // Unit conversion
  if (unit === "g") price = usdPerOz / TROY_OZ_GRAMS;
  else if (unit === "kg") price = (usdPerOz / TROY_OZ_GRAMS) * 1000;

  // Currency conversion
  if (currencyCode === "USD") return price;
  const rate = rates[currencyCode];
  if (!rate || rate === 0) return price;
  return price / rate;
}

function formatPrice(val: number): string {
  if (val >= 10000) return val.toLocaleString("es-ES", { maximumFractionDigits: 0 });
  if (val >= 100) return val.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (val >= 1) return val.toFixed(2);
  return val.toFixed(4);
}

export function MultiCurrencyTable() {
  const [prices, setPrices] = useState<MetalSpot[]>([]);
  const [rates, setRates] = useState<ForexRates>({});
  const [unit, setUnit] = useState<UnitType>("oz");
  const [selectedMetal, setSelectedMetal] = useState("XAU");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/prices").then((r) => r.json()),
      fetch("/api/forex").then((r) => r.json()),
    ])
      .then(([priceData, forexData]) => {
        setPrices(priceData.prices || []);
        setRates(forexData.rates || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-96 bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />
    );
  }

  const metalSpot = prices.find((p) => p.symbol === selectedMetal);
  const usdPrice = metalSpot?.price ?? 0;
  const metalName = METALS.find((m) => m.symbol === selectedMetal)?.name ?? "";
  const unitLabel = unit === "oz" ? "onza troy" : unit === "g" ? "gramo" : "kilogramo";

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Metal selector */}
        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          {METALS.map((m) => (
            <button
              key={m.symbol}
              onClick={() => setSelectedMetal(m.symbol)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                selectedMetal === m.symbol
                  ? "bg-brand-gold text-[#0B0F17]"
                  : "text-content-3 hover:text-content-1"
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Unit selector */}
        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          {(["oz", "g", "kg"] as UnitType[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                unit === u
                  ? "bg-brand-gold text-[#0B0F17]"
                  : "text-content-3 hover:text-content-1"
              }`}
            >
              {u === "oz" ? "Onza" : u === "g" ? "Gramo" : "Kilo"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-content-0">
            Precio del {metalName} por {unitLabel} en diferentes divisas
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-0">
                <th className="text-left text-content-3 font-medium py-3 px-4">Divisa</th>
                <th className="text-left text-content-3 font-medium py-3 px-4">Código</th>
                <th className="text-right text-content-3 font-medium py-3 px-4">
                  Precio/{unit}
                </th>
                <th className="text-right text-content-3 font-medium py-3 px-4 hidden sm:table-cell">
                  Tipo de cambio
                </th>
              </tr>
            </thead>
            <tbody>
              {CURRENCIES.map((c) => {
                const converted = convertPrice(usdPrice, c.code, rates, unit);
                const rate = c.code === "USD" ? 1 : rates[c.code] ?? 0;
                const rateDisplay =
                  c.code === "USD"
                    ? "—"
                    : rate >= 1
                      ? `1 ${c.code} = $${rate.toFixed(4)}`
                      : `$1 = ${(1 / rate).toFixed(2)} ${c.code}`;

                return (
                  <tr
                    key={c.code}
                    className="border-b border-border/50 last:border-0 hover:bg-surface-0/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{c.flag}</span>
                        <span className="text-content-1 font-medium">
                          {c.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-content-3 font-mono text-xs">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 text-right text-content-0 font-bold tabular-nums">
                      {c.symbol}{formatPrice(converted)}
                    </td>
                    <td className="py-3 px-4 text-right text-content-3 text-xs hidden sm:table-cell">
                      {rateDisplay}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
