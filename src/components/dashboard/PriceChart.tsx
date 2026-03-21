"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/layout/ThemeProvider";
import type { HistoryResult, MetalSymbol } from "@/lib/providers/metals";
import { METALS } from "@/lib/providers/metals";
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type AreaSeriesPartialOptions,
  type CandlestickSeriesPartialOptions,
  ColorType,
  CrosshairMode,
  type DeepPartial,
  type ChartOptions,
  type AreaData,
  type CandlestickData,
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
    handleScroll: { mouseWheel: true, pressedMouseMove: true },
    handleScale: { mouseWheel: true, pinch: true },
  };
}

const PRICE_FORMAT = {
  type: "price" as const,
  precision: 2,
  minMove: 0.01,
};

function getAreaSeriesOptions(
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
    priceFormat: PRICE_FORMAT,
  };
}

function getCandlestickSeriesOptions(
  _color: string,
  _isDark: boolean
): CandlestickSeriesPartialOptions {
  return {
    upColor: "#34D399",
    downColor: "#F87171",
    borderUpColor: "#34D399",
    borderDownColor: "#F87171",
    wickUpColor: "#34D399",
    wickDownColor: "#F87171",
    priceFormat: PRICE_FORMAT,
  };
}

function hasOhlc(data: HistoryResult["data"]): boolean {
  return data.length > 0 && data.every((d) => d.open != null && d.high != null && d.low != null);
}

export function PriceChart({ symbol, range, history }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | ISeriesApi<"Candlestick"> | null>(null);
  const seriesTypeRef = useRef<"area" | "candlestick">("area");
  const [zoomed, setZoomed] = useState(false);
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
    chartRef.current = chart;

    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      chart.applyOptions({ width: newRect.width, height: newRect.height });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    chart.timeScale().subscribeVisibleLogicalRangeChange(() => {
      setZoomed(true);
    });

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
    const opts =
      seriesTypeRef.current === "candlestick"
        ? getCandlestickSeriesOptions(metal.color, isDark)
        : getAreaSeriesOptions(metal.color, isDark);
    seriesRef.current.applyOptions(opts);
  }, [isDark, metal.color]);

  // Update data and series type (area vs candlestick)
  useEffect(() => {
    if (!chartRef.current || !history) return;

    const useCandlestick = hasOhlc(history.data);
    const chart = chartRef.current;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const needsNewSeries =
      !seriesRef.current || seriesTypeRef.current !== (useCandlestick ? "candlestick" : "area");

    if (needsNewSeries && seriesRef.current) {
      chart.removeSeries(seriesRef.current);
      seriesRef.current = null;
    }

    if (!seriesRef.current) {
      const series = useCandlestick
        ? chart.addCandlestickSeries(getCandlestickSeriesOptions(metal.color, isDark))
        : chart.addAreaSeries(getAreaSeriesOptions(metal.color, isDark));
      seriesRef.current = series;
      seriesTypeRef.current = useCandlestick ? "candlestick" : "area";
    }

    if (useCandlestick) {
      const data: CandlestickData<Time>[] = history.data.map((d) => ({
        time: (Math.floor(new Date(d.timestamp).getTime() / 1000)) as Time,
        open: d.open!,
        high: d.high!,
        low: d.low!,
        close: d.price,
      }));
      (seriesRef.current as ISeriesApi<"Candlestick">).setData(data);
    } else {
      const data: AreaData<Time>[] = history.data.map((d) => ({
        time: (Math.floor(new Date(d.timestamp).getTime() / 1000)) as Time,
        value: d.price,
      }));
      (seriesRef.current as ISeriesApi<"Area">).setData(data);
    }

    chart.timeScale().fitContent();
    setZoomed(false);
  }, [history, metal.color, isDark]);

  const handleFit = useCallback(() => {
    chartRef.current?.timeScale().fitContent();
    setZoomed(false);
  }, []);

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
        <div className="flex items-center gap-3">
          {zoomed && (
            <button
              onClick={handleFit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm bg-surface-2 text-content-2 hover:text-content-0 hover:bg-surface-3 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
              Fit
            </button>
          )}
          {history && (
            <>
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
            </>
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative h-[380px] max-sm:h-[280px]"
      >
        {!history && (
          <div className="absolute inset-0 bg-surface-2 rounded-xs animate-shimmer" />
        )}
      </div>
    </div>
  );
}
