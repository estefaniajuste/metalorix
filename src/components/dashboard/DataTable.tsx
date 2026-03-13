"use client";

import type { HistoryResult } from "@/lib/providers/metals";

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

interface DataTableProps {
  history: HistoryResult | null;
  range: string;
}

export function DataTable({ history, range }: DataTableProps) {
  if (!history || !history.data.length) {
    return (
      <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
        <div className="text-center text-content-3 py-12">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const points = history.data.slice(-10).reverse();

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
      <table className="w-full border-collapse text-sm" aria-label="Datos de precios recientes">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider bg-surface-2 border-b border-border">
              Hora
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider bg-surface-2 border-b border-border">
              Precio (USD)
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider bg-surface-2 border-b border-border">
              Cambio
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider bg-surface-2 border-b border-border">
              % Cambio
            </th>
          </tr>
        </thead>
        <tbody>
          {points.map((d, i) => {
            const prev = i < points.length - 1 ? points[i + 1] : d;
            const chg = d.price - prev.price;
            const chgPct = prev.price ? (chg / prev.price) * 100 : 0;
            const cls = chg >= 0 ? "text-signal-up" : "text-signal-down";
            const dt = new Date(d.timestamp);
            const timeStr =
              range === "1D"
                ? dt.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : dt.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  });

            return (
              <tr
                key={d.timestamp}
                className="hover:bg-surface-2 transition-colors"
              >
                <td className="px-4 py-2.5 border-b border-border text-content-1 tabular-nums">
                  {timeStr}
                </td>
                <td className="px-4 py-2.5 border-b border-border text-content-1 tabular-nums">
                  ${formatPrice(d.price)}
                </td>
                <td
                  className={`px-4 py-2.5 border-b border-border tabular-nums ${cls}`}
                >
                  {formatChange(chg)}
                </td>
                <td
                  className={`px-4 py-2.5 border-b border-border tabular-nums ${cls}`}
                >
                  {chg >= 0 ? "+" : ""}
                  {chgPct.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
