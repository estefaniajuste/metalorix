import type { Dealer } from "@/lib/data/dealers";

const METAL_LABELS: Record<string, string> = {
  XAU: "Au",
  XAG: "Ag",
  XPT: "Pt",
  XPD: "Pd",
};

interface DealerCardProps {
  dealer: Dealer;
  locale: string;
  t: {
    typeOnline: string;
    typePhysical: string;
    typeBoth: string;
    visitWebsite: string;
    metalsAccepted: string;
    featured: string;
    verified: string;
  };
}

function TypeBadge({ type, t }: { type: Dealer["type"]; t: DealerCardProps["t"] }) {
  const styles = {
    online: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    physical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    both: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const labels = {
    online: t.typeOnline,
    physical: t.typePhysical,
    both: t.typeBoth,
  };

  return (
    <span
      className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

export function DealerCard({ dealer, locale, t }: DealerCardProps) {
  const description =
    dealer.description[locale] ??
    dealer.description.en ??
    dealer.description.es ??
    "";

  return (
    <article className="group relative flex flex-col gap-3 p-5 rounded-DEFAULT bg-surface-1 border border-border hover:border-brand-gold/30 transition-colors">
      {dealer.featured && (
        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-brand-gold px-2 py-0.5 rounded-full border border-brand-gold/30 bg-brand-gold/5">
          {t.featured}
        </span>
      )}

      <div className="flex items-start gap-3 pr-12">
        <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0 text-lg font-bold text-content-2 select-none">
          {dealer.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-content-0 text-sm leading-tight">
            {dealer.name}
          </h3>
          {dealer.city && (
            <p className="text-xs text-content-3 mt-0.5">{dealer.city}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TypeBadge type={dealer.type} t={t} />
        {dealer.verified && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {t.verified}
          </span>
        )}
        <div className="flex gap-1">
          {dealer.metals.map((metal) => (
            <span
              key={metal}
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-2 text-content-2"
            >
              {METAL_LABELS[metal] ?? metal}
            </span>
          ))}
        </div>
      </div>

      {description && (
        <p className="text-xs text-content-2 leading-relaxed line-clamp-3">
          {description}
        </p>
      )}

      {dealer.website && (
        <a
          href={dealer.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors"
        >
          {t.visitWebsite}
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      )}
    </article>
  );
}
