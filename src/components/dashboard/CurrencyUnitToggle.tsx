"use client";

import { useLocale } from "next-intl";
import {
  type Currency,
  type PriceUnit,
  CURRENCY_SYMBOLS,
  getLocaleCurrency,
} from "@/lib/utils/units";

interface CurrencyUnitToggleProps {
  currency: Currency;
  unit: PriceUnit;
  onCurrencyChange: (c: Currency) => void;
  onUnitChange: (u: PriceUnit) => void;
}

export function CurrencyUnitToggle({
  currency,
  unit,
  onCurrencyChange,
  onUnitChange,
}: CurrencyUnitToggleProps) {
  const locale = useLocale();
  const { toggleOptions } = getLocaleCurrency(locale);

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
        {toggleOptions.map((c) => (
          <button
            key={c}
            onClick={() => onCurrencyChange(c)}
            className={`px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
              currency === c
                ? "bg-brand-gold text-[#0B0F17]"
                : "text-content-3 hover:text-content-1"
            }`}
          >
            {CURRENCY_SYMBOLS[c]} {c}
          </button>
        ))}
      </div>

      <div className="flex bg-surface-1 border border-border rounded-sm overflow-hidden">
        {(["oz", "g", "kg"] as PriceUnit[]).map((u) => (
          <button
            key={u}
            onClick={() => onUnitChange(u)}
            className={`px-2.5 py-1.5 text-[11px] font-semibold transition-colors ${
              unit === u
                ? "bg-brand-gold text-[#0B0F17]"
                : "text-content-3 hover:text-content-1"
            }`}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}
