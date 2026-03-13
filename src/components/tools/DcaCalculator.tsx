"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { MetalSpot } from "@/lib/providers/metals";
import { METALS } from "@/lib/providers/metals";

type MetalSymbol = "XAU" | "XAG" | "XPT";

interface DcaResult {
  totalInvested: number;
  currentValue: number;
  totalOz: number;
  avgCostPerOz: number;
  gainLoss: number;
  gainLossPct: number;
  purchases: { month: number; price: number; oz: number; invested: number }[];
}

const AMOUNT_PRESETS = [50, 100, 200, 500, 1000];

function formatCurrency(n: number): string {
  return n.toLocaleString("es-ES", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function generateHistoricalPrices(
  currentPrice: number,
  months: number,
  symbol: MetalSymbol
): number[] {
  const volatility: Record<MetalSymbol, number> = {
    XAU: 0.015,
    XAG: 0.035,
    XPT: 0.025,
  };
  const drift: Record<MetalSymbol, number> = {
    XAU: 0.005,
    XAG: 0.003,
    XPT: 0.002,
  };

  const vol = volatility[symbol];
  const d = drift[symbol];

  const prices: number[] = [];
  let price = currentPrice;

  for (let i = months; i >= 0; i--) {
    prices.push(price);
    const monthlyReturn = -d + (Math.sin(i * 0.8) * vol * 2) + ((i % 3 === 0 ? -1 : 1) * vol);
    price = price / (1 + monthlyReturn);
  }

  return prices.reverse();
}

function simulateDca(
  monthlyAmount: number,
  prices: number[],
  currentPrice: number
): DcaResult {
  const purchases: DcaResult["purchases"] = [];
  let totalOz = 0;

  for (let i = 0; i < prices.length - 1; i++) {
    const price = prices[i];
    const oz = monthlyAmount / price;
    totalOz += oz;
    purchases.push({
      month: i + 1,
      price,
      oz,
      invested: monthlyAmount,
    });
  }

  const totalInvested = monthlyAmount * (prices.length - 1);
  const currentValue = totalOz * currentPrice;
  const avgCostPerOz = totalInvested / totalOz;
  const gainLoss = currentValue - totalInvested;
  const gainLossPct = (gainLoss / totalInvested) * 100;

  return {
    totalInvested,
    currentValue,
    totalOz,
    avgCostPerOz,
    gainLoss,
    gainLossPct,
    purchases,
  };
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "up" | "down" | null;
}) {
  return (
    <div className="bg-surface-2 rounded-sm p-4">
      <div className="text-[11px] text-content-3 uppercase tracking-wider font-medium mb-1">
        {label}
      </div>
      <div
        className={`text-lg font-bold tabular-nums ${
          highlight === "up"
            ? "text-signal-up"
            : highlight === "down"
              ? "text-signal-down"
              : "text-content-0"
        }`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[11px] text-content-3 mt-0.5">{sub}</div>
      )}
    </div>
  );
}

function MiniBarChart({ purchases, maxPrice }: { purchases: DcaResult["purchases"]; maxPrice: number }) {
  const t = useTranslations("dcaCalculator");
  if (purchases.length === 0) return null;
  const barWidth = Math.max(2, Math.min(12, 400 / purchases.length));

  return (
    <div className="flex items-end gap-px h-24 mt-4">
      {purchases.map((p, i) => {
        const heightPct = (p.price / maxPrice) * 100;
        return (
          <div
            key={i}
            className="bg-brand-gold/40 hover:bg-brand-gold/70 rounded-t-[1px] transition-colors"
            style={{
              height: `${heightPct}%`,
              width: `${barWidth}px`,
              minWidth: "2px",
            }}
            title={`${t("month")} ${p.month}: ${formatCurrency(p.price)}/oz — ${p.oz.toFixed(4)} oz`}
          />
        );
      })}
    </div>
  );
}

