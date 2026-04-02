"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrices } from "@/lib/hooks/use-prices";

interface BtcData {
  price: number;
  changePct24h: number;
  marketCap: number;
  volume24h: number;
}

const GOLD_OZ_ABOVE_GROUND = 6_800_000_000;

function fmtPrice(n: number): string {
  if (n >= 1000)
    return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return "$" + n.toFixed(2);
}

function fmtBig(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

export function GoldBtcDashboard() {
  const t = useTranslations("comparisons");
  const { prices } = usePrices();
  const [btc, setBtc] = useState<BtcData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let active = true;
    const load = async () => {
      try {
        const r = await fetch("/api/btc-price");
        if (r.ok && active) setBtc(await r.json());
      } catch { /* ignore */ }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const gold = useMemo(() => prices?.find((p) => p.symbol === "XAU"), [prices]);

  if (!mounted) {
    return (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 mb-10 animate-shimmer h-[260px]" />
    );
  }

  const gp = gold?.price ?? 0;
  const bp = btc?.price ?? 0;
  const goldMCap = gp * GOLD_OZ_ABOVE_GROUND;
  const goldOzPerBtc = gp > 0 ? bp / gp : 0;
  const btcPerGoldOz = bp > 0 ? gp / bp : 0;

  const loading = !gold || !btc;

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <span className="w-2 h-2 rounded-full bg-signal-up animate-pulse" />
        <span className="text-xs font-semibold text-content-2 uppercase tracking-wider">
          {t("dashboard.liveTitle")}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-content-3 text-center py-8">{t("dashboard.loading")}</p>
      ) : (
        <>
          {/* Price cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Gold */}
            <div className="bg-surface-0 border border-border rounded-DEFAULT p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#D6B35A20", color: "#D6B35A" }}>
                  Au
                </span>
                <span className="text-sm font-semibold text-content-1">{t("goldLabel")}</span>
              </div>
              <p className="text-2xl font-extrabold text-content-0 tracking-tight mb-1">
                {fmtPrice(gp)}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded ${
                    (gold?.changePct ?? 0) >= 0
                      ? "text-signal-up bg-signal-up/10"
                      : "text-signal-down bg-signal-down/10"
                  }`}
                >
                  {(gold?.changePct ?? 0) >= 0 ? "+" : ""}
                  {gold?.changePct?.toFixed(2)}%
                </span>
                <span className="text-xs text-content-3">24h</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-content-3">
                <span>{t("dashboard.marketCap")}</span>
                <span className="text-content-1 font-medium">{fmtBig(goldMCap)}</span>
              </div>
            </div>

            {/* Bitcoin */}
            <div className="bg-surface-0 border border-border rounded-DEFAULT p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#F7931A20", color: "#F7931A" }}>
                  ₿
                </span>
                <span className="text-sm font-semibold text-content-1">{t("btcLabel")}</span>
              </div>
              <p className="text-2xl font-extrabold text-content-0 tracking-tight mb-1">
                {fmtPrice(bp)}
              </p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold px-2 py-0.5 rounded ${
                    btc!.changePct24h >= 0
                      ? "text-signal-up bg-signal-up/10"
                      : "text-signal-down bg-signal-down/10"
                  }`}
                >
                  {btc!.changePct24h >= 0 ? "+" : ""}
                  {btc!.changePct24h.toFixed(2)}%
                </span>
                <span className="text-xs text-content-3">24h</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-content-3">
                <span>{t("dashboard.marketCap")}</span>
                <span className="text-content-1 font-medium">
                  {btc!.marketCap > 0 ? fmtBig(btc!.marketCap) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Ratio section */}
          <div className="bg-surface-0 border border-border rounded-DEFAULT p-5">
            <h3 className="text-xs font-semibold text-content-2 uppercase tracking-wider mb-4">
              {t("dashboard.ratioTitle")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-content-3 mb-1">1 BTC =</p>
                <p className="text-xl font-bold text-content-0">
                  {goldOzPerBtc.toFixed(2)}{" "}
                  <span className="text-sm font-normal text-content-2">{t("dashboard.ozGold")}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-content-3 mb-1">1 oz Gold =</p>
                <p className="text-xl font-bold text-content-0">
                  {btcPerGoldOz.toFixed(6)}{" "}
                  <span className="text-sm font-normal text-content-2">BTC</span>
                </p>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-xs text-content-3 mb-2">
                <span>{t("dashboard.dominance")}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex bg-surface-2">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(5, (goldMCap / (goldMCap + (btc?.marketCap ?? 1))) * 100))}%`,
                    background: "#D6B35A",
                  }}
                />
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.max(5, ((btc?.marketCap ?? 0) / (goldMCap + (btc?.marketCap ?? 1))) * 100))}%`,
                    background: "#F7931A",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[11px] text-content-3">
                <span style={{ color: "#D6B35A" }}>{t("goldLabel")} ({((goldMCap / (goldMCap + (btc?.marketCap ?? 1))) * 100).toFixed(0)}%)</span>
                <span style={{ color: "#F7931A" }}>{t("btcLabel")} ({(((btc?.marketCap ?? 0) / (goldMCap + (btc?.marketCap ?? 1))) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
