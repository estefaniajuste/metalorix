import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getMetalSEO, METAL_SEO, type MetalFAQ } from "@/lib/seo/metal-content";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";
import { UnitPriceTable } from "@/components/dashboard/UnitPriceTable";
import { ShareButton } from "@/components/dashboard/ShareButton";
import { Link } from "@/i18n/navigation";
import {
  resolveMetalSlug,
  getAllMetalSlugs,
  getLocalizedMetalSlug,
} from "@/lib/utils/metal-slugs";
import { DEALER_COUNTRIES, getDealersByCountry } from "@/lib/data/dealers";

export const revalidate = 60;

export function generateStaticParams() {
  return getAllMetalSlugs().map((metal) => ({ metal }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; metal: string };
}): Promise<Metadata> {
  const { locale, metal } = params;
  const t = await getTranslations({ locale, namespace: "prices" });
  const internalSlug = resolveMetalSlug(metal) ?? metal;
  const seo = getMetalSEO(internalSlug, locale);
  if (!seo) notFound();

  const localizedSlug = getLocalizedMetalSlug(seo.slug, locale);
  const alternates = getAlternates(locale, {
    pathname: "/precio/[metal]",
    params: { metal: localizedSlug },
  });

  const year = new Date().getFullYear();
  const pageTitle = `${t("priceOf", { metal: seo.name })} [${year}] — Metalorix`;

  const baseUrl = (process.env.NEXT_PUBLIC_URL || "https://metalorix.com").replace(/\/$/, "");
  const ogImageUrl = `${baseUrl}/api/og?metal=${encodeURIComponent(metal)}&locale=${locale}`;

  return {
    title: pageTitle,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: pageTitle,
      description: seo.description,
      type: "website",
      url: alternates.canonical,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    alternates,
  };
}

function JsonLd({ slug, locale, canonicalUrl }: { slug: string; locale: string; canonicalUrl: string }) {
  const seo = getMetalSEO(slug, locale)!;
  const homeUrl = `https://metalorix.com/${locale}`;
  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "FinancialProduct",
      name: seo.fullName,
      description: seo.about,
      url: canonicalUrl,
      provider: { "@type": "Organization", name: "Metalorix", url: "https://metalorix.com" },
      category: "Precious Metals",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Metalorix", item: homeUrl },
        { "@type": "ListItem", position: 2, name: seo.name, item: canonicalUrl },
      ],
    },
  ];

  if (seo.faq && seo.faq.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
  );
}

function WhereToBuyBlock({
  locale,
  metalName,
  t,
}: {
  locale: string;
  metalName: string;
  t: Awaited<ReturnType<typeof getTranslations<"prices">>>;
}) {
  const featured = DEALER_COUNTRIES.filter(
    (c) => getDealersByCountry(c.code).length > 0
  ).slice(0, 6);

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mt-6">
      <h3 className="text-base font-semibold text-content-0 mb-1">
        {t("whereToBuyTitle", { metal: metalName })}
      </h3>
      <p className="text-xs text-content-3 mb-4 leading-relaxed">
        {t("whereToBuyDesc")}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {featured.map((c) => {
          const slug = c.slug[locale] ?? c.slug.en;
          return (
            <Link
              key={c.code}
              href={{
                pathname: "/donde-comprar/[country]" as const,
                params: { country: slug },
              }}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-2 border border-border text-content-1 hover:text-brand-gold hover:border-brand-gold transition-colors"
            >
              <span>{c.flagEmoji}</span>
              <span>{c.nameI18n[locale] ?? c.nameI18n.en}</span>
            </Link>
          );
        })}
      </div>
      <Link
        href="/donde-comprar"
        className="text-xs font-semibold text-brand-gold hover:brightness-110 transition-colors flex items-center gap-1"
      >
        {t("whereToBuyCta")}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}

