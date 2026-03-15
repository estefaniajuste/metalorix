import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getGlossaryTerms } from "@/lib/data/glossary";
import { getAlternates } from "@/lib/seo/alternates";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "glossary" });
  return {
    title: `${t("title")} — Metalorix`,
    description: t("subtitle"),
    alternates: getAlternates(locale, "/aprende"),
  };
}

export default async function GlosarioPage() {
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/aprende");
  const t = await getTranslations("glossary");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const terms = getGlossaryTerms(locale);

  const sortedTerms = [...terms].sort((a, b) =>
    a.term.localeCompare(b.term, locale)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: t("title"),
    description: t("subtitle"),
    url: alternates.canonical,
    hasDefinedTerm: sortedTerms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url: `${alternates.canonical}#${term.id}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[900px] px-6">
          <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
            <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("title")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-content-2 mb-10 leading-relaxed max-w-2xl">
            {t("subtitle")}
          </p>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-5 mb-10">
            <div className="text-xs font-semibold text-content-3 uppercase tracking-wider mb-3">
              {t("quickIndex")}
            </div>
            <div className="flex flex-wrap gap-2">
              {sortedTerms.map((term) => (
                <a key={term.id} href={`#${term.id}`} className="text-xs text-content-2 hover:text-brand-gold px-2 py-1 bg-surface-2 rounded-xs transition-colors">
                  {term.term}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {sortedTerms.map((term, i) => (
              <div key={term.id} id={term.id} className={`py-6 scroll-mt-20 ${i < sortedTerms.length - 1 ? "border-b border-border" : ""}`}>
                <h2 className="text-lg font-bold text-content-0 mb-2">{term.term}</h2>
                <p className="text-sm text-content-1 leading-relaxed">{term.definition}</p>
                {term.related && term.related.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-content-3 font-medium uppercase tracking-wider">{t("related")}:</span>
                    {term.related.map((rid) => {
                      const rel = terms.find((x) => x.id === rid);
                      if (!rel) return null;
                      return <a key={rid} href={`#${rid}`} className="text-xs text-brand-gold hover:underline">{rel.term}</a>;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6 text-center">
            <h3 className="text-base font-semibold text-content-0 mb-2">{t("ctaTitle")}</h3>
            <p className="text-sm text-content-2 mb-4">{t("ctaDesc")}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all">
                {t("viewDashboard")}
              </Link>
              <Link href="/herramientas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-2 text-content-0 hover:bg-surface-2/80 transition-all">
                {tn("tools")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
