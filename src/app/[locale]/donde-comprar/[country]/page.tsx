import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  DEALER_COUNTRIES,
  getDealersByCountry,
  getCountryBySlug,
  getCountryName,
  getCitiesByCountry,
} from "@/lib/data/dealers";
import { DealerList } from "@/components/tools/DealerList";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";
import { routing, type Locale } from "@/i18n/routing";
import { SetLocalePathOverrides } from "@/components/layout/SetLocalePathOverrides";

export const revalidate = 86400;

interface Props {
  params: { country: string; locale: string };
}

export async function generateStaticParams() {
  const params: { country: string }[] = [];
  for (const countryData of DEALER_COUNTRIES) {
    for (const [loc, slug] of Object.entries(countryData.slug)) {
      if (routing.locales.includes(loc as Locale)) {
        params.push({ country: slug });
      }
    }
  }
  // deduplicate by slug value
  const seen = new Set<string>();
  return params.filter((p) => {
    if (seen.has(p.country)) return false;
    seen.add(p.country);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const countryData = getCountryBySlug(params.country, locale);
  if (!countryData) return {};

  const t = await getTranslations("dealers");
  const countryName = getCountryName(countryData, locale);

  const alternates = getAlternates(locale, (loc: Locale) => ({
    pathname: "/donde-comprar/[country]" as const,
    params: { country: countryData.slug[loc] ?? countryData.slug.en },
  }));

  const title = t("countryTitle").replace("{country}", countryName) + " — Metalorix";
  const description = t("countryDesc").replace("{country}", countryName);

  return {
    title,
    description,
    keywords: t("seoKeywords"),
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function CountryDealersPage({ params }: Props) {
  const locale = await getLocale();
  const countryData = getCountryBySlug(params.country, locale);

  if (!countryData) notFound();

  const dealers = getDealersByCountry(countryData.code);
  if (dealers.length === 0) notFound();

  const t = await getTranslations("dealers");
  const tc = await getTranslations("common");
  const countryName = getCountryName(countryData, locale);

  const bc = breadcrumbSchema(
    [
      { name: t("breadcrumb"), path: "/donde-comprar" },
      {
        name: countryName,
        path: `/donde-comprar/${params.country}`,
      },
    ],
    tc("breadcrumbHome"),
    locale
  );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("countryTitle").replace("{country}", countryName),
    numberOfItems: dealers.length,
    itemListElement: dealers.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.name,
      url: d.website,
    })),
  };

  const physicalDealers = dealers.filter(
    (d) => (d.type === "physical" || d.type === "both") && d.city
  );
  const localBusinessSchemas = physicalDealers.map((d) => ({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: d.name,
    url: d.website,
    description:
      d.description[locale] ?? d.description.en ?? d.description.es ?? "",
    address: {
      "@type": "PostalAddress",
      addressLocality: d.city,
      addressCountry: countryData.code.toUpperCase(),
    },
  }));

  const tValues = {
    filterAll: t("filterAll"),
    filterOnline: t("filterOnline"),
    filterPhysical: t("filterPhysical"),
    noResults: t("noResults"),
    dealersFound: t("dealersFound"),
    typeOnline: t("typeOnline"),
    typePhysical: t("typePhysical"),
    typeBoth: t("typeBoth"),
    visitWebsite: t("visitWebsite"),
    metalsAccepted: t("metalsAccepted"),
    featured: t("featured"),
    verified: t("verified"),
    viewProfile: t("viewProfile"),
  };

  const cities = getCitiesByCountry(countryData.code);
  const countrySlug = countryData.slug[locale] ?? countryData.slug.en;

  const localeHrefs: Record<string, { pathname: string; params: { country: string } }> = {};
  for (const loc of routing.locales) {
    localeHrefs[loc] = {
      pathname: "/donde-comprar/[country]",
      params: { country: countryData.slug[loc] ?? countryData.slug.en },
    };
  }

  return (
    <>
      <SetLocalePathOverrides hrefs={localeHrefs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {localBusinessSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

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
            <Link
              href="/donde-comprar"
              className="hover:text-content-1 transition-colors"
            >
              {t("breadcrumb")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{countryName}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">
              {countryData.flagEmoji}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight">
              {t("countryTitle").replace("{country}", countryName)}
            </h1>
          </div>
          <p className="text-content-2 mb-10 max-w-3xl leading-relaxed">
            {t("countryDesc").replace("{country}", countryName)}
          </p>

          <DealerList dealers={dealers} locale={locale} countrySlug={countrySlug} t={tValues} />

          {cities.length > 0 && (
            <div className="mt-12">
              <h2 className="text-base font-semibold text-content-0 mb-4">
                {t("citiesSection")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <Link
                    key={c.slug}
                    href={{
                      pathname: "/donde-comprar/[country]/[city]" as const,
                      params: { country: countrySlug, city: c.slug },
                    }}
                    className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors"
                  >
                    {c.city}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex items-center gap-2">
            <Link
              href="/donde-comprar"
              className="inline-flex items-center gap-1.5 text-sm text-content-2 hover:text-content-0 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t("backToCountries")}
            </Link>
          </div>

          {/* Register CTA */}
          <div className="mt-12 p-5 rounded-DEFAULT bg-brand-gold/5 border border-brand-gold/20 flex items-center justify-between gap-4 flex-wrap">
            <p className="font-semibold text-sm text-content-0">{t("registerCta")}</p>
            <Link
              href="/donde-comprar/registrar"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors"
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
