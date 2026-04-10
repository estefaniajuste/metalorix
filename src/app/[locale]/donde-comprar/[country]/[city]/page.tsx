import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  DEALER_COUNTRIES,
  getDealersByCity,
  getCountryBySlug,
  getCountryName,
  getCitiesByCountry,
  slugifyCity,
} from "@/lib/data/dealers";
import { DealerCard } from "@/components/tools/DealerCard";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getAlternates, buildMetaTitle } from "@/lib/seo/alternates";
import { routing, type Locale } from "@/i18n/routing";
import { SetLocalePathOverrides } from "@/components/layout/SetLocalePathOverrides";

export const revalidate = 86400;

interface Props {
  params: { country: string; city: string; locale: string };
}

export async function generateStaticParams() {
  const params: { country: string; city: string }[] = [];

  for (const countryData of DEALER_COUNTRIES) {
    const cities = getCitiesByCountry(countryData.code);
    if (cities.length === 0) continue;

    for (const [loc, countrySlug] of Object.entries(countryData.slug)) {
      if (!routing.locales.includes(loc as Locale)) continue;
      for (const cityEntry of cities) {
        params.push({ country: countrySlug, city: cityEntry.slug });
      }
    }
  }

  const seen = new Set<string>();
  return params.filter((p) => {
    const key = `${p.country}/${p.city}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const countryData = getCountryBySlug(params.country, locale);
  if (!countryData) return {};

  const cities = getCitiesByCountry(countryData.code);
  const cityEntry = cities.find((c) => c.slug === params.city);
  if (!cityEntry) return {};

  const t = await getTranslations("dealers");
  const countryName = getCountryName(countryData, locale);

  const alternates = getAlternates(locale, (loc: Locale) => ({
    pathname: "/donde-comprar/[country]/[city]" as const,
    params: {
      country: countryData.slug[loc] ?? countryData.slug.en,
      city: params.city,
    },
  }));

  const title = buildMetaTitle(
    t("cityTitle")
      .replace("{city}", cityEntry.city)
      .replace("{country}", countryName),
    "—"
  );

  const description = t("cityDesc")
    .replace("{city}", cityEntry.city)
    .replace("{country}", countryName);

  return {
    title,
    description,
    keywords: t("citySeoKeywords")
      .replace(/{city}/g, cityEntry.city),
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function CityDealersPage({ params }: Props) {
  const locale = await getLocale();
  const countryData = getCountryBySlug(params.country, locale);
  if (!countryData) notFound();

  const cities = getCitiesByCountry(countryData.code);
  const cityEntry = cities.find((c) => c.slug === params.city);
  if (!cityEntry) notFound();

  const dealers = getDealersByCity(countryData.code, params.city);
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
      {
        name: cityEntry.city,
        path: `/donde-comprar/${params.country}/${params.city}`,
      },
    ],
    tc("breadcrumbHome"),
    locale
  );

  const localBusinessSchemas = dealers
    .filter((d) => d.type === "physical" || d.type === "both")
    .map((d) => ({
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
    typeOnline: t("typeOnline"),
    typePhysical: t("typePhysical"),
    typeBoth: t("typeBoth"),
    visitWebsite: t("visitWebsite"),
    metalsAccepted: t("metalsAccepted"),
    featured: t("featured"),
    verified: t("verified"),
    viewProfile: t("viewProfile"),
  };

  const countrySlug = countryData.slug[locale] ?? countryData.slug.en;

  const localeHrefs: Record<string, { pathname: string; params: { country: string; city: string } }> = {};
  for (const loc of routing.locales) {
    localeHrefs[loc] = {
      pathname: "/donde-comprar/[country]/[city]",
      params: { country: countryData.slug[loc] ?? countryData.slug.en, city: params.city },
    };
  }

  return (
    <>
      <SetLocalePathOverrides hrefs={localeHrefs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
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
            <Link
              href={{
                pathname: "/donde-comprar/[country]" as const,
                params: { country: countrySlug },
              }}
              className="hover:text-content-1 transition-colors"
            >
              {countryName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{cityEntry.city}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl" aria-hidden="true">
              {countryData.flagEmoji}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight">
              {t("cityTitle")
                .replace("{city}", cityEntry.city)
                .replace("{country}", countryName)}
            </h1>
          </div>
          <p className="text-content-2 mb-10 max-w-3xl leading-relaxed">
            {t("cityDesc")
              .replace("{city}", cityEntry.city)
              .replace("{country}", countryName)}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dealers
              .sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((dealer) => (
                <DealerCard
                  key={dealer.id}
                  dealer={dealer}
                  locale={locale}
                  countrySlug={countrySlug}
                  t={tValues}
                />
              ))}
          </div>

          {/* Other cities in this country */}
          {cities.length > 1 && (
            <div className="mt-12">
              <h2 className="text-base font-semibold text-content-0 mb-4">
                {t("citiesSection")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {cities
                  .filter((c) => c.slug !== params.city)
                  .map((c) => (
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
              href={{
                pathname: "/donde-comprar/[country]" as const,
                params: { country: countrySlug },
              }}
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
              {countryName}
            </Link>
          </div>

          <div className="mt-16 p-6 rounded-DEFAULT bg-surface-1 border border-border">
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
