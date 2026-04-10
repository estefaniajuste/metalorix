import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates, buildMetaTitle } from "@/lib/seo/alternates";
import { getMetalSEO } from "@/lib/seo/metal-content";
import { Link } from "@/i18n/navigation";
import {
  resolveMetalSlug,
  getAllMetalSlugs,
  getLocalizedMetalSlug,
} from "@/lib/utils/metal-slugs";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";
import { SetLocalePathOverrides } from "@/components/layout/SetLocalePathOverrides";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllMetalSlugs().map((metal) => ({ metal }));
}

const YEARLY_DATA: Record<
  string,
  { year: number; open: string; close: string; high: string; low: string; change: string }[]
> = {
  oro: [
    { year: 2023, open: "$1,824", close: "$2,063", high: "$2,078", low: "$1,811", change: "+13.1%" },
    { year: 2024, open: "$2,063", close: "$2,624", high: "$2,790", low: "$2,015", change: "+27.2%" },
    { year: 2025, open: "$2,624", close: "$2,960", high: "$3,050", low: "$2,580", change: "+12.8%" },
    { year: 2026, open: "$2,960", close: "$3,020", high: "$3,100", low: "$2,900", change: "+2.0%" },
  ],
  plata: [
    { year: 2023, open: "$23.95", close: "$23.79", high: "$26.00", low: "$20.09", change: "-0.7%" },
    { year: 2024, open: "$23.79", close: "$29.24", high: "$34.87", low: "$22.11", change: "+22.9%" },
    { year: 2025, open: "$29.24", close: "$33.10", high: "$35.40", low: "$28.80", change: "+13.2%" },
    { year: 2026, open: "$33.10", close: "$34.20", high: "$35.00", low: "$32.50", change: "+3.3%" },
  ],
  platino: [
    { year: 2023, open: "$1,070", close: "$1,008", high: "$1,127", low: "$846", change: "-5.8%" },
    { year: 2024, open: "$1,008", close: "$949", high: "$1,095", low: "$896", change: "-5.9%" },
    { year: 2025, open: "$949", close: "$980", high: "$1,040", low: "$910", change: "+3.3%" },
    { year: 2026, open: "$980", close: "$995", high: "$1,020", low: "$960", change: "+1.5%" },
  ],
  paladio: [
    { year: 2023, open: "$1,798", close: "$1,098", high: "$1,832", low: "$952", change: "-38.9%" },
    { year: 2024, open: "$1,098", close: "$960", high: "$1,196", low: "$850", change: "-12.6%" },
    { year: 2025, open: "$960", close: "$990", high: "$1,100", low: "$870", change: "+3.1%" },
    { year: 2026, open: "$990", close: "$1,020", high: "$1,050", low: "$950", change: "+3.0%" },
  ],
  cobre: [
    { year: 2023, open: "$3.81", close: "$3.86", high: "$4.15", low: "$3.55", change: "+1.3%" },
    { year: 2024, open: "$3.86", close: "$4.03", high: "$5.20", low: "$3.82", change: "+4.4%" },
    { year: 2025, open: "$4.03", close: "$4.65", high: "$5.10", low: "$4.00", change: "+15.4%" },
    { year: 2026, open: "$4.65", close: "$4.78", high: "$4.95", low: "$4.50", change: "+2.8%" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string; metal: string };
}): Promise<Metadata> {
  const { locale, metal } = params;
  const t = await getTranslations({ locale, namespace: "historicalPrice" });
  const internalSlug = resolveMetalSlug(metal) ?? metal;
  const seo = getMetalSEO(internalSlug, locale);
  if (!seo) notFound();

  const year = new Date().getFullYear();
  const title = buildMetaTitle(`${t("title", { metal: seo.name })} [${year}]`, "—");
  const description = t("description", { metal: seo.name });

  const localizedSlug = getLocalizedMetalSlug(seo.slug, locale);
  const alternates = getAlternates(locale, {
    pathname: "/precio/[metal]/historico",
    params: { metal: localizedSlug },
  });

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates,
    openGraph: { title, description, type: "website", url: alternates.canonical },
  };
}

