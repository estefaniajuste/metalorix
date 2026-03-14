"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface DataPoint {
  t: number;
  p: number;
}

interface CompareData {
  series: Record<string, DataPoint[]>;
}

function normalizeToPercent(data: DataPoint[]): DataPoint[] {
  if (data.length === 0) return [];
  const base = data[0].p;
  return data.map((d) => ({ t: d.t, p: ((d.p - base) / base) * 100 }));
}

export function MetalComparator() {
  const t = useTranslations("comparatorPage");
  const tm = useTranslations("metals");

  const metals = [
    { symbol: "XAU", name: tm("gold"), color: "#D6B35A" },
    { symbol: "XAG", name: tm("silver"), color: "#A7B0BE" },
    { symbol: "XPT", name: tm("platinum"), color: "#8B9DC3" },
    { symbol: "XPD", name: tm("palladium"), color: "#CED0CE" },
    { symbol: "HG", name: tm("copper"), color: "#B87333" },
  ];

  const ranges = [
    { value: "1m", label: "1M" },
    { value: "3m", label: "3M" },
    { value: "6m", label: "6M" },
    { value: "1y", label: "1Y" },
    { value: "2y", label: "2Y" },
    { value: "5y", label: "5Y" },
    { value: "10y", label: "10Y" },
    { value: "max", label: t("max") },
  ];

  const [range, setRange] = useState("1y");
  const [raw, setRaw] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"percent" | "absolute">("percent");
  const [selected, setSelected] = useState<string[]>(["XAU", "XAG", "XPT", "XPD", "HG"]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/compare?range=${range}`)
      .then((r) => r.json())
      .then((data) => setRaw(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !raw?.series) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const PAD_L = 60;
    const PAD_R = 16;
    const PAD_T = 20;
    const PAD_B = 40;
    const chartW = W - PAD_L - PAD_R;
    const chartH = H - PAD_T - PAD_B;

    ctx.clearRect(0, 0, W, H);

    const datasets = metals.filter((m) => selected.includes(m.symbol)).map(
      (m) => {
        const points =
          mode === "percent"
            ? normalizeToPercent(raw.series[m.symbol] || [])
            : raw.series[m.symbol] || [];
        return { ...m, points };
      }
    );

    if (datasets.every((d) => d.points.length === 0)) return;

    let tMin = Infinity,
      tMax = -Infinity,
      pMin = Infinity,
      pMax = -Infinity;
    for (const d of datasets) {
      for (const pt of d.points) {
        if (pt.t < tMin) tMin = pt.t;
        if (pt.t > tMax) tMax = pt.t;
        if (pt.p < pMin) pMin = pt.p;
        if (pt.p > pMax) pMax = pt.p;
      }
    }

    if (mode === "percent") {
      const absMax = Math.max(Math.abs(pMin), Math.abs(pMax)) * 1.1;
      pMin = -absMax;
      pMax = absMax;
    } else {
      const margin = (pMax - pMin) * 0.1;
      pMin -= margin;
      pMax += margin;
    }

    const tRange = tMax - tMin || 1;
    const pRange = pMax - pMin || 1;

    const toX = (t: number) => PAD_L + ((t - tMin) / tRange) * chartW;
    const toY = (p: number) => PAD_T + (1 - (p - pMin) / pRange) * chartH;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = PAD_T + (i / gridLines) * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD_L, y);
      ctx.lineTo(W - PAD_R, y);
      ctx.stroke();

      const val = pMax - (i / gridLines) * pRange;
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(
        mode === "percent"
          ? `${val >= 0 ? "+" : ""}${val.toFixed(1)}%`
          : `$${val.toFixed(0)}`,
        PAD_L - 8,
        y + 4
      );
    }

    if (mode === "percent") {
      const zeroY = toY(0);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(PAD_L, zeroY);
      ctx.lineTo(W - PAD_R, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const allTimestamps = datasets
      .flatMap((d) => d.points.map((p) => p.t))
      .sort((a, b) => a - b);
    const timeLabels = 6;
    const step = Math.max(1, Math.floor(allTimestamps.length / timeLabels));
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";
    ctx.font = "11px Inter, sans-serif";
    for (let i = 0; i < allTimestamps.length; i += step) {
      const t = allTimestamps[i];
      const x = toX(t);
      const date = new Date(t);
      const label =
        range === "1m" || range === "3m"
          ? `${date.getDate()}/${date.getMonth() + 1}`
          : `${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
      ctx.fillText(label, x, H - PAD_B + 20);
    }

    for (const d of datasets) {
      if (d.points.length === 0) continue;
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.beginPath();
      d.points.forEach((pt, i) => {
        const x = toX(pt.t);
        const y = toY(pt.p);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }, [raw, mode, selected, range]);

  useEffect(() => {
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);

  const toggleMetal = (symbol: string) => {
    setSelected((prev) =>
      prev.includes(symbol)
        ? prev.length > 1
          ? prev.filter((s) => s !== symbol)
          : prev
        : [...prev, symbol]
    );
  };

  const getSummary = () => {
    if (!raw?.series) return [];
    return metals.filter((m) => selected.includes(m.symbol)).map((m) => {
      const points = raw.series[m.symbol] || [];
      if (points.length < 2)
        return { ...m, change: 0, startPrice: 0, endPrice: 0 };
      const startPrice = points[0].p;
      const endPrice = points[points.length - 1].p;
      const change = ((endPrice - startPrice) / startPrice) * 100;
      return { ...m, change, startPrice, endPrice };
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Metal toggles */}
        <div className="flex gap-2">
          {metals.map((m) => (
            <button
              key={m.symbol}
              onClick={() => toggleMetal(m.symbol)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-sm border transition-all ${
                selected.includes(m.symbol)
                  ? "border-transparent text-[#0B0F17]"
                  : "border-border text-content-3 hover:text-content-1 bg-surface-1"
              }`}
              style={
                selected.includes(m.symbol)
                  ? { backgroundColor: m.color }
                  : undefined
              }
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Mode toggle */}
        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          <button
            onClick={() => setMode("percent")}
            className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
              mode === "percent"
                ? "bg-brand-gold text-[#0B0F17]"
                : "text-content-3 hover:text-content-1"
            }`}
          >
            {t("percentChange")}
          </button>
          <button
            onClick={() => setMode("absolute")}
            className={`px-3 py-1.5 text-sm font-semibold transition-colors ${
              mode === "absolute"
                ? "bg-brand-gold text-[#0B0F17]"
                : "text-content-3 hover:text-content-1"
            }`}
          >
            {t("priceUSD")}
          </button>
        </div>

        {/* Range selector */}
        <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                range === r.value
                  ? "bg-brand-gold text-[#0B0F17]"
                  : "text-content-3 hover:text-content-1"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-4 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-1/80 z-10 rounded-DEFAULT">
            <div className="w-6 h-6 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 380 }}
        />
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-3">
          {metals.filter((m) => selected.includes(m.symbol)).map((m) => (
            <div key={m.symbol} className="flex items-center gap-2 text-xs text-content-2">
              <span
                className="w-3 h-0.5 rounded"
                style={{ backgroundColor: m.color }}
              />
              {m.name} ({m.symbol})
            </div>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {getSummary().map((s) => (
          <div
            key={s.symbol}
            className="bg-surface-1 border border-border rounded-DEFAULT p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm font-semibold text-content-0">
                {s.name}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-content-3">
                ${s.startPrice.toFixed(2)} → ${s.endPrice.toFixed(2)}
              </span>
              <span
                className={`text-lg font-bold tabular-nums ${
                  s.change >= 0 ? "text-signal-up" : "text-signal-down"
                }`}
              >
                {s.change >= 0 ? "+" : ""}
                {s.change.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
