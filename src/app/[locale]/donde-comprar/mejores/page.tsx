import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  DEALERS,
  DEALER_COUNTRIES,
  getCountryName,
} from "@/lib/data/dealers";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";

export const revalidate = 86400;

const METAL_LABELS: Record<string, string> = {
  XAU: "Au",
  XAG: "Ag",
  XPT: "Pt",
  XPD: "Pd",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("dealers");
  const alternates = getAlternates(locale, "/donde-comprar/mejores");

  return {
    title: t("bestTitle") + " — Metalorix",
    description: t("bestDesc"),
    keywords: t("bestSeoKeywords"),
    alternates,
    openGraph: {
      title: t("bestTitle") + " — Metalorix",
      description: t("bestDesc"),
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function MejoresDealersPage() {
  const locale = await getLocale();
  const t = await getTranslations("dealers");
  const tc = await getTranslations("common");

  const verifiedDealers = DEALERS.filter((d) => d.verified);
  const onlineDealers = verifiedDealers.filter(
    (d) => d.type === "online" || d.type === "both"
  );
  const physicalDealers = verifiedDealers.filter(
    (d) => d.type === "physical" || d.type === "both"
  );

  const getCountry = (code: string) =>
    DEALER_COUNTRIES.find((c) => c.code === code);

  const bc = breadcrumbSchema(
    [
      { name: t("breadcrumb"), path: "/donde-comprar" },
      { name: t("bestBreadcrumb"), path: "/donde-comprar/mejores" },
    ],
    tc("breadcrumbHome"),
    locale
  );

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("bestTitle"),
    description: t("bestDesc"),
    numberOfItems: verifiedDealers.length,
    itemListElement: verifiedDealers.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: d.name,
      url: d.website,
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
            <span className="text-content-1">{t("bestBreadcrumb")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("bestTitle")}
          </h1>
          <p className="text-content-2 mb-10 max-w-3xl leading-relaxed">
            {t("bestDesc")}
          </p>

          {/* Criteria cards */}
          <div className="mb-12">
            <h2 className="text-lg font-bold text-content-0 mb-5">
              {t("bestCriteriaTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                      <line x1="12" y1="12" x2="12" y2="16" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                    </svg>
                  ),
                  text: t("bestCriteriaRegulation"),
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  text: t("bestCriteriaLBMA"),
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                  text: t("bestCriteriaReputation"),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-DEFAULT bg-surface-1 border border-border"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    {item.icon}
                  </div>
                  <p className="text-sm text-content-1 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-content-3 mt-4 leading-relaxed max-w-3xl">
              {t("bestIntro")}
            </p>
          </div>

          {/* Online section */}
          <DealerSection
            title={t("bestSectionOnline")}
            dealers={onlineDealers}
            locale={locale}
            t={t}
            getCountry={getCountry}
          />

          {/* Physical / mints section */}
          <DealerSection
            title={t("bestSectionPhysical")}
            dealers={physicalDealers}
            locale={locale}
            t={t}
            getCountry={getCountry}
          />

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

type TFunc = Awaited<ReturnType<typeof getTranslations<"dealers">>>;

function DealerSection({
  title,
  dealers,
  locale,
  t,
  getCountry,
}: {
  title: string;
  dealers: ReturnType<typeof DEALERS.filter>;
  locale: string;
  t: TFunc;
  getCountry: (code: string) => ReturnType<typeof DEALER_COUNTRIES.find>;
}) {
  if (dealers.length === 0) return null;

  const TYPE_STYLES: Record<string, string> = {
    online: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    physical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    both: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const TYPE_LABELS: Record<string, string> = {
    online: t("typeOnline"),
    physical: t("typePhysical"),
    both: t("typeBoth"),
  };

  return (
    <div className="mb-12">
      <h2 className="text-lg font-bold text-content-0 mb-5">{title}</h2>
      <div className="overflow-x-auto rounded-DEFAULT border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-2 border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider">
                {t("bestTableDealer")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider hidden sm:table-cell">
                {t("bestTableCountry")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider hidden md:table-cell">
                {t("bestTableType")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider hidden md:table-cell">
                {t("bestTableMetals")}
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider">
                {t("bestTableVerified")}
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-content-3 uppercase tracking-wider">
                {t("bestTableVisit")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {dealers.map((dealer) => {
              const country = getCountry(dealer.countryCode);
              const countryName = country
                ? getCountryName(country, locale)
                : dealer.countryCode.toUpperCase();
              const countrySlug = country?.slug[locale] ?? country?.slug.en;

              return (
                <tr
                  key={dealer.id}
                  className="bg-surface-1 hover:bg-surface-2 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center flex-shrink-0 text-sm font-bold text-content-2">
                        {dealer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-content-0">
                          {dealer.name}
                        </div>
                        {dealer.city && (
                          <div className="text-xs text-content-3">
                            {dealer.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {country && countrySlug ? (
                      <Link
                        href={{
                          pathname: "/donde-comprar/[country]" as const,
                          params: { country: countrySlug },
                        }}
                        className="flex items-center gap-1.5 text-content-2 hover:text-content-0 transition-colors"
                      >
                        <span>{country.flagEmoji}</span>
                        <span className="text-xs">{countryName}</span>
                      </Link>
                    ) : (
                      <span className="text-xs text-content-3">
                        {countryName}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${TYPE_STYLES[dealer.type]}`}
                    >
                      {TYPE_LABELS[dealer.type]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {dealer.metals.map((m) => (
                        <span
                          key={m}
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-surface-2 text-content-2"
                        >
                          {METAL_LABELS[m] ?? m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {dealer.verified && (
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400"
                        title={t("verified")}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {dealer.website && (
                      <a
                        href={dealer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors"
                      >
                        {t("bestTableVisit")}
                        <svg
                          width="10"
                          height="10"
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
