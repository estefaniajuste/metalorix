"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  METALS,
  type HistoryResult,
  type MetalSymbol,
  type TimeRange,
} from "@/lib/providers/metals";
import { MetalCard } from "./MetalCard";
import { RangeSelector } from "./RangeSelector";
import { CurrencyUnitToggle } from "./CurrencyUnitToggle";
import type { Currency, PriceUnit } from "@/lib/utils/units";
import { usePrices } from "@/lib/hooks/use-prices";

async function apiFetchHistory(
  symbol: string,
  range: string
): Promise<{ source: string } & HistoryResult> {
  const res = await fetch(`/api/prices/history?symbol=${symbol}&range=${range}`);
  return res.json();
}

export function Dashboard() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [activeRange, setActiveRange] = useState<TimeRange>("1D");
  const { prices, source: dataSource, lastUpdate } = usePrices();
  const [history, setHistory] = useState<Record<string, HistoryResult>>({});
  const [currency, setCurrency] = useState<Currency>("USD");
  const [unit, setUnit] = useState<PriceUnit>("oz");
  const [eurUsdRate, setEurUsdRate] = useState(1.08);
  const historyRef = useRef(history);
  historyRef.current = history;

  const loadHistory = useCallback(
    async (symbol: MetalSymbol, range: TimeRange) => {
      const key = `${symbol}_${range}`;
      if (historyRef.current[key]) return;
      try {
        const { data, change, changePct } = await apiFetchHistory(symbol, range);
        setHistory((prev) => ({ ...prev, [key]: { data, change, changePct } }));
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    },
    []
  );

  useEffect(() => {
    fetch("/api/forex")
      .then((r) => r.json())
      .then((d) => {
        if (d.EURUSD) setEurUsdRate(d.EURUSD);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    (Object.keys(METALS) as MetalSymbol[]).forEach((symbol) => {
      loadHistory(symbol, activeRange);
    });
  }, [activeRange, loadHistory]);

  const allSpotZero = prices
    ? prices.every((p) => Math.abs(p.changePct) < 0.01 && Math.abs(p.change) < 0.01)
    : false;
  const marketClosed = allSpotZero && dataSource !== "mock" && dataSource !== "loading" && dataSource !== "error";

  const statusLabel =
    dataSource === "mock"
      ? tc("demo")
      : dataSource === "error"
        ? tc("error")
        : dataSource === "loading"
          ? tc("loading")
          : marketClosed
            ? t("marketClosedShort")
            : tc("live");

  return (
    <section className="pt-6 pb-8" id="dashboard">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-content-0 flex items-center gap-2.5">
            {t("spotPrices")}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                dataSource === "mock"
                  ? "bg-[rgba(214,179,90,0.12)] text-brand-gold"
                  : dataSource === "error"
                    ? "bg-signal-down-bg text-signal-down"
                    : marketClosed
                      ? "bg-[rgba(214,179,90,0.12)] text-brand-gold"
                      : "bg-signal-up-bg text-signal-up"
              }`}
            >
              {statusLabel}
            </span>
            {lastUpdate && (
              <span className="text-[11px] text-content-3 font-normal ms-1 tabular-nums">
                · {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            <CurrencyUnitToggle
              currency={currency}
              unit={unit}
              onCurrencyChange={setCurrency}
              onUnitChange={setUnit}
            />
            <RangeSelector active={activeRange} onChange={setActiveRange} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {prices
            ? prices.map((spot, i) => {
                const rangeKey = `${spot.symbol}_${activeRange}`;
                const rangeHist = history[rangeKey];
                const sparkline = rangeHist?.data
                  ? rangeHist.data.map((d) => d.price)
                  : undefined;
                const rangeChange = rangeHist
                  ? { change: rangeHist.change, changePct: rangeHist.changePct }
                  : undefined;
                return (
                  <div
                    key={spot.symbol}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <MetalCard
                      spot={spot}
                      active={false}
                      onClick={() => {}}
                      sparklineData={sparkline}
                      rangeChange={rangeChange}
                      currency={currency}
                      unit={unit}
                      eurUsdRate={eurUsdRate}
                      marketClosed={marketClosed}
                    />
                  </div>
                );
              })
            : (Object.keys(METALS) as MetalSymbol[]).map((symbol, i) => (
                <div
                  key={symbol}
                  className="bg-surface-1 border border-border rounded-DEFAULT p-5 animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xs bg-surface-2 animate-shimmer" />
                    <div>
                      <div className="h-4 w-14 bg-surface-2 rounded-xs animate-shimmer mb-1" />
                      <div className="h-3 w-10 bg-surface-2 rounded-xs animate-shimmer" />
                    </div>
                  </div>
                  <div className="h-8 w-28 bg-surface-2 rounded-xs animate-shimmer mb-2" />
                  <div className="h-3 w-20 bg-surface-2 rounded-xs animate-shimmer" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
