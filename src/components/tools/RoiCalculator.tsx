"use client";

import { useState } from "react";

interface RoiResult {
  symbol: string;
  metalName: string;
  investmentDate: string;
  investmentAmount: number;
  priceAtInvestment: number;
  currentPrice: number;
  ouncesOwned: number;
  currentValue: number;
  profit: number;
  profitPct: number;
  annualizedReturn: number;
  yearsHeld: number;
}

const METALS = [
  { symbol: "XAU", name: "Oro", color: "#D6B35A" },
  { symbol: "XAG", name: "Plata", color: "#A7B0BE" },
  { symbol: "XPT", name: "Platino", color: "#8B9DC3" },
];

const PRESETS = [
  { label: "Hace 1 año", years: 1 },
  { label: "Hace 3 años", years: 3 },
  { label: "Hace 5 años", years: 5 },
  { label: "Hace 10 años", years: 10 },
];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatCurrency(val: number): string {
  return val.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function RoiCalculator() {
  const [symbol, setSymbol] = useState("XAU");
  const [amount, setAmount] = useState("10000");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 5);
    return formatDate(d);
  });
  const [result, setResult] = useState<RoiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function calculate() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `/api/roi?symbol=${symbol}&date=${date}&amount=${amount}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al calcular");
      } else {
        setResult(data);
      }
    } catch {
      setError("Error de conexión");
    }
    setLoading(false);
  }

  const isProfit = result ? result.profit >= 0 : true;

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
        <h2 className="text-lg font-bold text-content-0 mb-6">
          Simula tu inversión
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Metal */}
          <div>
            <label className="block text-xs font-medium text-content-3 mb-1.5">
              Metal
            </label>
            <div className="flex gap-2">
              {METALS.map((m) => (
                <button
                  key={m.symbol}
                  onClick={() => setSymbol(m.symbol)}
                  className={`flex-1 py-2.5 rounded-sm text-sm font-semibold transition-colors ${
                    symbol === m.symbol
                      ? "text-[#0B0F17]"
                      : "bg-surface-0 border border-border text-content-2 hover:border-border-hover"
                  }`}
                  style={
                    symbol === m.symbol
                      ? { backgroundColor: m.color }
                      : undefined
                  }
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-content-3 mb-1.5">
              Cantidad invertida (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-3 text-sm">
                $
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-0 border border-border rounded-sm pl-7 pr-4 py-2.5 text-sm text-content-0 focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-content-3 mb-1.5">
              Fecha de inversión
            </label>
            <input
              type="date"
              value={date}
              max={formatDate(new Date())}
              min="2000-01-01"
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-0 border border-border rounded-sm px-4 py-2.5 text-sm text-content-0 focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>
        </div>

        {/* Presets */}
        <div className="flex gap-2 flex-wrap mb-6">
          {PRESETS.map((p) => {
            const d = new Date();
            d.setFullYear(d.getFullYear() - p.years);
            const presetDate = formatDate(d);
            return (
              <button
                key={p.label}
                onClick={() => setDate(presetDate)}
                className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                  date === presetDate
                    ? "bg-brand-gold text-[#0B0F17]"
                    : "bg-surface-0 border border-border text-content-2 hover:border-border-hover"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Calculate */}
        <button
          onClick={calculate}
          disabled={loading}
          className="w-full sm:w-auto bg-brand-gold text-[#0B0F17] font-semibold text-sm px-8 py-3 rounded-sm hover:brightness-110 transition-all disabled:opacity-50"
        >
          {loading ? "Calculando..." : "Calcular rentabilidad"}
        </button>

        {error && (
          <p className="text-sm text-signal-down mt-3">{error}</p>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 sm:p-8">
          <h3 className="text-lg font-bold text-content-0 mb-6">
            Resultado de tu inversión en {result.metalName}
          </h3>

          {/* Main result */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface-0 border border-border rounded-sm p-5 text-center">
              <div className="text-xs text-content-3 font-medium mb-1">
                Valor actual de tu inversión
              </div>
              <div
                className={`text-3xl font-extrabold tabular-nums ${
                  isProfit ? "text-signal-up" : "text-signal-down"
                }`}
              >
                ${formatCurrency(result.currentValue)}
              </div>
              <div className="text-xs text-content-3 mt-1">
                Invertiste ${formatCurrency(result.investmentAmount)}
              </div>
            </div>

            <div className="bg-surface-0 border border-border rounded-sm p-5 text-center">
              <div className="text-xs text-content-3 font-medium mb-1">
                {isProfit ? "Ganancia" : "Pérdida"} total
              </div>
              <div
                className={`text-3xl font-extrabold tabular-nums ${
                  isProfit ? "text-signal-up" : "text-signal-down"
                }`}
              >
                {isProfit ? "+" : ""}${formatCurrency(result.profit)}
              </div>
              <div
                className={`text-sm font-semibold mt-1 ${
                  isProfit ? "text-signal-up" : "text-signal-down"
                }`}
              >
                {isProfit ? "+" : ""}
                {result.profitPct.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Precio al invertir",
                value: `$${formatCurrency(result.priceAtInvestment)}`,
              },
              {
                label: "Precio actual",
                value: `$${formatCurrency(result.currentPrice)}`,
              },
              {
                label: "Onzas adquiridas",
                value: result.ouncesOwned.toFixed(4),
              },
              {
                label: "Tiempo invertido",
                value:
                  result.yearsHeld >= 1
                    ? `${result.yearsHeld.toFixed(1)} años`
                    : `${Math.round(result.yearsHeld * 12)} meses`,
              },
              {
                label: "Retorno anualizado",
                value: `${result.annualizedReturn >= 0 ? "+" : ""}${result.annualizedReturn.toFixed(2)}%`,
                color: result.annualizedReturn >= 0,
              },
              {
                label: "Revalorización del metal",
                value: `${result.profitPct >= 0 ? "+" : ""}${result.profitPct.toFixed(1)}%`,
                color: result.profitPct >= 0,
              },
              {
                label: "Equivalente mensual",
                value:
                  result.yearsHeld > 0
                    ? `$${formatCurrency(result.profit / (result.yearsHeld * 12))}/mes`
                    : "—",
              },
              {
                label: "Metal",
                value: `${result.metalName} (${result.symbol})`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-0 border border-border rounded-sm p-3"
              >
                <div className="text-[11px] text-content-3 font-medium mb-0.5">
                  {stat.label}
                </div>
                <div
                  className={`text-sm font-bold tabular-nums ${
                    "color" in stat
                      ? stat.color
                        ? "text-signal-up"
                        : "text-signal-down"
                      : "text-content-0"
                  }`}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
