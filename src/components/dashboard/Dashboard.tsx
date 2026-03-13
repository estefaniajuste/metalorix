"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  METALS,
  type HistoryResult,
  type MetalSpot,
  type MetalSymbol,
  type TimeRange,
} from "@/lib/providers/metals";
import { MetalCard } from "./MetalCard";
import { RangeSelector } from "./RangeSelector";
import { PriceChart } from "./PriceChart";
import { DataTable } from "./DataTable";

async function apiFetchPrices(): Promise<{ source: string; prices: MetalSpot[] }> {
  const res = await fetch("/api/prices");
  return res.json();
}

async function apiFetchHistory(
  symbol: string,
  range: string
): Promise<{ source: string } & HistoryResult> {
  const res = await fetch(`/api/prices/history?symbol=${symbol}&range=${range}`);
  return res.json();
}

export function Dashboard() {
  const [activeMetal, setActiveMetal] = useState<MetalSymbol>("XAU");
  const [activeRange, setActiveRange] = useState<TimeRange>("1D");
  const [prices, setPrices] = useState<MetalSpot[] | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryResult>>({});
  const [dataSource, setDataSource] = useState<string>("loading");
  const historyRef = useRef(history);
  historyRef.current = history;

  const loadPrices = useCallback(async () => {
    try {
      const { source, prices: data } = await apiFetchPrices();
      setPrices(data);
      setDataSource(source);
    } catch {
      setDataSource("error");
    }
  }, []);

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
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, [loadPrices]);

  useEffect(() => {
    loadHistory(activeMetal, activeRange);
  }, [activeMetal, activeRange, loadHistory]);

  useEffect(() => {
    (Object.keys(METALS) as MetalSymbol[]).forEach((symbol) => {
      loadHistory(symbol, "1D");
    });
  }, [loadHistory]);

  const historyKey = `${activeMetal}_${activeRange}`;

  return (
    <section className="py-[var(--section-py)]" id="dashboard">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between mb-9 flex-wrap gap-4">
          <h2 className="text-[28px] font-bold text-content-0 flex items-center gap-2.5">
            Precios Spot
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                dataSource === "mock"
                  ? "bg-[rgba(214,179,90,0.12)] text-brand-gold"
                  : dataSource === "error"
                    ? "bg-signal-down-bg text-signal-down"
                    : "bg-signal-up-bg text-signal-up"
              }`}
            >
              {dataSource === "mock"
                ? "Demo"
                : dataSource === "error"
                  ? "Error"
                  : dataSource === "loading"
                    ? "Cargando"
                    : "En vivo"}
            </span>
          </h2>
          <RangeSelector active={activeRange} onChange={setActiveRange} />
        </div>

        {/* Metal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {prices
            ? prices.map((spot) => (
                <MetalCard
                  key={spot.symbol}
                  spot={spot}
                  active={spot.symbol === activeMetal}
                  onClick={() => setActiveMetal(spot.symbol as MetalSymbol)}
                />
              ))
            : (Object.keys(METALS) as MetalSymbol[]).map((symbol) => (
                <div
                  key={symbol}
                  className="bg-surface-1 border border-border rounded-DEFAULT p-6"
                >
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

        {/* Chart */}
        <PriceChart
          symbol={activeMetal}
          range={activeRange}
          history={history[historyKey] ?? null}
        />

        {/* Data Table */}
        <DataTable history={history[historyKey] ?? null} range={activeRange} />
      </div>
    </section>
  );
}
