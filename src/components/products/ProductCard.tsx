import Link from "next/link";
import type { Product } from "@/lib/data/products";

const metalColors: Record<string, { dot: string; badge: string }> = {
  oro: {
    dot: "#D6B35A",
    badge: "bg-[rgba(214,179,90,0.12)] text-brand-gold",
  },
  plata: {
    dot: "#A7B0BE",
    badge: "bg-[rgba(167,176,190,0.12)] text-[#A7B0BE]",
  },
};

const typeLabels: Record<string, string> = {
  moneda: "Moneda",
  lingote: "Lingote",
};

function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 text-content-3 group-hover:text-brand-gold transition-colors"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const colors = metalColors[product.metal];

  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group bg-surface-1 border border-border rounded-DEFAULT p-6 flex flex-col transition-all duration-250 ease-smooth hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors.dot }}
          />
          <h3 className="text-base font-semibold text-content-0 group-hover:text-brand-gold transition-colors">
            {product.shortName}
          </h3>
        </div>
        <ArrowIcon />
      </div>

      <p className="text-sm text-content-2 leading-relaxed mb-4 flex-1 line-clamp-2">
        {product.description.slice(0, 120)}…
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
        <div>
          <span className="text-content-3">Pureza</span>
          <div className="font-medium text-content-1">{product.purityLabel.split(" ")[0]}</div>
        </div>
        <div>
          <span className="text-content-3">Peso fino</span>
          <div className="font-medium text-content-1">
            {product.fineWeightOz === 1 ? "1 oz troy" : `${product.grossWeightG} g`}
          </div>
        </div>
        <div>
          <span className="text-content-3">Prima</span>
          <div className="font-medium text-content-1">{product.premiumRange}</div>
        </div>
        <div>
          <span className="text-content-3">Liquidez</span>
          <div className="font-medium text-content-1">{product.liquidity}</div>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center gap-2 flex-wrap">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.badge}`}
        >
          {product.metal}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
          {typeLabels[product.type]}
        </span>
        {product.investmentGold && (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-signal-up-bg text-signal-up">
            Exento IVA
          </span>
        )}
      </div>
    </Link>
  );
}
