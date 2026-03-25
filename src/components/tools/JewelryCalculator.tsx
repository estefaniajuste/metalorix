"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

const PURITIES = [
  { label: "24k (999‰ — 99.9%)", karat: 24, purity: 0.999, metal: "gold" },
  { label: "22k (917‰ — 91.7%)", karat: 22, purity: 0.917, metal: "gold" },
  { label: "18k (750‰ — 75.0%)", karat: 18, purity: 0.750, metal: "gold" },
  { label: "14k (585‰ — 58.5%)", karat: 14, purity: 0.585, metal: "gold" },
  { label: "10k (417‰ — 41.7%)", karat: 10, purity: 0.417, metal: "gold" },
  { label: "9k (375‰ — 37.5%)", karat: 9, purity: 0.375, metal: "gold" },
  { label: "999 (99.9%)", karat: 999, purity: 0.999, metal: "silver" },
  { label: "925 (92.5%)", karat: 925, purity: 0.925, metal: "silver" },
  { label: "800 (80.0%)", karat: 800, purity: 0.800, metal: "silver" },
  { label: "950 (95.0%)", karat: 950, purity: 0.950, metal: "platinum" },
  { label: "900 (90.0%)", karat: 900, purity: 0.900, metal: "platinum" },
  { label: "850 (85.0%)", karat: 850, purity: 0.850, metal: "platinum" },
];

const METAL_OPTIONS = [
  { value: "gold", symbol: "XAU", label: "Oro / Gold", color: "#D6B35A" },
  { value: "silver", symbol: "XAG", label: "Plata / Silver", color: "#A7B0BE" },
  { value: "platinum", symbol: "XPT", label: "Platino / Platinum", color: "#8B9DC3" },
];

const TROY_OZ_TO_GRAM = 31.1035;

interface Piece {
  id: number;
  grams: string;
  purityIndex: number;
}

interface Result {
  metalName: string;
  pricePerTroyOz: number;
  pricePerGram: number;
  pieces: {
    grams: number;
    purity: number;
    purityLabel: string;
    pureGrams: number;
    valueUsd: number;
    valueEur: number;
  }[];
  totalPureGrams: number;
  totalValueUsd: number;
  totalValueEur: number;
}

