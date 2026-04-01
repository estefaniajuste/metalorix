"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePrices } from "@/lib/hooks/use-prices";

interface Holding {
  id: string;
  symbol: string;
  quantity: number;
  unit: "g" | "oz";
  purchasePrice: number;
  purchaseDate: string;
  notes: string;
}

const METALS = [
  { symbol: "XAU", labelKey: "XAU" as const },
  { symbol: "XAG", labelKey: "XAG" as const },
  { symbol: "XPT", labelKey: "XPT" as const },
  { symbol: "XPD", labelKey: "XPD" as const },
] as const;

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
  XPD: "#CED0CE",
};

const OZ_TO_GRAMS = 31.1035;

function loadHoldings(): Holding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("mtx-portfolio");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHoldings(holdings: Holding[]) {
  try {
    localStorage.setItem("mtx-portfolio", JSON.stringify(holdings));
  } catch { /* quota exceeded — silent */ }
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function PortfolioTracker() {
  const t = useTranslations("portfolio");
  const tn = useTranslations("metalNames");
  const { prices, lastUpdate } = usePrices();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formSymbol, setFormSymbol] = useState("XAU");
  const [formQty, setFormQty] = useState("");
  const [formUnit, setFormUnit] = useState<"g" | "oz">("oz");
  const [formPrice, setFormPrice] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formNotes, setFormNotes] = useState("");

  useEffect(() => {
    setHoldings(loadHoldings());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveHoldings(holdings);
  }, [holdings, mounted]);

  const spotPriceMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (prices) {
      for (const p of prices) map[p.symbol] = p.price;
    }
    return map;
  }, [prices]);

  const resetForm = useCallback(() => {
    setFormSymbol("XAU");
    setFormQty("");
    setFormUnit("oz");
    setFormPrice("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormNotes("");
    setEditId(null);
    setShowForm(false);
  }, []);

  const handleSave = useCallback(() => {
    const qty = parseFloat(formQty);
    const price = parseFloat(formPrice);
    if (!qty || qty <= 0 || !price || price <= 0) return;

    const holding: Holding = {
      id: editId || genId(),
      symbol: formSymbol,
      quantity: qty,
      unit: formUnit,
      purchasePrice: price,
      purchaseDate: formDate,
      notes: formNotes,
    };

    setHoldings((prev) =>
      editId ? prev.map((h) => (h.id === editId ? holding : h)) : [...prev, holding]
    );
    resetForm();
  }, [formSymbol, formQty, formUnit, formPrice, formDate, formNotes, editId, resetForm]);

  const handleEdit = useCallback((h: Holding) => {
    setFormSymbol(h.symbol);
    setFormQty(h.quantity.toString());
    setFormUnit(h.unit);
    setFormPrice(h.purchasePrice.toString());
    setFormDate(h.purchaseDate);
    setFormNotes(h.notes);
    setEditId(h.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const getOzQty = (h: Holding) => (h.unit === "oz" ? h.quantity : h.quantity / OZ_TO_GRAMS);
  const getCost = (h: Holding) => getOzQty(h) * h.purchasePrice;
  const getValue = (h: Holding) => getOzQty(h) * (spotPriceMap[h.symbol] || 0);
  const getPnl = (h: Holding) => getValue(h) - getCost(h);
  const getPnlPct = (h: Holding) => {
    const cost = getCost(h);
    return cost > 0 ? ((getValue(h) - cost) / cost) * 100 : 0;
  };

  const totalCost = holdings.reduce((s, h) => s + getCost(h), 0);
  const totalValue = holdings.reduce((s, h) => s + getValue(h), 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  const allocationByMetal = useMemo(() => {
    const map: Record<string, number> = {};
    for (const h of holdings) {
      map[h.symbol] = (map[h.symbol] || 0) + getValue(h);
    }
    return map;
  }, [holdings, spotPriceMap]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

  if (!mounted) {
    return <div className="h-[500px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      {holdings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label={t("totalValue")} value={fmt(totalValue)} />
          <SummaryCard label={t("totalCost")} value={fmt(totalCost)} />
          <SummaryCard
            label={t("totalPnl")}
            value={fmt(totalPnl)}
            sub={fmtPct(totalPnlPct)}
            positive={totalPnl >= 0}
          />
          <SummaryCard label={t("holdingsTitle")} value={holdings.length.toString()} />
        </div>
      )}

      {/* Allocation bar */}
      {holdings.length > 0 && totalValue > 0 && (
        <div className="p-4 rounded-DEFAULT border border-border bg-surface-1">
          <h3 className="text-xs font-semibold text-content-2 uppercase tracking-wider mb-3">
            {t("allocation")}
          </h3>
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
            {Object.entries(allocationByMetal).map(([sym, val]) => (
              <div
                key={sym}
                style={{
                  width: `${(val / totalValue) * 100}%`,
                  backgroundColor: METAL_COLORS[sym] || "#666",
                }}
                className="rounded-full min-w-[4px] transition-all duration-500"
                title={`${tn(sym as any)} — ${((val / totalValue) * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {Object.entries(allocationByMetal).map(([sym, val]) => (
              <div key={sym} className="flex items-center gap-1.5 text-xs text-content-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: METAL_COLORS[sym] }}
                />
                {tn(sym as any)} {((val / totalValue) * 100).toFixed(1)}%
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holdings list */}
      {holdings.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-content-1">{t("holdingsTitle")}</h3>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors"
            >
              + {t("addHolding")}
            </button>
          </div>
          {holdings.map((h) => (
            <HoldingRow
              key={h.id}
              holding={h}
              spotPrice={spotPriceMap[h.symbol] || 0}
              value={getValue(h)}
              pnl={getPnl(h)}
              pnlPct={getPnlPct(h)}
              fmt={fmt}
              fmtPct={fmtPct}
              metalName={tn(h.symbol as any)}
              onEdit={() => handleEdit(h)}
              onDelete={() => handleDelete(h.id)}
              editLabel={t("editHolding")}
              deleteLabel={t("deleteHolding")}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 rounded-DEFAULT border border-dashed border-border bg-surface-1/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-gold/10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D6B35A" strokeWidth="1.5" strokeLinecap="round">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <path d="M2 10h2M20 10h2M2 14h2M20 14h2" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-content-0 mb-2">{t("emptyStateTitle")}</h3>
          <p className="text-sm text-content-3 max-w-md mx-auto mb-6">{t("emptyStateDesc")}</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-gold text-[#1a1a1a] font-semibold text-sm hover:brightness-110 transition-all"
          >
            + {t("addHolding")}
          </button>
        </div>
      )}

      {/* Add/Edit form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-surface-1 border border-border rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-content-0 mb-4">
              {editId ? t("editHolding") : t("addHolding")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-content-2 mb-1 block">{t("metal")}</label>
                <select
                  value={formSymbol}
                  onChange={(e) => setFormSymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-content-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                >
                  {METALS.map((m) => (
                    <option key={m.symbol} value={m.symbol}>
                      {tn(m.labelKey)} ({m.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-content-2 mb-1 block">{t("quantity")}</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-content-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-content-2 mb-1 block">{t("unit")}</label>
                  <select
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value as "g" | "oz")}
                    className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-content-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  >
                    <option value="oz">{t("troyOz")}</option>
                    <option value="g">{t("grams")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-content-2 mb-1 block">
                  {t("purchasePricePerUnit", { unit: formUnit === "oz" ? t("pricePerOz") : t("pricePerGram") })} (USD)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-content-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-content-2 mb-1 block">{t("purchaseDate")}</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-content-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-content-2 mb-1 block">{t("notes")}</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  className="w-full px-3 py-2 rounded-lg bg-surface-2 border border-border text-sm text-content-0 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-lg bg-brand-gold text-[#1a1a1a] font-semibold text-sm hover:brightness-110 transition-all"
                >
                  {t("save")}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-lg bg-surface-2 border border-border text-content-1 font-medium text-sm hover:bg-surface-3 transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data privacy notice */}
      <p className="text-center text-[11px] text-content-3">
        <svg className="inline mr-1 -mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {t("dataStoredLocally")}
      </p>

      {lastUpdate && (
        <p className="text-center text-[11px] text-content-3">
          {t("lastUpdated", {
            time: lastUpdate.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
          })}
        </p>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
}) {
  return (
    <div className="p-4 rounded-DEFAULT border border-border bg-surface-1">
      <p className="text-[11px] font-medium text-content-3 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-content-0">{value}</p>
      {sub && (
        <p className={`text-xs font-semibold mt-0.5 ${positive ? "text-signal-up" : "text-signal-down"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function HoldingRow({
  holding,
  spotPrice,
  value,
  pnl,
  pnlPct,
  fmt,
  fmtPct,
  metalName,
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  holding: Holding;
  spotPrice: number;
  value: number;
  pnl: number;
  pnlPct: number;
  fmt: (n: number) => string;
  fmtPct: (n: number) => string;
  metalName: string;
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}) {
  const positive = pnl >= 0;
  const cost = (holding.unit === "oz" ? holding.quantity : holding.quantity / OZ_TO_GRAMS) * holding.purchasePrice;

  return (
    <div className="p-4 rounded-DEFAULT border border-border bg-surface-1 hover:border-brand-gold/20 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: `${METAL_COLORS[holding.symbol]}20`, color: METAL_COLORS[holding.symbol] }}
          >
            {holding.symbol.slice(1)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-content-0 truncate">
              {metalName}
              {holding.notes && (
                <span className="ml-2 text-xs font-normal text-content-3">{holding.notes}</span>
              )}
            </p>
            <p className="text-xs text-content-3">
              {holding.quantity} {holding.unit === "oz" ? "oz" : "g"} @ ${holding.purchasePrice.toLocaleString()}/{holding.unit === "oz" ? "oz" : "g"}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-content-0">{fmt(value)}</p>
          <p className={`text-xs font-semibold ${positive ? "text-signal-up" : "text-signal-down"}`}>
            {fmt(pnl)} ({fmtPct(pnlPct)})
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex gap-4 text-[11px] text-content-3">
          <span>Spot: ${spotPrice.toLocaleString()}/oz</span>
          <span>{holding.purchaseDate}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-[11px] text-content-3 hover:text-brand-gold transition-colors">
            {editLabel}
          </button>
          <button onClick={onDelete} className="text-[11px] text-content-3 hover:text-signal-down transition-colors">
            {deleteLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
