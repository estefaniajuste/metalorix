"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, type Product } from "@/lib/data/products";
import { ProductCard } from "./ProductCard";

type Filter = "todos" | "oro" | "plata" | "moneda" | "lingote";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "oro", label: "Oro" },
  { value: "plata", label: "Plata" },
  { value: "moneda", label: "Monedas" },
  { value: "lingote", label: "Lingotes" },
];

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
  const [active, setActive] = useState<Filter>("todos");
  const filtered = useMemo(() => filterProducts(PRODUCTS, active), [active]);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filtrar productos">
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
          No hay productos para este filtro.
        </p>
      )}
    </>
  );
}
