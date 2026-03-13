"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { METALS, type MetalSymbol, type TimeRange } from "@/lib/providers/metals";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  ColorType,
  CrosshairMode,
  type DeepPartial,
  type ChartOptions,
  type LineData,
  type Time,
  LineStyle,
} from "lightweight-charts";

const SYMBOLS: MetalSymbol[] = ["XAU", "XAG", "XPT"];
const RANGES: { value: TimeRange; label: string }[] = [
  { value: "1W", label: "1 Sem" },
  { value: "1M", label: "1 Mes" },
  { value: "1Y", label: "1 Año" },
];

interface SeriesData {
  raw: { timestamp: string; price: number }[];
  change: number;
  changePct: number;
}

function getChartOptions(
  isDark: boolean,
  width: number,
  height: number
): DeepPartial<ChartOptions> {
  return {
    width,
    height,
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: isDark ? "#5A6478" : "#9CA3AF",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: 11,
    },
    grid: {
      vertLines: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)" },
      horzLines: { color: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)" },
    },
    crosshair: {
      mode: CrosshairMode.Magnet,
      vertLine: {
        width: 1,
        color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        labelBackgroundColor: isDark ? "#232B3E" : "#E2E5EB",
      },
      horzLine: {
        width: 1,
        color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
        labelBackgroundColor: isDark ? "#232B3E" : "#E2E5EB",
        style: LineStyle.Dashed,
      },
    },
    rightPriceScale: {
      borderVisible: false,
      scaleMargins: { top: 0.08, bottom: 0.08 },
    },
    timeScale: {
      borderVisible: false,
      timeVisible: true,
      secondsVisible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
    handleScroll: { mouseWheel: false, pressedMouseMove: false },
    handleScale: { mouseWheel: false, pinch: false },
  };
}

export function MetalComparison() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [range, setRange] = useState<TimeRange>("1M");
  const [enabled, setEnabled] = useState<Record<MetalSymbol, boolean>>({
    XAU: true,
    XAG: true,
    XPT: true,
  });
  const [allData, setAllData] = useState<Record<string, SeriesData>>({});
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesMapRef = useRef<Record<string, ISeriesApi<"Line">>>({});

  const loadData = useCallback(async (r: TimeRange) => {
    setLoading(true);
    const results: Record<string, SeriesData> = {};
    await Promise.all(
      SYMBOLS.map(async (sym) => {
        try {
          const res = await fetch(`/api/prices/history?symbol=${sym}&range=${r}`);
          const json = await res.json();
          results[`${sym}_${r}`] = {
            raw: json.data,
            change: json.change,
            changePct: json.changePct,
          };
        } catch {}
      })
    );
    setAllData((prev) => ({ ...prev, ...results }));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData(range);
  }, [range, loadData]);

  // Create chart
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const chart = createChart(container, getChartOptions(isDark, rect.width, rect.height));

    chartRef.current = chart;
    seriesMapRef.current = {};

    SYMBOLS.forEach((sym) => {
      const series = chart.addLineSeries({
        color: METALS[sym].color,
        lineWidth: 2,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: METALS[sym].color,
        crosshairMarkerBorderColor: isDark ? "#121826" : "#FFFFFF",
        crosshairMarkerBorderWidth: 2,
        priceFormat: { type: "percent" },
        title: METALS[sym].name,
      });
      seriesMapRef.current[sym] = series;
    });

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      chart.applyOptions({ width: newRect.width, height: newRect.height });
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesMapRef.current = {};
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update theme
  useEffect(() => {
    if (!chartRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    chartRef.current.applyOptions(getChartOptions(isDark, rect.width, rect.height));

    SYMBOLS.forEach((sym) => {
      const series = seriesMapRef.current[sym];
      if (series) {
        series.applyOptions({
          crosshairMarkerBorderColor: isDark ? "#121826" : "#FFFFFF",
        });
      }
    });
  }, [isDark]);

  // Update data & visibility
  useEffect(() => {
    if (!chartRef.current) return;

    SYMBOLS.forEach((sym) => {
      const series = seriesMapRef.current[sym];
      if (!series) return;

      const key = `${sym}_${range}`;
      const entry = allData[key];

      if (!entry || !enabled[sym]) {
        series.setData([]);
        return;
      }

      const basePrice = entry.raw[0]?.price;
      if (!basePrice) {
        series.setData([]);
        return;
      }

      const normalized: LineData<Time>[] = entry.raw.map((d) => ({
        time: Math.floor(new Date(d.timestamp).getTime() / 1000) as Time,
        value: ((d.price - basePrice) / basePrice) * 100,
      }));

      series.setData(normalized);
    });

    chartRef.current.timeScale().fitContent();
  }, [allData, range, enabled]);

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <h3 className="text-lg font-bold text-content-0">
          Comparador histórico
        </h3>

        {/* Range selector */}
        <div className="flex bg-surface-2 rounded-sm p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-xs transition-all ${
                range === r.value
                  ? "bg-brand-gold text-surface-0"
                  : "text-content-3 hover:text-content-1"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metal toggles */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {SYMBOLS.map((sym) => (
          <button
            key={sym}
            onClick={() =>
              setEnabled((prev) => ({ ...prev, [sym]: !prev[sym] }))
            }
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-sm border transition-all ${
              enabled[sym]
                ? "border-border bg-surface-2 text-content-0"
                : "border-transparent bg-surface-0 text-content-3 opacity-50"
            }`}
          >
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: enabled[sym] ? METALS[sym].color : "transparent",
                border: enabled[sym]
                  ? "none"
                  : `2px solid ${METALS[sym].color}`,
              }}
            />
            {METALS[sym].name}
            {allData[`${sym}_${range}`] && enabled[sym] && (
              <span
                className={`text-xs tabular-nums ${
                  allData[`${sym}_${range}`].changePct >= 0
                    ? "text-signal-up"
                    : "text-signal-down"
                }`}
              >
                {allData[`${sym}_${range}`].changePct >= 0 ? "+" : ""}
                {allData[`${sym}_${range}`].changePct}%
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div
        ref={containerRef}
        className="relative h-[360px] max-sm:h-[280px]"
      >
        {loading && (
          <div className="absolute inset-0 bg-surface-2 rounded-xs animate-shimmer" />
        )}
      </div>

      <p className="text-[10px] text-content-3 mt-3">
        Los valores están normalizados al inicio del periodo seleccionado (variación porcentual relativa).
      </p>
    </div>
  );
}
