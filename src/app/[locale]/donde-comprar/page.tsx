import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  DEALER_COUNTRIES,
  getDealersByCountry,
  getCountryName,
} from "@/lib/data/dealers";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { getAlternates, buildMetaTitle } from "@/lib/seo/alternates";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dealers");
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/donde-comprar");

  const rawDesc = t("pageDesc");
  const description = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  return {
    title: buildMetaTitle(t("pageTitle"), "—"),
    description,
    keywords: t("seoKeywords"),
    alternates,
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDesc"),
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function DondeComprarPage() {
  const t = await getTranslations("dealers");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  const countriesWithCount = DEALER_COUNTRIES.map((country) => ({
    country,
    count: getDealersByCountry(country.code).length,
    name: getCountryName(country, locale),
    slug: country.slug[locale] ?? country.slug.en,
  })).filter((c) => c.count > 0);

  const bc = breadcrumbSchema(
    [{ name: t("breadcrumb"), path: "/donde-comprar" }],
    tc("breadcrumbHome"),
    locale
  );

  const faqItems = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
  ];
  const faq = faqSchema(faqItems);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("pageTitle"),
    description: t("pageDesc"),
    numberOfItems: countriesWithCount.length,
    itemListElement: countriesWithCount.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label={tc("breadcrumbNav")}
          >
            <Link href="/" className="hover:text-content-1 transition-colors">
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("breadcrumb")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("pageTitle")}
          </h1>
          <p className="text-content-2 mb-12 max-w-3xl leading-relaxed">
            {t("countriesDesc")}
          </p>

          {/* Best dealers banner */}
          <Link
            href="/donde-comprar/mejores"
            className="flex items-center justify-between gap-4 p-5 mb-10 rounded-DEFAULT bg-brand-gold/5 border border-brand-gold/20 hover:border-brand-gold/40 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm text-content-0 group-hover:text-brand-gold transition-colors">
                  {t("bestTitle")}
                </p>
                <p className="text-xs text-content-3 mt-0.5">{t("bestDesc")}</p>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 text-content-3 group-hover:text-brand-gold transition-colors" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>

          <h2 className="text-lg font-bold text-content-0 mb-6">
            {t("countriesTitle")}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {countriesWithCount.map(({ country, count, name, slug }) => (
              <Link
                key={country.code}
                href={{
                  pathname: "/donde-comprar/[country]",
                  params: { country: slug },
                }}
                className="group flex items-center gap-3 p-4 rounded-DEFAULT bg-surface-1 border border-border hover:border-brand-gold/30 transition-colors"
              >
                <span className="text-3xl flex-shrink-0" aria-hidden="true">
                  {country.flagEmoji}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-content-0 group-hover:text-brand-gold transition-colors truncate">
                    {name}
                  </p>
                  <p className="text-xs text-content-3">
                    {t("dealersFound").replace("{n}", String(count))}
                  </p>
                </div>
                <svg
                  className="ml-auto flex-shrink-0 text-content-3 group-hover:text-brand-gold transition-colors"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-content-0 mb-5">{t("faqTitle")}</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details key={i} className="group rounded-DEFAULT border border-border bg-surface-1 overflow-hidden">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-content-0 [&::-webkit-details-marker]:hidden list-none">
                    {item.question}
                    <svg className="shrink-0 ml-3 w-4 h-4 text-content-3 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Register CTA */}
          <div className="mt-12 p-6 rounded-DEFAULT bg-brand-gold/5 border border-brand-gold/20 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-semibold text-sm text-content-0">{t("registerCta")}</p>
              <p className="text-xs text-content-3 mt-1">{t("registerDesc")}</p>
            </div>
            <Link
              href="/donde-comprar/registrar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-DEFAULT bg-brand-gold text-black font-semibold text-sm hover:bg-brand-gold/90 transition-colors whitespace-nowrap"
            >
              {t("registerCtaBtn")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 p-6 rounded-DEFAULT bg-surface-1 border border-border">
            <h3 className="text-base font-semibold text-content-0 mb-2">
              {t("disclaimer")}
            </h3>
            <p className="text-xs text-content-3 leading-relaxed">
              {t("disclaimerText")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
