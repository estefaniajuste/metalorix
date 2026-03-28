"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedProducts, type Product } from "@/lib/data/products";
import { ProductCard } from "./ProductCard";
import { ProductCompare } from "./ProductCompare";

type Filter = "todos" | "oro" | "plata" | "moneda" | "lingote";
type SortKey = "default" | "purity" | "weightDesc" | "weightAsc" | "liquidity";

const MAX_COMPARE = 3;

const LIQUIDITY_SCORE: Record<string, number> = {
  "Muy alta": 3, "Alta": 2, "Media": 1,
  "Very high": 3, "High": 2, "Medium": 1,
  "Sehr hoch": 3, "Hoch": 2, "Mittel": 1,
  "非常高": 3, "高": 2, "中等": 1,
  "عالية جداً": 3, "عالية": 2, "متوسطة": 1,
  "Çok yüksek": 3, "Yüksek": 2, "Orta": 1,
  "बहुत उच्च": 3, "उच्च": 2, "मध्यम": 1,
};

function filterProducts(products: Product[], filter: Filter): Product[] {
  switch (filter) {
    case "oro":
    case "plata":
      return products.filter((p) => p.metal === filter);
    case "moneda":
    case "lingote":
      return products.filter((p) => p.type === filter);
    default:
      return products;
  }
}

function sortProducts(products: Product[], sort: SortKey): Product[] {
  if (sort === "default") return products;
  const sorted = [...products];
  switch (sort) {
    case "purity":
      return sorted.sort((a, b) => b.purity - a.purity);
    case "weightDesc":
      return sorted.sort((a, b) => b.fineWeightOz - a.fineWeightOz);
    case "weightAsc":
      return sorted.sort((a, b) => a.fineWeightOz - b.fineWeightOz);
    case "liquidity":
      return sorted.sort(
        (a, b) => (LIQUIDITY_SCORE[b.liquidity] ?? 1) - (LIQUIDITY_SCORE[a.liquidity] ?? 1),
      );
    default:
      return sorted;
  }
}

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-[#0B0F17]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="18" rx="1" />
    </svg>
  );
}

export function ProductFilter() {
  const t = useTranslations("productFilter");
  const locale = useLocale();
  const products = useMemo(() => getLocalizedProducts(locale), [locale]);
  const [active, setActive] = useState<Filter>("todos");
  const [sort, setSort] = useState<SortKey>("default");
  const [compareMode, setCompareMode] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const compareRef = useRef<HTMLDivElement>(null);

  const result = useMemo(
    () => sortProducts(filterProducts(products, active), sort),
    [products, active, sort],
  );

  const compareProducts = useMemo(
    () => compareList
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is Product => p != null),
    [compareList, products],
  );

  const toggleCompare = useCallback((slug: string) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeFromCompare = useCallback((slug: string) => {
    setCompareList((prev) => prev.filter((s) => s !== slug));
  }, []);

  const exitCompare = useCallback(() => {
    setCompareMode(false);
    setCompareList([]);
  }, []);

  const scrollToCompare = useCallback(() => {
    compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const FILTERS: { value: Filter; label: string }[] = [
    { value: "todos", label: t("all") },
    { value: "oro", label: t("gold") },
    { value: "plata", label: t("silver") },
    { value: "moneda", label: t("coins") },
    { value: "lingote", label: t("bars") },
  ];

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "default", label: t("sortDefault") },
    { value: "purity", label: t("sortPurity") },
    { value: "weightDesc", label: t("sortWeightDesc") },
    { value: "weightAsc", label: t("sortWeightAsc") },
    { value: "liquidity", label: t("sortLiquidity") },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterProducts")}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`px-4 py-2 rounded-xs text-sm font-medium transition-colors ${
                active === f.value
                  ? "bg-brand-gold text-[#0B0F17]"
                  : "bg-surface-2 text-content-2 hover:text-content-0 hover:bg-surface-3"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => compareMode ? exitCompare() : setCompareMode(true)}
            className={`px-4 py-2 rounded-xs text-sm font-medium transition-colors flex items-center gap-1.5 ${
              compareMode
                ? "bg-brand-gold text-[#0B0F17]"
                : "bg-surface-2 text-content-2 hover:text-content-0 hover:bg-surface-3"
            }`}
          >
            <CompareIcon />
            {compareMode ? t("exitCompare") : t("compare")}
          </button>

          <label htmlFor="product-sort" className="sr-only">{t("sortBy")}</label>
          <select
            id="product-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-surface-2 text-content-2 text-sm px-3 py-2 rounded-xs border border-border focus:outline-none focus:ring-1 focus:ring-brand-gold"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {compareMode && (
        <div className="mb-6 flex items-center gap-2 text-sm text-content-2">
          <span>{t("compareHint")}</span>
          {compareList.length >= MAX_COMPARE && (
            <span className="text-xs text-brand-gold font-medium">({t("compareMax")})</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.map((product) => {
          if (!compareMode) {
            return <ProductCard key={product.slug} product={product} />;
          }

          const isSelected = compareList.includes(product.slug);
          return (
            <div
              key={product.slug}
              role="button"
              tabIndex={0}
              onClick={() => toggleCompare(product.slug)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCompare(product.slug); } }}
              className={`relative cursor-pointer rounded-DEFAULT transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-surface-0"
                  : "hover:ring-1 hover:ring-content-3"
              }`}
            >
              <div className="pointer-events-none">
                <ProductCard product={product} />
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-gold flex items-center justify-center z-10">
                  <CheckIcon />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {result.length === 0 && (
        <p className="text-sm text-content-3 text-center py-12">
          {t("noProducts")}
        </p>
      )}

      {compareMode && compareProducts.length >= 2 && (
        <div ref={compareRef}>
          <ProductCompare products={compareProducts} onRemove={removeFromCompare} />
        </div>
      )}

      {compareMode && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-1/95 backdrop-blur-md border-t border-border px-6 py-3">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <span className="text-sm text-content-1">
              <span className="font-semibold text-brand-gold">{compareList.length}</span>{" "}
              {t("selected")}
            </span>
            <div className="flex items-center gap-2">
              {compareList.length > 0 && (
                <button
                  onClick={() => setCompareList([])}
                  className="px-3 py-1.5 text-sm text-content-2 hover:text-content-0 transition-colors"
                >
                  {t("clearCompare")}
                </button>
              )}
              {compareList.length >= 2 && (
                <button
                  onClick={scrollToCompare}
                  className="px-4 py-1.5 bg-brand-gold text-[#0B0F17] text-sm font-medium rounded-xs hover:bg-brand-gold/90 transition-colors"
                >
                  {t("compareNow")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {compareMode && <div className="h-16" />}
    </>
  );
}
