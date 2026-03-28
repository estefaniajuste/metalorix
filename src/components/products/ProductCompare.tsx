"use client";

import { useTranslations } from "next-intl";
import type { Product } from "@/lib/data/products";

interface ProductCompareProps {
  products: Product[];
  onRemove: (slug: string) => void;
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ProductCompare({ products, onRemove }: ProductCompareProps) {
  const tp = useTranslations("products");
  const tf = useTranslations("productFilter");

  const rows: { label: string; getValue: (p: Product) => string }[] = [
    { label: tp("specType"), getValue: (p) => p.type === "moneda" ? tp("typeCoin") : tp("typeBar") },
    { label: tp("specMetal"), getValue: (p) => p.metal === "oro" ? tp("metalGold") : tp("metalSilver") },
    { label: tp("specCountry"), getValue: (p) => p.country },
    { label: tp("specManufacturer"), getValue: (p) => p.mint },
    { label: tp("specPurity"), getValue: (p) => p.purityLabel },
    { label: tp("specFineWeight"), getValue: (p) => `${p.fineWeightOz} oz troy` },
    { label: tp("specGrossWeight"), getValue: (p) => `${p.grossWeightG} g` },
    { label: tp("specPremium"), getValue: (p) => p.premiumRange },
    { label: tp("specLiquidity"), getValue: (p) => p.liquidity },
    { label: tp("vatExempt"), getValue: (p) => p.investmentGold ? "✓" : "—" },
  ];

  const allSame = (getValue: (p: Product) => string) => {
    const vals = products.map(getValue);
    return vals.every((v) => v === vals[0]);
  };

  return (
    <div className="mt-10 bg-surface-1 border border-border rounded-DEFAULT overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-lg font-semibold text-content-0">{tf("compareTitle")}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3 text-content-3 font-medium w-40 min-w-[140px]" />
              {products.map((p) => (
                <th key={p.slug} className="text-left px-6 py-3 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: p.metal === "oro" ? "#D6B35A" : "#A7B0BE" }}
                    />
                    <span className="font-semibold text-content-0">{p.shortName}</span>
                    <button
                      onClick={() => onRemove(p.slug)}
                      className="ml-auto text-content-3 hover:text-signal-down transition-colors"
                      aria-label={`Remove ${p.shortName}`}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const same = allSame(row.getValue);
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-surface-0/50" : ""}>
                  <td className="px-6 py-3 text-content-3 font-medium whitespace-nowrap">
                    {row.label}
                  </td>
                  {products.map((p) => (
                    <td
                      key={p.slug}
                      className={`px-6 py-3 ${same ? "text-content-2" : "text-content-0 font-medium"}`}
                    >
                      {row.getValue(p)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
