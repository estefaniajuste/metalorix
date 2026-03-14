"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/ThemeProvider";
import type { HistoryResult, MetalSymbol } from "@/lib/providers/metals";
import { METALS } from "@/lib/providers/metals";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type AreaSeriesPartialOptions,
  ColorType,
  CrosshairMode,
  type DeepPartial,
  type ChartOptions,
  type AreaData,
  type Time,
} from "lightweight-charts";

interface PriceChartProps {
  symbol: MetalSymbol;
  range: string;
  history: HistoryResult | null;
}

function formatPrice(val: number) {
  return val >= 100
    ? val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : val.toFixed(2);
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

function getSeriesOptions(
  color: string,
  isDark: boolean
): AreaSeriesPartialOptions {
  return {
    lineColor: color,
    lineWidth: 2,
    topColor: color + "40",
    bottomColor: color + "05",
    crosshairMarkerBackgroundColor: color,
    crosshairMarkerBorderColor: isDark ? "#121826" : "#FFFFFF",
    crosshairMarkerBorderWidth: 2,
    crosshairMarkerRadius: 5,
    priceFormat: {
      type: "price",
      precision: 2,
      minMove: 0.01,
    },
  };
}

export function PriceChart({ symbol, range, history }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const { theme } = useTheme();
  const tm = useTranslations("metalNames");
  const metal = METALS[symbol];
  const isDark = theme === "dark";

  // Create chart on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const chart = createChart(container, getChartOptions(isDark, rect.width, rect.height));
    const series = chart.addAreaSeries(getSeriesOptions(metal.color, isDark));

    chartRef.current = chart;
    seriesRef.current = series;

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
      seriesRef.current = null;
    };
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Update theme
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    chartRef.current.applyOptions(getChartOptions(isDark, rect.width, rect.height));
    seriesRef.current.applyOptions(getSeriesOptions(metal.color, isDark));
  }, [isDark, metal.color]);

  // Update data
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || !history) return;

    seriesRef.current.applyOptions(getSeriesOptions(metal.color, isDark));

    const data: AreaData<Time>[] = history.data.map((d) => ({
      time: (Math.floor(new Date(d.timestamp).getTime() / 1000)) as Time,
      value: d.price,
    }));

    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
  }, [history, metal.color, isDark]);

  const isUp = history ? history.change >= 0 : true;

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-6 transition-colors">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-content-0">
            {tm(symbol)} ({symbol})
          </span>
          <span className="text-sm text-content-3">
            {range}
          </span>
        </div>
        {history && (
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-content-0 tabular-nums">
              ${formatPrice(history.data[history.data.length - 1]?.price ?? 0)}
            </span>
            <span
              className={`text-sm font-medium tabular-nums ${
                isUp ? "text-signal-up" : "text-signal-down"
              }`}
            >
              {isUp ? "+" : ""}
              {history.changePct}%
            </span>
          </div>
        )}
      </div>
      <div
        ref={containerRef}
        className="relative h-[340px] max-sm:h-[260px]"
      >
        {!history && (
          <div className="absolute inset-0 bg-surface-2 rounded-xs animate-shimmer" />
        )}
      </div>
    </div>
  );
}