export default async function PrecioMetalPage({
  params,
}: {
  params: { locale: string; metal: string };
}) {
  const locale = await getLocale();
  const internalSlug = resolveMetalSlug(params.metal) ?? params.metal;
  const seo = getMetalSEO(internalSlug, locale);
  if (!seo) notFound();

  const t = await getTranslations("prices");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const localizedSlug = getLocalizedMetalSlug(seo.slug, locale);

  const alternates = getAlternates(locale, {
    pathname: "/precio/[metal]",
    params: { metal: localizedSlug },
  });
  const otherMetals = Object.keys(METAL_SEO)
    .filter((slug) => slug !== seo.slug)
    .map((slug) => ({ ...getMetalSEO(slug, locale)!, localSlug: getLocalizedMetalSlug(slug, locale) }));

  return (
    <>
      <JsonLd slug={seo.slug} locale={locale} canonicalUrl={alternates.canonical} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
            <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("breadcrumbPrice", { metal: seo.name })}</span>
          </nav>

          <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight">
                {t("priceOf", { metal: seo.name })}
              </h1>
              <p className="text-xs text-content-3 mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-up animate-pulse" />
                {t("liveUpdated")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/alertas"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B0F17] bg-brand-gold hover:brightness-110 transition-all px-3.5 py-1.5 rounded-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {t("setAlert")}
              </Link>
              <ShareButton
                title={`${t("priceOf", { metal: seo.name })} — Metalorix`}
                text={t("shareText", { metal: seo.fullName })}
                url={alternates.canonical}
              />
            </div>
          </div>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            {t("description", { metal: seo.fullName })}
          </p>

          <MetalPageContent symbol={seo.symbol} />

          <div className="mt-10">
            <UnitPriceTable symbol={seo.symbol} />
          </div>

          {/* Alert CTA banner */}
          <div className="mt-10 bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 rounded-DEFAULT p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-content-0">
                  {t("setAlert")} — {seo.name}
                </p>
                <p className="text-xs text-content-2 mt-0.5">
                  {t("setAlertDesc", { metal: seo.name })}
                </p>
              </div>
            </div>
            <Link
              href="/alertas"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-[#0B0F17] text-sm font-bold rounded-sm hover:brightness-110 transition-all"
            >
              {t("setAlert")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h2 className="text-xl font-bold text-content-0 mb-4">
                  {t("about", { metal: seo.name })}
                </h2>
                <p className="text-content-2 leading-relaxed mb-6">{seo.about}</p>
                <h3 className="text-base font-semibold text-content-0 mb-3">{t("keyFacts")}</h3>
                <ul className="space-y-3">
                  {seo.facts.map((fact, i) => (
                    <li key={i} className="flex gap-3 text-sm text-content-1 leading-relaxed">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold mt-2" />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h3 className="text-base font-semibold text-content-0 mb-4">{t("otherMetals")}</h3>
                <div className="space-y-3">
                  {otherMetals.map((m) => (
                    <Link key={m.slug} href={{ pathname: "/precio/[metal]" as const, params: { metal: m.localSlug } }} className="flex items-center gap-3 p-3 rounded-sm hover:bg-surface-2 transition-colors group">
                      <span className="text-sm font-bold text-content-3 group-hover:text-content-1 transition-colors w-8">{m.symbol.slice(1)}</span>
                      <div>
                        <div className="text-sm font-medium text-content-0">{m.name}</div>
                        <div className="text-xs text-content-3">{m.symbol}/USD</div>
                      </div>
                      <svg className="ms-auto w-4 h-4 text-content-3 group-hover:text-content-1 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              <WhereToBuyBlock locale={locale} metalName={seo.name} t={t} />

              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mt-6">
                <h3 className="text-base font-semibold text-content-0 mb-3">{tf("legalNotice")}</h3>
                <p className="text-xs text-content-3 leading-relaxed">{tf("disclaimer")}</p>
              </div>
            </div>
          </div>
        </div>

          {seo.faq && seo.faq.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-content-0 mb-5">
                {t("faqTitle", { metal: seo.name })}
              </h2>
              <div className="space-y-4">
                {(seo.faq as MetalFAQ[]).map((item, i) => (
                  <details
                    key={i}
                    className="group bg-surface-1 border border-border rounded-DEFAULT overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer text-sm font-semibold text-content-0 hover:text-brand-gold transition-colors [&::-webkit-details-marker]:hidden list-none">
                      {item.question}
                      <svg className="w-4 h-4 text-content-3 transition-transform group-open:rotate-180 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-content-2 leading-relaxed border-t border-border pt-4">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-base font-semibold text-content-3 mb-4">
              {t("relatedSearches")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {seo.slug === "oro" && (
                <>
                  <Link href="/precio-oro-hoy" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                    {seo.name} — {t("priceOf", { metal: seo.name })}
                  </Link>
                  <Link href="/precio-gramo-oro" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                    {seo.name} / {tc("gram")}
                  </Link>
                </>
              )}
              {(seo.slug === "oro" || seo.slug === "plata") && (
                <Link href="/ratio-oro-plata" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                  {tn("ratio")}
                </Link>
              )}
              <Link href="/conversor-divisas" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                {seo.name} — EUR, GBP, JPY, INR
              </Link>
              <Link href="/calculadora-rentabilidad" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                ROI {seo.name}
              </Link>
              <Link href="/herramientas" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                DCA {seo.name}
              </Link>
              <Link href="/guia-inversion" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                {seo.name} — {tf("investmentGuide")}
              </Link>
              {otherMetals.slice(0, 3).map((m) => (
                <Link key={m.slug} href={{ pathname: "/precio/[metal]" as const, params: { metal: m.localSlug } }} className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                  {t("priceOf", { metal: m.name })}
                </Link>
              ))}
              <Link href="/alertas" className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors">
                {t("setAlert")} — {seo.name}
              </Link>
            </div>
          </div>
      </section>
    </>
  );
}
