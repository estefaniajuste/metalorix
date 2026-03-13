"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  METALS,
  type HistoryResult,
  type MetalSymbol,
  type TimeRange,
} from "@/lib/providers/metals";
import dynamic from "next/dynamic";
import { MetalCard } from "./MetalCard";
import { RangeSelector } from "./RangeSelector";
import { DataTable } from "./DataTable";
import { CurrencyUnitToggle } from "./CurrencyUnitToggle";
import type { Currency, PriceUnit } from "@/lib/utils/units";
import { usePrices } from "@/lib/hooks/use-prices";

const PriceChart = dynamic(() => import("./PriceChart").then((m) => m.PriceChart), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-surface-1 border border-border rounded-DEFAULT animate-shimmer" />
  ),
});

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
  const [activeMetal, setActiveMetal] = useState<MetalSymbol>("XAU");
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
    loadHistory(activeMetal, activeRange);
  }, [activeMetal, activeRange, loadHistory]);

  useEffect(() => {
    (Object.keys(METALS) as MetalSymbol[]).forEach((symbol) => {
      loadHistory(symbol, "1D");
    });
  }, [loadHistory]);

  const historyKey = `${activeMetal}_${activeRange}`;

  const statusLabel =
    dataSource === "mock"
      ? tc("demo")
      : dataSource === "error"
        ? tc("error")
        : dataSource === "loading"
          ? tc("loading")
          : tc("live");

  return (
    <section className="py-[var(--section-py)]" id="dashboard">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between mb-9 flex-wrap gap-4">
          <h2 className="text-[28px] font-bold text-content-0 flex items-center gap-2.5">
            {t("spotPrices")}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                dataSource === "mock"
                  ? "bg-[rgba(214,179,90,0.12)] text-brand-gold"
                  : dataSource === "error"
                    ? "bg-signal-down-bg text-signal-down"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {prices
            ? prices.map((spot) => {
                const key1D = `${spot.symbol}_1D`;
                const histData = history[key1D]?.data;
                const sparkline = histData ? histData.map((d) => d.price) : undefined;
                return (
                  <MetalCard
                    key={spot.symbol}
                    spot={spot}
                    active={spot.symbol === activeMetal}
                    onClick={() => setActiveMetal(spot.symbol as MetalSymbol)}
                    sparklineData={sparkline}
                    currency={currency}
                    unit={unit}
                    eurUsdRate={eurUsdRate}
                  />
                );
              })
            : (Object.keys(METALS) as MetalSymbol[]).map((symbol) => (
                <div key={symbol} className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-xs bg-surface-2 animate-shimmer" />
                    <div>
                      <div className="h-4 w-16 bg-surface-2 rounded-xs animate-shimmer mb-1.5" />
                      <div className="h-3 w-10 bg-surface-2 rounded-xs animate-shimmer" />
                    </div>
                  </div>
                  <div className="h-9 w-40 bg-surface-2 rounded-xs animate-shimmer mb-2" />
                  <div className="h-4 w-24 bg-surface-2 rounded-xs animate-shimmer" />
                </div>
              ))}
        </div>

        <PriceChart symbol={activeMetal} range={activeRange} history={history[historyKey] ?? null} />
        <DataTable history={history[historyKey] ?? null} range={activeRange} />
      </div>
    </section>
  );
}
