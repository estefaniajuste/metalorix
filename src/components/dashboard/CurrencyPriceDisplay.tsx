"use client";

import { useEffect, useState } from "react";
import type { MetalSymbol } from "@/lib/providers/metals";

const TROY_OZ_GRAMS = 31.1035;

function fmt(val: number, currency: string): string {
  if (currency === "JPY") return Math.round(val).toLocaleString("en-US");
  if (val >= 100)
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (val >= 1) return val.toFixed(2);
  return val.toFixed(4);
}

interface Props {
  symbol: MetalSymbol;
  currencyCode: string;
  currencySymbol: string;
  isLb?: boolean;
  labels: {
    perOz: string;
    perGram: string;
    perKilo: string;
    unit: string;
    loading: string;
  };
}

export function CurrencyPriceDisplay({
  symbol,
  currencyCode,
  currencySymbol,
  isLb,
  labels,
}: Props) {
  const [price, setPrice] = useState<number | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/prices").then((r) => r.json()),
      fetch("/api/forex").then((r) => r.json()),
    ])
      .then(([priceData, forexData]) => {
        const spot = priceData.prices?.find(
          (p: { symbol: string }) => p.symbol === symbol
        );
        if (spot) setPrice(spot.price);

        const rates = forexData.rates ?? forexData;
        if (currencyCode === "USD") {
          setRate(1);
        } else if (rates[currencyCode]) {
          setRate(1 / rates[currencyCode]);
        }
      })
      .catch(() => {});
  }, [symbol, currencyCode]);

  if (price === null || rate === null) {
    return (
      <div className="text-content-3 text-sm animate-pulse">
        {labels.loading}
      </div>
    );
  }

  const localPrice = price * rate;
  const baseUnit = isLb ? 453.592 : TROY_OZ_GRAMS;

  return (
    <div className="space-y-4">
      <div className="text-center py-8 bg-surface-1 border border-border rounded-DEFAULT">
        <div className="text-4xl sm:text-5xl font-extrabold text-brand-gold tabular-nums">
          {currencySymbol}
          {fmt(localPrice, currencyCode)}
        </div>
        <div className="text-sm text-content-3 mt-2">{labels.perOz}</div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-5 text-center">
          <div className="text-xl font-bold text-content-0 tabular-nums">
            {currencySymbol}
            {fmt(localPrice / baseUnit, currencyCode)}
          </div>
          <div className="text-xs text-content-3 mt-1">{labels.perGram}</div>
        </div>
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-5 text-center">
          <div className="text-xl font-bold text-content-0 tabular-nums">
            {currencySymbol}
            {fmt((localPrice / baseUnit) * 1000, currencyCode)}
          </div>
          <div className="text-xs text-content-3 mt-1">{labels.perKilo}</div>
        </div>
      </div>
    </div>
  );
}
