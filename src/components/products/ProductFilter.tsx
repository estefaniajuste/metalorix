"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedProducts, type Product } from "@/lib/data/products";
import { ProductCard } from "./ProductCard";

type Filter = "todos" | "oro" | "plata" | "moneda" | "lingote";

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

export function ProductFilter() {
  const t = useTranslations("productFilter");
  const locale = useLocale();
  const products = useMemo(() => getLocalizedProducts(locale), [locale]);
  const [active, setActive] = useState<Filter>("todos");
  const filtered = useMemo(() => filterProducts(products, active), [products, active]);

  const FILTERS: { value: Filter; label: string }[] = [
    { value: "todos", label: t("all") },
    { value: "oro", label: t("gold") },
    { value: "plata", label: t("silver") },
    { value: "moneda", label: t("coins") },
    { value: "lingote", label: t("bars") },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={t("filterProducts")}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-content-3 text-center py-12">
          {t("noProducts")}
        </p>
      )}
    </>
  );
}