export function JewelryCalculator() {
  const t = useTranslations("jewelryCalc");
  const [metal, setMetal] = useState("gold");
  const [pieces, setPieces] = useState<Piece[]>([{ id: 1, grams: "", purityIndex: 2 }]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const metalPurities = PURITIES.filter((p) => p.metal === metal);

  const addPiece = () => {
    setPieces((prev) => [...prev, { id: Date.now(), grams: "", purityIndex: 0 }]);
  };

  const removePiece = (id: number) => {
    setPieces((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePiece = (id: number, field: "grams" | "purityIndex", value: string | number) => {
    setPieces((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  };

  const calculate = useCallback(async () => {
    const validPieces = pieces.filter((p) => parseFloat(p.grams) > 0);
    if (validPieces.length === 0) {
      setError(t("errorNoWeight"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      const sym = METAL_OPTIONS.find((m) => m.value === metal)?.symbol ?? "XAU";
      const res = await fetch(`/api/prices?symbols=${sym}`);
      const data = await res.json();
      const priceUsd: number = data.prices?.[sym]?.price ?? data[sym]?.price ?? 0;
      if (!priceUsd) throw new Error("no_price");

      // EUR conversion (approximate, could also fetch from /api/prices)
      const eurRate = 0.92;
      const pricePerGram = priceUsd / TROY_OZ_TO_GRAM;

      const pieceResults = validPieces.map((p) => {
        const pur = metalPurities[p.purityIndex] ?? metalPurities[0];
        const grams = parseFloat(p.grams);
        const pureGrams = grams * pur.purity;
        const valueUsd = pureGrams * pricePerGram;
        return {
          grams,
          purity: pur.purity,
          purityLabel: pur.label,
          pureGrams,
          valueUsd,
          valueEur: valueUsd * eurRate,
        };
      });

      const totalPureGrams = pieceResults.reduce((s, r) => s + r.pureGrams, 0);
      const totalValueUsd = pieceResults.reduce((s, r) => s + r.valueUsd, 0);

      setResult({
        metalName: METAL_OPTIONS.find((m) => m.value === metal)?.label ?? metal,
        pricePerTroyOz: priceUsd,
        pricePerGram,
        pieces: pieceResults,
        totalPureGrams,
        totalValueUsd,
        totalValueEur: totalValueUsd * eurRate,
      });
    } catch {
      setError(t("errorFetch"));
    } finally {
      setLoading(false);
    }
  }, [pieces, metal, metalPurities, t]);

  const fmt = (n: number, decimals = 2) =>
    n.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <div className="space-y-6">
      {/* Metal selector */}
      <div>
        <label className="block text-sm font-semibold text-content-1 mb-3">{t("selectMetal")}</label>
        <div className="flex flex-wrap gap-2">
          {METAL_OPTIONS.map((m) => (
            <button
              key={m.value}
              onClick={() => {
                setMetal(m.value);
                setPieces([{ id: 1, grams: "", purityIndex: 0 }]);
                setResult(null);
              }}
              className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                metal === m.value
                  ? "border-brand-gold bg-[rgba(214,179,90,0.12)] text-brand-gold"
                  : "border-border bg-surface-1 text-content-2 hover:border-brand-gold/40"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pieces */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-content-1">{t("yourPieces")}</label>
        {pieces.map((piece, idx) => (
          <div key={piece.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-1 border border-border flex-wrap">
            <span className="text-xs text-content-3 w-5 shrink-0">#{idx + 1}</span>
            <div className="flex-1 min-w-[120px]">
              <input
                type="number"
                min="0"
                step="0.1"
                value={piece.grams}
                onChange={(e) => updatePiece(piece.id, "grams", e.target.value)}
                placeholder={t("gramsPlaceholder")}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-content-0 placeholder:text-content-3 focus:outline-none focus:border-brand-gold/50"
              />
            </div>
            <div className="flex-1 min-w-[160px]">
              <select
                value={piece.purityIndex}
                onChange={(e) => updatePiece(piece.id, "purityIndex", parseInt(e.target.value))}
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-content-0 focus:outline-none focus:border-brand-gold/50"
              >
                {metalPurities.map((p, i) => (
                  <option key={i} value={i}>{p.label}</option>
                ))}
              </select>
            </div>
            {pieces.length > 1 && (
              <button
                onClick={() => removePiece(piece.id)}
                className="text-content-3 hover:text-signal-down transition-colors p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addPiece}
          className="flex items-center gap-2 text-sm text-content-2 hover:text-brand-gold transition-colors py-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {t("addPiece")}
        </button>
      </div>

      {error && (
        <p className="text-sm text-signal-down bg-[rgba(248,113,113,0.08)] border border-[rgba(248,113,113,0.2)] rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        onClick={calculate}
        disabled={loading}
        className="w-full py-3 px-6 bg-brand-gold text-[#0B0F17] font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {loading ? t("calculating") : t("calculateBtn")}
      </button>

      {result && (
        <div className="space-y-4 pt-2">
          {/* Price reference */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-1 border border-border text-xs text-content-3">
            <span>{t("spotPrice")} {result.metalName}</span>
            <span className="font-semibold text-content-1">
              ${fmt(result.pricePerTroyOz)} / {t("troyOz")} · ${fmt(result.pricePerGram, 3)} / g
            </span>
          </div>

          {/* Per piece breakdown */}
          {result.pieces.length > 1 && (
            <div className="space-y-2">
              {result.pieces.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-1 border border-border text-sm">
                  <span className="text-content-2">
                    #{i + 1} · {fmt(p.grams, 1)}g · {p.purityLabel.split(" ")[0]}
                    <span className="text-content-3 ml-1">({fmt(p.pureGrams, 2)}g {t("pure")})</span>
                  </span>
                  <span className="font-semibold text-content-0">${fmt(p.valueUsd)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total result */}
          <div className="p-5 rounded-lg border border-brand-gold/30 bg-[rgba(214,179,90,0.06)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-content-1">{t("totalValue")}</span>
              <span className="text-content-3 text-xs">{fmt(result.totalPureGrams, 2)}g {t("pureGold")}</span>
            </div>
            <div className="flex items-end gap-4 flex-wrap">
              <div>
                <div className="text-3xl font-extrabold text-brand-gold tracking-tight">
                  ${fmt(result.totalValueUsd)}
                </div>
                <div className="text-sm text-content-3 mt-0.5">≈ €{fmt(result.totalValueEur)}</div>
              </div>
            </div>
            <p className="text-[10px] text-content-3 mt-3 leading-relaxed">{t("disclaimer")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
