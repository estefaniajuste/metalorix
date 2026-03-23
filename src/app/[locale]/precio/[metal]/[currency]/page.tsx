import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getMetalSEO } from "@/lib/seo/metal-content";
import { Link } from "@/i18n/navigation";
import {
  resolveMetalSlug,
  getAllMetalSlugs,
  getLocalizedMetalSlug,
} from "@/lib/utils/metal-slugs";
import {
  getCurrencyBySlug,
  CURRENCY_PAGES,
} from "@/lib/data/currency-pages";
import { CurrencyPriceDisplay } from "@/components/dashboard/CurrencyPriceDisplay";
import type { Locale } from "@/i18n/routing";

export const revalidate = 60;

export function generateStaticParams() {
  const params: { metal: string; currency: string }[] = [];
  for (const metalSlug of getAllMetalSlugs()) {
    for (const curr of CURRENCY_PAGES) {
      params.push({ metal: metalSlug, currency: curr.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; metal: string; currency: string };
}): Promise<Metadata> {
  const { locale, metal, currency: currSlug } = params;
  const t = await getTranslations({ locale, namespace: "currencyPrice" });
  const internalSlug = resolveMetalSlug(metal) ?? metal;
  const seo = getMetalSEO(internalSlug, locale);
  const curr = getCurrencyBySlug(currSlug);
  if (!seo || !curr) return { title: "Not Found" };

  const year = new Date().getFullYear();
  const currName = curr.names[locale] || curr.names.en;
  const title = `${t("title", { metal: seo.name, currency: currName })} [${year}] — Metalorix`;
  const description = t("description", {
    metal: seo.name,
    currency: currName,
    code: curr.code,
  });

  const localizedMetal = getLocalizedMetalSlug(seo.slug, locale);
  const alternates = getAlternates(locale, (loc: Locale) => ({
    pathname: "/precio/[metal]/[currency]" as const,
    params: {
      metal: getLocalizedMetalSlug(seo.slug, loc),
      currency: curr.slug,
    },
  }));

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: alternates.canonical },
    alternates,
  };
}

export default async function CurrencyPricePage({
  params,
}: {
  params: { locale: string; metal: string; currency: string };
}) {
  const locale = await getLocale();
  const internalSlug = resolveMetalSlug(params.metal) ?? params.metal;
  const seo = getMetalSEO(internalSlug, locale);
  const curr = getCurrencyBySlug(params.currency);
  if (!seo || !curr) notFound();

  const t = await getTranslations("currencyPrice");
  const tc = await getTranslations("common");
  const currName = curr.names[locale] || curr.names.en;
  const localizedMetal = getLocalizedMetalSlug(seo.slug, locale);

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav
          className="text-sm text-content-3 mb-6"
          aria-label={tc("breadcrumbNav")}
        >
          <Link
            href="/"
            className="hover:text-content-1 transition-colors"
          >
            {tc("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={{
              pathname: "/precio/[metal]" as const,
              params: { metal: localizedMetal },
            }}
            className="hover:text-content-1 transition-colors"
          >
            {seo.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{currName}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
          {t("title", { metal: seo.name, currency: currName })}
        </h1>
        <p className="text-content-2 mb-8 max-w-2xl leading-relaxed">
          {t("description", {
            metal: seo.name,
            currency: currName,
            code: curr.code,
          })}
        </p>

        <CurrencyPriceDisplay
          symbol={seo.symbol}
          currencyCode={curr.code}
          currencySymbol={curr.symbols}
          isLb={seo.symbol === "HG"}
          labels={{
            perOz: t("perOz", { currency: curr.code }),
            perGram: t("perGram", { currency: curr.code }),
            perKilo: t("perKilo", { currency: curr.code }),
            unit: t("unit"),
            loading: tc("loading"),
          }}
        />

        <div className="mt-8 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-lg font-bold text-content-0 mb-3">
            {t("whyTitle", { metal: seo.name, currency: currName })}
          </h2>
          <p className="text-sm text-content-2 leading-relaxed">
            {t("whyText", {
              metal: seo.name,
              currency: currName,
              code: curr.code,
            })}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={{
              pathname: "/precio/[metal]" as const,
              params: { metal: localizedMetal },
            }}
            className="text-sm font-medium text-brand-gold hover:underline"
          >
            ← {seo.name} (USD)
          </Link>
          <Link
            href="/conversor-divisas"
            className="text-sm font-medium text-brand-gold hover:underline"
          >
            {t("allCurrencies")}
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="text-base font-semibold text-content-3 mb-3">
            {t("otherCurrencies")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {CURRENCY_PAGES.filter((c) => c.slug !== curr.slug).map((c) => (
              <Link
                key={c.slug}
                href={{
                  pathname: "/precio/[metal]/[currency]" as const,
                  params: { metal: localizedMetal, currency: c.slug },
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-content-2 hover:text-brand-gold hover:border-brand-gold transition-colors"
              >
                {seo.name} → {c.code}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
