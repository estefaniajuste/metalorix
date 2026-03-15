"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  TAX_BY_COUNTRY,
  getDefaultCountryForLocale,
  getCountryTax,
  type CountryTaxInfo,
} from "@/lib/data/tax-by-country";

function TaxIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-brand-gold"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-signal-up flex-shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function getLocalizedName(country: CountryTaxInfo, locale: string): string {
  return country.name[locale] ?? country.name.en ?? country.code;
}

function getLocalizedNote(
  notes: Record<string, string>,
  locale: string,
): string {
  return notes[locale] ?? notes.en ?? "";
}

export function TaxByCountrySelector({
  isInvestmentGold,
  metal,
}: {
  isInvestmentGold: boolean;
  metal: "oro" | "plata";
}) {
  const locale = useLocale();
  const t = useTranslations("products");
  const defaultCode = getDefaultCountryForLocale(locale);
  const [selectedCode, setSelectedCode] = useState(defaultCode);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const selected = getCountryTax(selectedCode) ?? TAX_BY_COUNTRY[0];

  const isGold = metal === "oro";
  const vatNote = isGold
    ? getLocalizedNote(selected.goldNote, locale)
    : getLocalizedNote(selected.silverNote, locale);

  const filtered = filter.trim()
    ? TAX_BY_COUNTRY.filter((c) => {
        const name = getLocalizedName(c, locale).toLowerCase();
        const q = filter.toLowerCase();
        return name.includes(q) || c.code.toLowerCase().includes(q);
      })
    : TAX_BY_COUNTRY;

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <TaxIcon />
        <h3 className="text-base font-semibold text-content-0">
          {t("taxTitle")}
        </h3>
      </div>

      {/* Country selector */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-surface-2 border border-border rounded-sm hover:border-border-hover transition-colors text-left"
        >
          <span className="text-lg leading-none">{selected.flag}</span>
          <span className="text-sm font-medium text-content-0 flex-1 truncate">
            {getLocalizedName(selected, locale)}
          </span>
          <svg
            className={`w-4 h-4 text-content-3 transition-transform ${searchOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {searchOpen && (
          <div className="mt-2 border border-border rounded-sm bg-surface-1 shadow-md overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder={t("taxSearchCountry")}
                className="w-full px-2.5 py-1.5 text-sm bg-surface-2 border border-border rounded-xs text-content-0 placeholder:text-content-3 focus:outline-none focus:border-brand-gold"
                autoFocus
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setSelectedCode(country.code);
                    setSearchOpen(false);
                    setFilter("");
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-2 transition-colors ${
                    country.code === selectedCode
                      ? "bg-surface-2 font-medium"
                      : ""
                  }`}
                >
                  <span className="text-base leading-none">
                    {country.flag}
                  </span>
                  <span className="text-sm text-content-1 truncate">
                    {getLocalizedName(country, locale)}
                  </span>
                  {country.code === selectedCode && (
                    <svg
                      className="w-3.5 h-3.5 text-brand-gold ml-auto flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-3 text-sm text-content-3 text-center">
                  {t("taxNoResults")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tax info display */}
      <div className="space-y-3">
        {isGold && (
          <div>
            <div className="text-xs font-medium text-content-3 uppercase tracking-wider mb-1.5">
              {t("taxGoldLabel")}
            </div>
            <p className="text-sm text-content-2 leading-relaxed">{vatNote}</p>
            {selected.goldVatExempt && isInvestmentGold && (
              <div className="mt-2 flex items-center gap-2">
                <ShieldIcon />
                <span className="text-sm font-medium text-signal-up">
                  {t("vatExempt")}
                </span>
              </div>
            )}
            {!selected.goldVatExempt && (
              <div className="mt-2 px-3 py-1.5 bg-signal-down-bg rounded-xs inline-block">
                <span className="text-xs font-medium text-signal-down">
                  {t("taxApplies")}
                </span>
              </div>
            )}
          </div>
        )}

        {!isGold && (
          <div>
            <div className="text-xs font-medium text-content-3 uppercase tracking-wider mb-1.5">
              {t("taxSilverLabel")}
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-lg font-bold text-content-0">
                {selected.silverVatRate}
              </span>
            </div>
            <p className="text-sm text-content-2 leading-relaxed">{vatNote}</p>
            {selected.silverVatRate === "0 %" && (
              <div className="mt-2 flex items-center gap-2">
                <ShieldIcon />
                <span className="text-sm font-medium text-signal-up">
                  {t("vatExempt")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
