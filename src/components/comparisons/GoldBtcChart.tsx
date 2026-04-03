"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/ThemeProvider";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  ColorType,
  CrosshairMode,
  type LineData,
  type Time,
} from "lightweight-charts";

interface DataPoint {
  time: number;
  price: number;
}

const PERIODS = [
  { label: "1M", days: "30" },
  { label: "3M", days: "90" },
  { label: "1Y", days: "365" },
  { label: "5Y", days: "1825" },
] as const;

const GOLD_COLOR = "#D6B35A";
const BTC_COLOR = "#F7931A";

function normalize(data: DataPoint[]): LineData<Time>[] {
  if (!data.length) return [];
  const base = data[0].price;
  if (base === 0) return [];
  return data.map((d) => ({
    time: d.time as Time,
    value: (d.price / base) * 100,
  }));
}

async function fetchBtcHistory(days: string): Promise<DataPoint[]> {
  try {
    const r = await fetch(`/api/btc-history?days=${days}`);
    if (!r.ok) return [];
    const d = await r.json();
    return d.prices ?? [];
  } catch {
    return [];
  }
}

async function fetchGoldHistory(days: string): Promise<DataPoint[]> {
  const rangeMap: Record<string, string> = {
    "30": "1M",
    "90": "3M",
    "365": "1Y",
    "1825": "5Y",
  };
  try {
    const r = await fetch(
      `/api/prices/history?symbol=XAU&range=${rangeMap[days] ?? "1Y"}`,
    );
    if (!r.ok) return [];
    const d = await r.json();
    return (d.data ?? []).map((pt: { timestamp: string; price: number }) => ({
      time: Math.floor(new Date(pt.timestamp).getTime() / 1000),
      price: pt.price,
    }));
  } catch {
    return [];
  }
}

export function GoldBtcChart() {
  const t = useTranslations("comparisons");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartRef = useRef<HTMLDivElement>(null);
  const chartApiRef = useRef<IChartApi | null>(null);
  const goldSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const btcSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [period, setPeriod] = useState("365");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (days: string) => {
    setLoading(true);
    const [btcRaw, goldRaw] = await Promise.all([
      fetchBtcHistory(days),
      fetchGoldHistory(days),
    ]);

    const btcNorm = normalize(btcRaw);
    const goldNorm = normalize(goldRaw);

    if (goldSeriesRef.current) goldSeriesRef.current.setData(goldNorm);
    if (btcSeriesRef.current) btcSeriesRef.current.setData(btcNorm);
    if (chartApiRef.current) chartApiRef.current.timeScale().fitContent();

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    const bg = isDark ? "#121826" : "#ffffff";
    const text = isDark ? "#8891a5" : "#6b7280";
    const grid = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
    const border = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: bg },
        textColor: text,
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: grid },
        horzLines: { color: grid },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { width: 1, color: border, style: 2, labelBackgroundColor: bg },
        horzLine: { width: 1, color: border, style: 2, labelBackgroundColor: bg },
      },
      rightPriceScale: {
        borderColor: border,
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: border,
        timeVisible: false,
      },
    });

    chartApiRef.current = chart;

    const goldSeries = chart.addLineSeries({
      color: GOLD_COLOR,
      lineWidth: 2,
      title: t("goldLabel"),
      priceFormat: { type: "custom", formatter: (v: number) => v.toFixed(1) },
    });

    const btcSeries = chart.addLineSeries({
      color: BTC_COLOR,
      lineWidth: 2,
      title: "Bitcoin",
      priceFormat: { type: "custom", formatter: (v: number) => v.toFixed(1) },
    });

    goldSeriesRef.current = goldSeries;
    btcSeriesRef.current = btcSeries;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    ro.observe(chartRef.current);

    loadData(period);

    return () => {
      ro.disconnect();
      chart.remove();
      chartApiRef.current = null;
      goldSeriesRef.current = null;
      btcSeriesRef.current = null;
    };
  }, [isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chartApiRef.current) loadData(period);
  }, [period, loadData]);

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-sm font-semibold text-content-1">
          {t("dashboard.chartTitle")}
          <span className="ml-2 text-xs text-content-3 font-normal">
            ({t("dashboard.normalized")})
          </span>
        </h3>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setPeriod(p.days)}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                period === p.days
                  ? "bg-brand-gold/15 text-brand-gold"
                  : "text-content-3 hover:text-content-1 hover:bg-surface-2"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface-1/80">
            <span className="text-sm text-content-3">
              {t("dashboard.loading")}
            </span>
          </div>
        )}
        <div ref={chartRef} className="w-full rounded-sm overflow-hidden" />
      </div>

      <div className="flex items-center gap-6 mt-3 text-xs text-content-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-0.5 rounded-full"
            style={{ background: GOLD_COLOR }}
          />
          {t("goldLabel")}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-0.5 rounded-full"
            style={{ background: BTC_COLOR }}
          />
          Bitcoin
        </div>
      </div>
    </div>
  );
}
