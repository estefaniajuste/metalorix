import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  DEALER_COUNTRIES,
  getDealersByCity,
  getDealerBySlug,
  getCountryBySlug,
  getCountryName,
  getCitiesByCountry,
  slugifyCity,
  slugifyDealer,
  type Dealer,
} from "@/lib/data/dealers";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";
import { routing, type Locale } from "@/i18n/routing";
import { DealerProfileClient } from "@/components/dealers/DealerProfileClient";
import { SetLocalePathOverrides } from "@/components/layout/SetLocalePathOverrides";

export const revalidate = 86400;

interface Props {
  params: { country: string; city: string; dealer: string; locale: string };
}

export async function generateStaticParams() {
  const params: { country: string; city: string; dealer: string }[] = [];
  const seen = new Set<string>();

  for (const countryData of DEALER_COUNTRIES) {
    const cities = getCitiesByCountry(countryData.code);
    if (cities.length === 0) continue;

    for (const [loc, countrySlug] of Object.entries(countryData.slug)) {
      if (!routing.locales.includes(loc as Locale)) continue;
      for (const cityEntry of cities) {
        const dealers = getDealersByCity(countryData.code, cityEntry.slug);
        for (const d of dealers) {
          const dealerSlug = slugifyDealer(d.name);
          const key = `${countrySlug}/${cityEntry.slug}/${dealerSlug}`;
          if (!seen.has(key)) {
            seen.add(key);
            params.push({
              country: countrySlug,
              city: cityEntry.slug,
              dealer: dealerSlug,
            });
          }
        }
      }
    }
  }

  return params;
}

function resolveDealer(
  countrySlug: string,
  citySlug: string,
  dealerSlug: string,
  locale: string
): { dealer: Dealer; countryData: (typeof DEALER_COUNTRIES)[number]; cityName: string } | null {
  const countryData = getCountryBySlug(countrySlug, locale);
  if (!countryData) return null;

  const dealer = getDealerBySlug(countryData.code, citySlug, dealerSlug);
  if (!dealer || !dealer.city) return null;

  return { dealer, countryData, cityName: dealer.city };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await getLocale();
  const result = resolveDealer(params.country, params.city, params.dealer, locale);
  if (!result) return {};

  const { dealer, countryData, cityName } = result;
  const t = await getTranslations("dealers");
  const countryName = getCountryName(countryData, locale);

  const alternates = getAlternates(locale, (loc: Locale) => ({
    pathname: "/donde-comprar/[country]/[city]/[dealer]" as const,
    params: {
      country: countryData.slug[loc] ?? countryData.slug.en,
      city: params.city,
      dealer: params.dealer,
    },
  }));

  const title =
    t("dealerProfile")
      .replace("{name}", dealer.name)
      .replace("{city}", cityName) + " | Metalorix";

  const description = t("dealerProfileDesc")
    .replace("{name}", dealer.name)
    .replace("{city}", cityName)
    .replace("{country}", countryName);

  return {
    title,
    description: description.length > 155
      ? description.slice(0, description.slice(0, 155).lastIndexOf(" "))
      : description,
    keywords: t("dealerProfileSeoKw")
      .replace(/{city}/g, cityName)
      .replace(/{name}/g, dealer.name),
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      url: alternates.canonical,
    },
  };
}

const METAL_NAMES: Record<string, string> = {
  XAU: "Gold",
  XAG: "Silver",
  XPT: "Platinum",
  XPD: "Palladium",
};

const METAL_SYMBOLS_API: Record<string, string> = {
  XAU: "XAU",
  XAG: "XAG",
  XPT: "XPT",
  XPD: "XPD",
};