export default async function HistoricalPricePage({
  params,
}: {
  params: { locale: string; metal: string };
}) {
  const locale = await getLocale();
  const internalSlug = resolveMetalSlug(params.metal) ?? params.metal;
  const seo = getMetalSEO(internalSlug, locale);
  if (!seo) notFound();

  const t = await getTranslations("historicalPrice");
  const tc = await getTranslations("common");
  const localizedMetal = getLocalizedMetalSlug(seo.slug, locale);
  const yearlyData = YEARLY_DATA[seo.slug] ?? [];

  const localeHrefs: Record<string, { pathname: string; params: { metal: string } }> = {};
  for (const loc of routing.locales) {
    localeHrefs[loc] = {
      pathname: "/precio/[metal]/historico",
      params: { metal: getLocalizedMetalSlug(seo.slug, loc) },
    };
  }

  return (
    <section className="py-[var(--section-py)]">
      <SetLocalePathOverrides hrefs={localeHrefs} />
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={{ pathname: "/precio/[metal]" as const, params: { metal: localizedMetal } }}
            className="hover:text-content-1 transition-colors"
          >
            {seo.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("breadcrumb")}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
          {t("title", { metal: seo.name })}
        </h1>
        <p className="text-content-2 mb-8 max-w-2xl leading-relaxed">
          {t("description", { metal: seo.name })}
        </p>

        <div className="mb-10">
          <MetalPageContent symbol={seo.symbol} />
        </div>

        {yearlyData.length > 0 && (
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-xl font-bold text-content-0 mb-5">{t("yearlyPerformance")}</h2>
            <p className="text-xs text-content-3 mb-4 leading-relaxed">{t("yearlyTableDisclaimer")}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-content-3 font-medium py-3 pr-4">{t("year")}</th>
                    <th className="text-right text-content-3 font-medium py-3 px-3">{t("open")}</th>
                    <th className="text-right text-content-3 font-medium py-3 px-3">{t("close")}</th>
                    <th className="text-right text-content-3 font-medium py-3 px-3">{t("high")}</th>
                    <th className="text-right text-content-3 font-medium py-3 px-3">{t("low")}</th>
                    <th className="text-right text-content-3 font-medium py-3 pl-3">{t("change")}</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.map((row) => (
                    <tr key={row.year} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4 font-semibold text-content-0">{row.year}</td>
                      <td className="py-3 px-3 text-right text-content-1 tabular-nums">{row.open}</td>
                      <td className="py-3 px-3 text-right text-content-1 tabular-nums">{row.close}</td>
                      <td className="py-3 px-3 text-right text-content-1 tabular-nums">{row.high}</td>
                      <td className="py-3 px-3 text-right text-content-1 tabular-nums">{row.low}</td>
                      <td
                        className={`py-3 pl-3 text-right font-semibold tabular-nums ${
                          row.change.startsWith("+")
                            ? "text-signal-up"
                            : row.change.startsWith("-")
                              ? "text-signal-down"
                              : "text-content-1"
                        }`}
                      >
                        {row.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-lg font-bold text-content-0 mb-3">{t("factorsTitle", { metal: seo.name })}</h2>
          <p className="text-sm text-content-2 leading-relaxed">{t("factorsText", { metal: seo.name })}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={{ pathname: "/precio/[metal]" as const, params: { metal: localizedMetal } }}
            className="text-sm font-medium text-brand-gold hover:underline"
          >
            ← {seo.name} {t("livePrice")}
          </Link>
          <Link href="/calculadora-rentabilidad" className="text-sm font-medium text-brand-gold hover:underline">
            {t("roiTool", { metal: seo.name })}
          </Link>
        </div>
      </div>
    </section>
  );
}
