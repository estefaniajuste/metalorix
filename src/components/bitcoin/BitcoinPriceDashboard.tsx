"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrices } from "@/lib/hooks/use-prices";

interface BtcData {
  price: number;
  change24h: number;
  changePct24h: number;
  marketCap: number;
  volume24h: number;
  updatedAt: string;
}

const GOLD_OZ_ABOVE_GROUND = 6_800_000_000;

function fmtPrice(n: number): string {
  if (n >= 1000)
    return (
      "$" +
      n.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  return "$" + n.toFixed(2);
}

function fmtBig(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString("en-US")}`;
}

export function BitcoinPriceDashboard() {
  const t = useTranslations("bitcoinPrice");
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
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const gold = useMemo(
    () => prices?.find((p) => p.symbol === "XAU"),
    [prices],
  );

  if (!mounted) {
    return (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 animate-shimmer h-[360px]" />
    );
  }

  const bp = btc?.price ?? 0;
  const gp = gold?.price ?? 0;
  const goldMCap = gp * GOLD_OZ_ABOVE_GROUND;
  const goldOzPerBtc = gp > 0 ? bp / gp : 0;

  const loading = !btc;

  return (
    <div className="space-y-6">
      {/* Main BTC price card */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-signal-up animate-pulse" />
          <span className="text-xs font-semibold text-content-2 uppercase tracking-wider">
            {t("liveTitle")}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-content-3 text-center py-8">
            {t("loading")}
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "#F7931A20", color: "#F7931A" }}
                >
                  ₿
                </div>
                <div>
                  <p className="text-xs text-content-3 mb-1">Bitcoin (BTC/USD)</p>
                  <p className="text-4xl font-extrabold text-content-0 tracking-tight">
                    {fmtPrice(bp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded ${
                    (btc?.changePct24h ?? 0) >= 0
                      ? "text-signal-up bg-signal-up/10"
                      : "text-signal-down bg-signal-down/10"
                  }`}
                >
                  {(btc?.changePct24h ?? 0) >= 0 ? "+" : ""}
                  {btc?.changePct24h?.toFixed(2)}%
                </span>
                <span className="text-xs text-content-3">24h</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatBox
                label={t("marketCap")}
                value={btc!.marketCap > 0 ? fmtBig(btc!.marketCap) : "—"}
              />
              <StatBox
                label={t("volume24h")}
                value={btc!.volume24h > 0 ? fmtBig(btc!.volume24h) : "—"}
              />
              <StatBox
                label={t("btcInGold")}
                value={`${goldOzPerBtc.toFixed(1)} oz`}
              />
              <StatBox label={t("supply")} value="21M" sub={t("maxSupply")} />
            </div>
          </>
        )}
      </div>

      {/* Gold vs BTC quick comparison */}
      {!loading && gold && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "#F7931A20", color: "#F7931A" }}
              >
                ₿
              </div>
              <span className="text-sm font-semibold text-content-1">
                Bitcoin
              </span>
            </div>
            <p className="text-2xl font-extrabold text-content-0 mb-2">
              {fmtPrice(bp)}
            </p>
            <div className="space-y-1.5 text-xs text-content-3">
              <div className="flex justify-between">
                <span>{t("marketCap")}</span>
                <span className="text-content-1 font-medium">
                  {btc!.marketCap > 0 ? fmtBig(btc!.marketCap) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("volatility")}</span>
                <span className="text-content-1 font-medium">{t("high")}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-5">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "#D6B35A20", color: "#D6B35A" }}
              >
                Au
              </div>
              <span className="text-sm font-semibold text-content-1">
                {t("goldLabel")}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-content-0 mb-2">
              {fmtPrice(gp)}
            </p>
            <div className="space-y-1.5 text-xs text-content-3">
              <div className="flex justify-between">
                <span>{t("marketCap")}</span>
                <span className="text-content-1 font-medium">
                  {fmtBig(goldMCap)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t("volatility")}</span>
                <span className="text-content-1 font-medium">{t("low")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="p-3 rounded-lg bg-surface-0 border border-border">
      <p className="text-[11px] text-content-3 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-sm font-bold text-content-0">{value}</p>
      {sub && <p className="text-[11px] text-content-3 mt-0.5">{sub}</p>}
    </div>
  );
}