export default async function DealerProfilePage({ params }: Props) {
  const locale = await getLocale();
  const result = resolveDealer(params.country, params.city, params.dealer, locale);
  if (!result) notFound();

  const { dealer, countryData, cityName } = result;
  const t = await getTranslations("dealers");
  const tc = await getTranslations("common");
  const countryName = getCountryName(countryData, locale);
  const countrySlug = countryData.slug[locale] ?? countryData.slug.en;

  const bc = breadcrumbSchema(
    [
      { name: t("breadcrumb"), path: "/donde-comprar" },
      { name: countryName, path: `/donde-comprar/${params.country}` },
      { name: cityName, path: `/donde-comprar/${params.country}/${params.city}` },
      { name: dealer.name, path: `/donde-comprar/${params.country}/${params.city}/${params.dealer}` },
    ],
    tc("breadcrumbHome"),
    locale
  );

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: dealer.name,
    url: dealer.website || undefined,
    description:
      dealer.description[locale] ?? dealer.description.en ?? dealer.description.es ?? "",
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: countryData.code.toUpperCase(),
    },
    ...(dealer.type === "online"
      ? {}
      : { "@type": "FinancialService" }),
  };

  const faqItems = [
    {
      question: t("dealerFaq1Q").replace(/{city}/g, cityName),
      answer: t("dealerFaq1A").replace(/{city}/g, cityName),
    },
    {
      question: t("dealerFaq2Q").replace(/{city}/g, cityName),
      answer: t("dealerFaq2A").replace(/{city}/g, cityName),
    },
  ];
  const faq = faqSchema(faqItems);

  const relatedDealers = getDealersByCity(countryData.code, params.city)
    .filter((d) => d.id !== dealer.id)
    .slice(0, 6);

  const description =
    dealer.description[locale] ??
    dealer.description.en ??
    dealer.description.es ??
    "";

  const typeLabels: Record<string, string> = {
    online: t("typeOnline"),
    physical: t("typePhysical"),
    both: t("typeBoth"),
  };

  const metalApiSymbols = dealer.metals
    .map((m) => METAL_SYMBOLS_API[m])
    .filter(Boolean);

  const localeHrefs: Record<string, { pathname: string; params: { country: string; city: string; dealer: string } }> = {};
  for (const loc of routing.locales) {
    localeHrefs[loc] = {
      pathname: "/donde-comprar/[country]/[city]/[dealer]",
      params: {
        country: countryData.slug[loc] ?? countryData.slug.en,
        city: params.city,
        dealer: params.dealer,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
            <Link href="/" className="hover:text-content-1 transition-colors">
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/donde-comprar" className="hover:text-content-1 transition-colors">
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
            <Link
              href={{
                pathname: "/donde-comprar/[country]/[city]" as const,
                params: { country: countrySlug, city: params.city },
              }}
              className="hover:text-content-1 transition-colors"
            >
              {cityName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{dealer.name}</span>
          </nav>

          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0 text-2xl font-bold text-content-2 select-none">
              {dealer.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight">
                  {dealer.name}
                </h1>
                {dealer.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/8 text-emerald-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {t("verified")}
                  </span>
                )}
                {dealer.featured && (
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-gold px-2.5 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/5">
                    {t("featured")}
                  </span>
                )}
              </div>
              <p className="text-content-2 mt-1 flex items-center gap-2">
                <span>{countryData.flagEmoji}</span>
                <span>{cityName}, {countryName}</span>
                <span className="text-content-3">·</span>
                <span className="text-sm">{typeLabels[dealer.type]}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {description && (
                <div className="p-5 rounded-DEFAULT bg-surface-1 border border-border">
                  <p className="text-sm text-content-1 leading-relaxed">{description}</p>
                </div>
              )}

              {/* Metals */}
              <div>
                <h2 className="text-lg font-bold text-content-0 mb-4">{t("metalsTraded")}</h2>
                <div className="flex flex-wrap gap-2">
                  {dealer.metals.map((metal) => (
                    <span
                      key={metal}
                      className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-DEFAULT bg-surface-1 border border-border text-content-1"
                    >
                      <span className="w-2 h-2 rounded-full bg-brand-gold" />
                      {METAL_NAMES[metal] ?? metal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Spot Prices */}
              <div>
                <h2 className="text-lg font-bold text-content-0 mb-4">{t("livePrices")}</h2>
                <DealerProfileClient metals={metalApiSymbols} perOzLabel={t("perOz")} />
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-lg font-bold text-content-0 mb-4">
                  {t("dealerFaqTitle").replace(/{city}/g, cityName)}
                </h2>
                <div className="space-y-3">
                  {faqItems.map((item, i) => (
                    <details key={i} className="group rounded-DEFAULT border border-border bg-surface-1 overflow-hidden">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-content-0 [&::-webkit-details-marker]:hidden list-none">
                        {item.question}
                        <svg className="shrink-0 ml-3 w-4 h-4 text-content-3 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact info */}
              <div className="p-5 rounded-DEFAULT bg-surface-1 border border-border space-y-4">
                <h3 className="text-base font-bold text-content-0">{t("contactInfo")}</h3>

                {dealer.website && (
                  <a
                    href={dealer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-brand-gold hover:text-brand-gold/80 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <span className="truncate">{t("website")}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-auto" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                )}

                <div className="text-xs text-content-3 flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{cityName}, {countryName}</span>
                </div>
              </div>

              {/* Share */}
              <div className="p-5 rounded-DEFAULT bg-surface-1 border border-border space-y-3">
                <h3 className="text-base font-bold text-content-0">{t("shareDealer")}</h3>
                <DealerProfileClient
                  shareMode
                  dealerName={dealer.name}
                  cityName={cityName}
                  copyLabel={t("copyLink")}
                  copiedLabel={t("linkCopied")}
                  whatsappLabel={t("shareViaWhatsApp")}
                />
              </div>

              {/* Register CTA */}
              <div className="p-5 rounded-DEFAULT bg-brand-gold/5 border border-brand-gold/20 space-y-3">
                <p className="text-sm font-semibold text-content-0">{t("registerCta")}</p>
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
            </div>
          </div>

          {/* Related dealers */}
          {relatedDealers.length > 0 && (
            <div className="mt-16">
              <h2 className="text-lg font-bold text-content-0 mb-6">
                {t("relatedDealers").replace("{city}", cityName)}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedDealers.map((rd) => (
                  <Link
                    key={rd.id}
                    href={{
                      pathname: "/donde-comprar/[country]/[city]/[dealer]" as const,
                      params: {
                        country: countrySlug,
                        city: params.city,
                        dealer: slugifyDealer(rd.name),
                      },
                    }}
                    className="group flex items-center gap-3 p-4 rounded-DEFAULT bg-surface-1 border border-border hover:border-brand-gold/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0 text-lg font-bold text-content-2 select-none">
                      {rd.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-content-0 group-hover:text-brand-gold transition-colors truncate">
                        {rd.name}
                      </p>
                      <p className="text-xs text-content-3">{rd.city}</p>
                    </div>
                    <svg
                      className="ml-auto flex-shrink-0 text-content-3 group-hover:text-brand-gold transition-colors"
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="mt-10 flex items-center gap-2">
            <Link
              href={{
                pathname: "/donde-comprar/[country]/[city]" as const,
                params: { country: countrySlug, city: params.city },
              }}
              className="inline-flex items-center gap-1.5 text-sm text-content-2 hover:text-content-0 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {cityName}
            </Link>
          </div>

          {/* Disclaimer */}
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
