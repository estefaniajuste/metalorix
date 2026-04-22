/**
 * Affiliate CTA block for learn articles with purchase intent.
 * Shown on clusters: investment, price-factors, regulation-tax,
 * comparisons, guides, physical-metals, security-authenticity.
 * Uses rel="sponsored" per FTC/Google guidelines.
 */
import { DEALERS, getDealerOutboundUrl, FEATURED_AFFILIATE_DEALERS } from "@/lib/data/dealers";

const PURCHASE_INTENT_CLUSTERS = new Set([
  "investment",
  "price-factors",
  "regulation-tax",
  "comparisons",
  "guides",
  "physical-metals",
  "security-authenticity",
  "markets-trading",
  "history",
]);

interface LearnAffiliateCTAProps {
  clusterSlug: string;
  locale: string;
}

const LABELS: Record<string, { heading: string; sub: string; cta: string; disclosure: string }> = {
  en: {
    heading: "Ready to buy gold?",
    sub: "Compare trusted dealers with physical delivery and allocated storage.",
    cta: "Visit dealer →",
    disclosure: "Affiliate links — we may earn a commission at no cost to you.",
  },
  es: {
    heading: "¿Listo para comprar oro?",
    sub: "Compara dealers de confianza con entrega física y custodia asignada.",
    cta: "Ver dealer →",
    disclosure: "Links de afiliado — podemos recibir una comisión sin coste para ti.",
  },
  de: {
    heading: "Bereit Gold zu kaufen?",
    sub: "Vergleiche vertrauenswürdige Händler mit physischer Lieferung.",
    cta: "Händler besuchen →",
    disclosure: "Affiliate-Links — wir erhalten ggf. eine Provision, für Sie kostenlos.",
  },
};

export function LearnAffiliateCTA({ clusterSlug, locale }: LearnAffiliateCTAProps) {
  if (!PURCHASE_INTENT_CLUSTERS.has(clusterSlug)) return null;

  const dealers = DEALERS.filter(
    (d) =>
      d.affiliateUrl &&
      (FEATURED_AFFILIATE_DEALERS as readonly string[]).includes(d.id) &&
      d.metals.includes("XAU"),
  ).slice(0, 3);

  if (dealers.length === 0) return null;

  const l = LABELS[locale] ?? LABELS.en;

  return (
    <div className="mt-10 rounded-DEFAULT border border-brand-gold/20 bg-[rgba(214,179,90,0.04)] p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-sm bg-brand-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D6B35A" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-content-0">{l.heading}</h3>
          <p className="text-xs text-content-3 mt-0.5">{l.sub}</p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        {dealers.map((d) => {
          const url = getDealerOutboundUrl(d, `learn-${clusterSlug}`);
          if (!url) return null;
          return (
            <a
              key={d.id}
              href={url}
              target="_blank"
              rel="noopener sponsored"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-sm bg-surface-1 border border-border hover:border-brand-gold/40 transition-colors group"
            >
              <span className="w-7 h-7 rounded-sm bg-brand-gold/10 flex items-center justify-center text-xs font-bold text-brand-gold flex-shrink-0">
                {d.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold text-content-0 group-hover:text-brand-gold transition-colors block truncate">
                  {d.name}
                </span>
                <span className="text-[10px] text-content-3">{l.cta}</span>
              </div>
              <svg className="w-3.5 h-3.5 text-content-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          );
        })}
      </div>

      <p className="text-[9px] text-content-3/50 mt-3">{l.disclosure}</p>
    </div>
  );
}
