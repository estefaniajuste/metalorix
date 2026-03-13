"use client";

import { useEffect, useState } from "react";
import type { MetalSymbol } from "@/lib/providers/metals";

interface SpotData {
  price: number;
  change: number;
  changePct: number;
}

function formatPrice(val: number) {
  return val >= 100
    ? val.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : val.toFixed(2);
}

export function ProductSpotPrice({
  symbol,
  fineWeightOz,
  metalName,
}: {
  symbol: MetalSymbol;
  fineWeightOz: number;
  metalName: string;
}) {
  const [spot, setSpot] = useState<SpotData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) return;
        const json = await res.json();
        const metal = json.prices?.find(
          (p: { symbol: string }) => p.symbol === symbol
        );
        if (metal && mounted) {
          setSpot({
            price: metal.price,
            change: metal.change,
            changePct: metal.changePct,
          });
        }
      } catch {
        /* silent */
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [symbol]);

  const metalValue = spot ? spot.price * fineWeightOz : null;
  const isUp = spot ? spot.change >= 0 : true;

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      <h3 className="text-base font-semibold text-content-0 mb-4">
        Precio spot del {metalName}
      </h3>

      {loading ? (
        <div className="space-y-3">
          <div className="h-8 w-32 bg-surface-2 rounded-xs animate-pulse" />
          <div className="h-4 w-24 bg-surface-2 rounded-xs animate-pulse" />
        </div>
      ) : spot ? (
        <>
          <div className="text-[28px] font-bold text-content-0 tracking-tight tabular-nums leading-none mb-1">
            ${formatPrice(spot.price)}
            <span className="text-sm font-normal text-content-3 ml-1.5">
              /oz
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 text-sm font-medium tabular-nums mb-5 ${
              isUp ? "text-signal-up" : "text-signal-down"
            }`}
          >
            <span className="text-xs">{isUp ? "▲" : "▼"}</span>
            {isUp ? "+" : ""}
            {spot.changePct}% (24h)
          </div>

          {metalValue !== null && (
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-content-3 mb-1">
                Valor del metal contenido
              </div>
              <div className="text-xl font-bold text-content-0 tabular-nums">
                ${formatPrice(metalValue)}
              </div>
              {fineWeightOz !== 1 && (
                <div className="text-xs text-content-3 mt-0.5">
                  {fineWeightOz.toFixed(3)} oz × ${formatPrice(spot.price)}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-content-3">No se pudo cargar el precio.</p>
      )}

      <p className="text-[11px] text-content-3 mt-4 leading-relaxed">
        Precio spot indicativo. Puede diferir del precio final de compra
        (prima + gastos del dealer).
      </p>
    </div>
  );
}