export function DcaCalculator() {
  const t = useTranslations("dcaCalculator");
  const tMetals = useTranslations("metalNames");
  const [metal, setMetal] = useState<MetalSymbol>("XAU");
  const [amount, setAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState("");
  const [months, setMonths] = useState(24);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const PERIOD_OPTIONS = useMemo(
    () => [
      { value: 6, label: t("months6") },
      { value: 12, label: t("year1") },
      { value: 24, label: t("years2") },
      { value: 36, label: t("years3") },
      { value: 60, label: t("years5") },
    ],
    [t]
  );

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices");
        const { prices: data } = await res.json();
        const map: Record<string, number> = {};
        for (const spot of data as MetalSpot[]) {
          map[spot.symbol] = spot.price;
        }
        setPrices(map);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const currentPrice = prices[metal] || 0;

  const historicalPrices = useMemo(() => {
    if (!currentPrice) return [];
    return generateHistoricalPrices(currentPrice, months, metal);
  }, [currentPrice, months, metal]);

  const result = useMemo(() => {
    if (!currentPrice || historicalPrices.length < 2 || effectiveAmount <= 0)
      return null;
    return simulateDca(effectiveAmount, historicalPrices, currentPrice);
  }, [effectiveAmount, historicalPrices, currentPrice]);

  const maxPrice = useMemo(() => {
    if (!result) return 0;
    return Math.max(...result.purchases.map((p) => p.price));
  }, [result]);

  const handleAmountPreset = useCallback((preset: number) => {
    setAmount(preset);
    setCustomAmount("");
  }, []);

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-content-0 mb-1">
            {t("title")}
          </h3>
          <p className="text-sm text-content-2">
            {t("description")}
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider flex-shrink-0">
          {t("simulation")}
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {/* Metal selector */}
        <div>
          <label className="block text-[11px] text-content-3 uppercase tracking-wider font-medium mb-2">
            {t("metal")}
          </label>
          <div className="flex gap-1.5">
            {(["XAU", "XAG", "XPT"] as MetalSymbol[]).map((s) => (
              <button
                key={s}
                onClick={() => setMetal(s)}
                className={`flex-1 py-2 rounded-sm text-xs font-semibold transition-all ${
                  metal === s
                    ? "text-[#0B0F17] shadow-sm"
                    : "bg-surface-2 text-content-2 hover:text-content-0"
                }`}
                style={
                  metal === s
                    ? { backgroundColor: METALS[s].color }
                    : undefined
                }
              >
                {tMetals(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-[11px] text-content-3 uppercase tracking-wider font-medium mb-2">
            {t("monthlyInvestment")}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {AMOUNT_PRESETS.map((preset) => (
              <button
                key={preset}
                onClick={() => handleAmountPreset(preset)}
                className={`px-2.5 py-1.5 rounded-sm text-xs font-medium transition-all ${
                  !customAmount && amount === preset
                    ? "bg-brand-gold text-[#0B0F17]"
                    : "bg-surface-2 text-content-2 hover:text-content-0"
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            placeholder={t("otherAmount")}
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            aria-label={t("otherAmount")}
            className="mt-2 w-full bg-surface-2 border border-border rounded-sm px-3 py-1.5 text-sm text-content-0 placeholder:text-content-3 focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        {/* Period */}
        <div>
          <label className="block text-[11px] text-content-3 uppercase tracking-wider font-medium mb-2">
            {t("period")}
          </label>
          <div className="flex flex-col gap-1.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMonths(opt.value)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all text-left ${
                  months === opt.value
                    ? "bg-brand-gold text-[#0B0F17]"
                    : "bg-surface-2 text-content-2 hover:text-content-0"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-2 rounded-sm p-4">
              <div className="h-3 w-16 bg-surface-1 rounded-xs animate-shimmer mb-2" />
              <div className="h-6 w-24 bg-surface-1 rounded-xs animate-shimmer" />
            </div>
          ))}
        </div>
      ) : result ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard
              label={t("totalInvested")}
              value={formatCurrency(result.totalInvested)}
              sub={`${months} ${t("purchases")} ${formatCurrency(effectiveAmount)}`}
            />
            <StatCard
              label={t("currentValue")}
              value={formatCurrency(result.currentValue)}
              sub={`${result.totalOz.toFixed(4)} oz ${tMetals(metal)}`}
              highlight={result.gainLoss >= 0 ? "up" : "down"}
            />
            <StatCard
              label={t("avgCostOz")}
              value={formatCurrency(result.avgCostPerOz)}
              sub={`${t("currentSpot")}: ${formatCurrency(currentPrice)}`}
            />
            <StatCard
              label={t("performance")}
              value={`${result.gainLoss >= 0 ? "+" : ""}${formatCurrency(result.gainLoss)}`}
              sub={`${result.gainLossPct >= 0 ? "+" : ""}${result.gainLossPct.toFixed(2)}%`}
              highlight={result.gainLoss >= 0 ? "up" : "down"}
            />
          </div>

          {/* Price chart */}
          <div className="bg-surface-2 rounded-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-content-3 uppercase tracking-wider font-medium">
                {t("purchasePriceMonth")}
              </span>
              <span className="text-[11px] text-content-3">
                {result.purchases.length} {t("purchases")}
              </span>
            </div>
            <MiniBarChart purchases={result.purchases} maxPrice={maxPrice} />
            <div className="flex justify-between mt-2 text-[10px] text-content-3">
              <span>{t("month")} 1</span>
              <span>{t("month")} {result.purchases.length}</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-5 p-4 bg-surface-2 rounded-sm">
            <p className="text-xs text-content-2 leading-relaxed">
              <strong className="text-content-0">{t("whatIsDca")}</strong>{" "}
              {t("dcaExplanation")}
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-content-3 text-sm">
          {effectiveAmount <= 0
            ? t("enterAmount")
            : t("noData")}
        </div>
      )}
    </div>
  );
}
