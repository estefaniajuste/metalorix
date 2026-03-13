"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { MetalSpot } from "@/lib/providers/metals";

interface ForexRates {
  [key: string]: number;
}

const CURRENCY_CODES = [
  { code: "USD", key: "usDollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", key: "euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", key: "britishPound", symbol: "£", flag: "🇬🇧" },
  { code: "CHF", key: "swissFranc", symbol: "CHF", flag: "🇨🇭" },
  { code: "JPY", key: "japaneseYen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", key: "australianDollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", key: "canadianDollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CNY", key: "chineseYuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", key: "indianRupee", symbol: "₹", flag: "🇮🇳" },
  { code: "MXN", key: "mexicanPeso", symbol: "MX$", flag: "🇲🇽" },
  { code: "BRL", key: "brazilianReal", symbol: "R$", flag: "🇧🇷" },
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

export function MultiCurrencyTable() {
  const t = useTranslations("currencyConverter");
  const tm = useTranslations("metals");
  const locale = useLocale();

  const [prices, setPrices] = useState<MetalSpot[]>([]);
  const [rates, setRates] = useState<ForexRates>({});
  const [unit, setUnit] = useState<UnitType>("oz");
  const [selectedMetal, setSelectedMetal] = useState("XAU");
  const [loading, setLoading] = useState(true);

  const metals = [
    { symbol: "XAU", name: tm("gold") },
    { symbol: "XAG", name: tm("silver") },
    { symbol: "XPT", name: tm("platinum") },
  ];

  const currencies = CURRENCY_CODES.map((c) => ({
    ...c,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: t(c.key as any),
  }));

  function formatPrice(val: number): string {
    if (val >= 10000) return val.toLocaleString(locale, { maximumFractionDigits: 0 });
    if (val >= 100) return val.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  }

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
  const metalName = metals.find((m) => m.symbol === selectedMetal)?.name ?? "";
  const unitLabel = unit === "oz" ? t("troyOunce") : unit === "g" ? t("gramUnit") : t("kilogramUnit");

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          {metals.map((m) => (
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
              {u === "oz" ? t("ounce") : u === "g" ? t("gram") : t("kilo")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-content-0">
            {t("priceTitle", { metal: metalName, unit: unitLabel })}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-0">
                <th className="text-start text-content-3 font-medium py-3 px-4">{t("currency")}</th>
                <th className="text-start text-content-3 font-medium py-3 px-4">{t("code")}</th>
                <th className="text-end text-content-3 font-medium py-3 px-4">
                  {t("pricePerUnit", { unit })}
                </th>
                <th className="text-end text-content-3 font-medium py-3 px-4 hidden sm:table-cell">
                  {t("exchangeRate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((c) => {
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
                    <td className="py-3 px-4 text-end text-content-0 font-bold tabular-nums">
                      {c.symbol}{formatPrice(converted)}
                    </td>
                    <td className="py-3 px-4 text-end text-content-3 text-xs hidden sm:table-cell">
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
