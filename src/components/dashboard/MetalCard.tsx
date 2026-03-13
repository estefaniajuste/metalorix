"use client";

import { METALS, type MetalSpot, type MetalSymbol } from "@/lib/providers/metals";

function formatPrice(val: number) {
  return val >= 100
    ? val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : val.toFixed(2);
}

function formatChange(val: number) {
  const sign = val >= 0 ? "+" : "";
  return (
    sign +
    (Math.abs(val) >= 100
      ? val.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : val.toFixed(2))
  );
}

interface MetalCardProps {
  spot: MetalSpot;
  active: boolean;
  onClick: () => void;
}

export function MetalCard({ spot, active, onClick }: MetalCardProps) {
  const metal = METALS[spot.symbol as MetalSymbol];
  const isUp = spot.change >= 0;

  const accentColors: Record<string, string> = {
    XAU: "border-t-brand-gold",
    XAG: "border-t-[#A7B0BE]",
    XPT: "border-t-[#8B9DC3]",
  };

  const iconColors: Record<string, string> = {
    XAU: "bg-[rgba(214,179,90,0.12)] text-brand-gold",
    XAG: "bg-[rgba(167,176,190,0.12)] text-[#A7B0BE]",
    XPT: "bg-[rgba(139,157,195,0.12)] text-[#8B9DC3]",
  };

  return (
    <button
      onClick={onClick}
      className={`
        text-left w-full bg-surface-1 border border-border rounded-DEFAULT p-6
        transition-all duration-250 ease-smooth cursor-pointer relative overflow-hidden
        border-t-[3px] ${active ? accentColors[spot.symbol] : "border-t-transparent"}
        ${active ? "border-brand-gold" : ""}
        hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-10 h-10 rounded-xs flex items-center justify-center font-bold text-sm ${iconColors[spot.symbol]}`}
          >
            {spot.symbol.slice(1)}
          </div>
          <div>
            <div className="text-base font-semibold text-content-0">
              {metal?.name}
            </div>
            <div className="text-[13px] text-content-3">
              {spot.symbol}/USD
            </div>
          </div>
        </div>
      </div>

      <div className="text-[32px] font-bold text-content-0 tracking-tight tabular-nums mb-1">
        ${formatPrice(spot.price)}
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-medium tabular-nums ${
          isUp ? "text-signal-up" : "text-signal-down"
        }`}
      >
        <span className="text-xs">{isUp ? "▲" : "▼"}</span>
        {formatChange(spot.change)} ({isUp ? "+" : ""}
        {spot.changePct}%)
      </div>
    </button>
  );
}
