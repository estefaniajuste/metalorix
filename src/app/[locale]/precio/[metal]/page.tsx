import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getMetalSEO, METAL_SEO } from "@/lib/seo/metal-content";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";
import { ShareButton } from "@/components/dashboard/ShareButton";
import { Link } from "@/i18n/navigation";
import {
  resolveMetalSlug,
  getAllMetalSlugs,
  getLocalizedMetalSlug,
} from "@/lib/utils/metal-slugs";

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
  if (!seo) return { title: t("notFound") };

  const localizedSlug = getLocalizedMetalSlug(seo.slug, locale);
  const alternates = getAlternates(locale, {
    pathname: "/precio/[metal]",
    params: { metal: localizedSlug },
  });

  return {
    title: `${t("priceOf", { metal: seo.name })} — Metalorix`,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: `${t("priceOf", { metal: seo.name })} — Metalorix`,
      description: seo.description,
      type: "website",
      url: alternates.canonical,
    },
    alternates,
  };
}

function JsonLd({ slug, locale, canonicalUrl }: { slug: string; locale: string; canonicalUrl: string }) {
  const seo = getMetalSEO(slug, locale)!;
  const homeUrl = `https://metalorix.com/${locale}`;
  const schemas = [
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

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
    </>
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight">
              {t("priceOf", { metal: seo.name })}
            </h1>
            <ShareButton
              title={`${t("priceOf", { metal: seo.name })} — Metalorix`}
              text={t("shareText", { metal: seo.fullName })}
              url={alternates.canonical}
            />
          </div>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            {t("description", { metal: seo.fullName })}
          </p>

          <MetalPageContent symbol={seo.symbol} />

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
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

              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mt-6">
                <h3 className="text-base font-semibold text-content-0 mb-3">{tf("legalNotice")}</h3>
                <p className="text-xs text-content-3 leading-relaxed">{tf("disclaimer")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
