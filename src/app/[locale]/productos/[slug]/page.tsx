import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates, buildMetaTitle } from "@/lib/seo/alternates";
import { PRODUCTS, getProduct, getLocalizedProducts } from "@/lib/data/products";
import { getAllLocalizedSlugsForBase, getBaseProductSlug } from "@/lib/data/product-slugs";
import { ProductSpotPrice } from "@/components/products/ProductSpotPrice";
import { TaxByCountrySelector } from "@/components/products/TaxByCountrySelector";
import type { MetalSymbol } from "@/lib/providers/metals";
import { DEALER_COUNTRIES, getDealersByCountry, getCountryName } from "@/lib/data/dealers";
import { getProductSlugsByLocale } from "@/lib/data/product-slugs";
import { SetLocalePathOverrides } from "@/components/layout/SetLocalePathOverrides";
import { routing, type Locale } from "@/i18n/routing";
import { getSpotPrices } from "@/lib/providers/spot-prices";
import { productSchema } from "@/lib/seo/schemas";

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const p of PRODUCTS) {
    for (const slug of getAllLocalizedSlugsForBase(p.slug)) {
      params.push({ slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "products" });
  const product = getProduct(slug, locale);
  if (!product) notFound();

  const baseSlug = getBaseProductSlug(slug, locale);
  const slugsByLocale = getProductSlugsByLocale(baseSlug);
  const alternates = getAlternates(locale, (loc: Locale) => ({
    pathname: "/productos/[slug]" as const,
    params: { slug: slugsByLocale[loc] ?? baseSlug },
  }));

  return {
    title: buildMetaTitle(product.seo.title),
    description: product.seo.description,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: "website",
      url: alternates.canonical,
    },
    alternates,
  };
}

interface WhereToBuyCardProps {
  locale: string;
  t: Awaited<ReturnType<typeof getTranslations<"products">>>;
}

function WhereToBuyCard({ locale, t }: WhereToBuyCardProps) {
  const featured = DEALER_COUNTRIES.filter((c) => getDealersByCountry(c.code).length > 0).slice(0, 6);

  return (
    <div className="bg-surface-1 border border-border rounded-DEFAULT p-5">
      <div className="flex items-center gap-2 mb-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D6B35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <h3 className="text-base font-semibold text-content-0">{t("whereToBuyTitle")}</h3>
      </div>
      <p className="text-xs text-content-3 mb-4">{t("whereToBuyDesc")}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {featured.map((country) => {
          const slug = country.slug[locale] ?? country.slug.en;
          const name = getCountryName(country, locale);
          return (
            <Link
              key={country.code}
              href={{ pathname: "/donde-comprar/[country]" as const, params: { country: slug } }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2 border border-border hover:border-brand-gold/30 transition-colors text-xs text-content-1"
            >
              <span aria-hidden="true">{country.flagEmoji}</span>
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
      <Link
        href="/donde-comprar"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:underline"
      >
        {t("whereToBuyCta")}
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 text-signal-up mt-0.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="flex-shrink-0 text-brand-gold mt-0.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default async function ProductoPage({
  params,
}: {
  params: { slug: string };
}) {
  const t = await getTranslations("products");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const product = getProduct(params.slug, locale);
  if (!product) notFound();

  const baseSlug = getBaseProductSlug(params.slug, locale);

  const allProducts = getLocalizedProducts(locale);
  const relatedProducts = allProducts.filter(
    (p) => {
      const pBase = getBaseProductSlug(p.slug, locale);
      return p.metal === product.metal && pBase !== baseSlug;
    }
  ).slice(0, 3);

  const metalColor = product.metal === "oro" ? "#D6B35A" : "#A7B0BE";
  const metalBadge =
    product.metal === "oro"
      ? "bg-[rgba(214,179,90,0.12)] text-brand-gold"
      : "bg-[rgba(167,176,190,0.12)] text-[#A7B0BE]";

  const productsAlternates = getAlternates(locale, "/productos");
  const productAlternates = getAlternates(locale, {
    pathname: "/productos/[slug]",
    params: { slug: product.slug },
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tc("breadcrumbHome"),
        item: "https://metalorix.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb"),
        item: productsAlternates.canonical,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productAlternates.canonical,
      },
    ],
  };

  let productJsonLd: Record<string, unknown> | null = null;
  try {
    const { prices } = await getSpotPrices();
    const metalSpot = prices.find((p) => p.symbol === product.symbol);
    if (metalSpot) {
      const metalValue = metalSpot.price * product.fineWeightOz;
      productJsonLd = productSchema({
        name: product.name,
        description: product.description.slice(0, 300),
        brand: product.mint,
        url: productAlternates.canonical as string,
        weightG: product.grossWeightG,
        material: product.metal === "oro" ? "Gold" : "Silver",
        priceCurrency: "USD",
        price: metalValue,
        countryOfOrigin: product.country,
      });
    }
  } catch {
    /* spot price unavailable — skip Product schema */
  }

  const specs = [
    { label: t("specType"), value: product.type === "moneda" ? t("typeCoin") : t("typeBar") },
    { label: t("specMetal"), value: product.metal === "oro" ? t("metalGold") : t("metalSilver") },
    { label: t("specCountry"), value: product.country },
    { label: t("specManufacturer"), value: product.mint },
    { label: t("specMinting"), value: product.year },
    { label: t("specPurity"), value: product.purityLabel },
    { label: t("specFineWeight"), value: `${product.fineWeightOz} oz troy` },
    { label: t("specGrossWeight"), value: `${product.grossWeightG} g` },
    ...(product.diameter ? [{ label: t("specDiameter"), value: `${product.diameter} mm` }] : []),
    ...(product.thickness ? [{ label: t("specThickness"), value: `${product.thickness} mm` }] : []),
    { label: t("specPremium"), value: product.premiumRange + " " + t("specOverSpot") },
    { label: t("specLiquidity"), value: product.liquidity },
  ];

  const slugsByLocale = getProductSlugsByLocale(baseSlug);
  const localeHrefs: Record<string, { pathname: string; params: { slug: string } }> = {};
  for (const loc of routing.locales) {
    localeHrefs[loc] = {
      pathname: "/productos/[slug]",
      params: { slug: slugsByLocale[loc] ?? baseSlug },
    };
  }

  return (
    <>
      <SetLocalePathOverrides hrefs={localeHrefs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
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
              href="/productos"
              className="hover:text-content-1 transition-colors"
            >
              {t("breadcrumb")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{product.shortName}</span>
          </nav>

          {/* Header */}
          <div className="flex items-start gap-4 flex-wrap mb-3">
            <div className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: metalColor }}
              />
              <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight">
                {product.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${metalBadge}`}
            >
              {product.metal}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
              {product.type === "moneda" ? t("typeCoin") : t("typeBar")}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
              {product.country}
            </span>
            {product.investmentGold && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-signal-up-bg text-signal-up">
                {t("investmentGold")}
              </span>
            )}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: description + specs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h2 className="text-xl font-bold text-content-0 mb-4">
                  {t("description")}
                </h2>
                <p className="text-content-2 leading-relaxed mb-6">
                  {product.description}
                </p>

                <h3 className="text-base font-semibold text-content-0 mb-3">
                  {t("highlights")}
                </h3>
                <ul className="space-y-3">
                  {product.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-sm text-content-1 leading-relaxed"
                    >
                      <CheckIcon />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specs table */}
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h2 className="text-xl font-bold text-content-0 mb-4">
                  {t("specifications")}
                </h2>
                <div className="divide-y divide-border">
                  {specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <span className="text-content-3">{spec.label}</span>
                      <span className="font-medium text-content-1 text-right">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideal for */}
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <div className="flex items-start gap-3">
                  <InfoIcon />
                  <div>
                    <h3 className="text-base font-semibold text-content-0 mb-2">
                      {t("idealFor")}
                    </h3>
                    <p className="text-sm text-content-2 leading-relaxed">
                      {product.idealFor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: spot price + tax + related */}
            <div className="space-y-6">
              {/* Live spot price */}
              <ProductSpotPrice
                symbol={product.symbol as MetalSymbol}
                fineWeightOz={product.fineWeightOz}
                metalName={product.metal === "oro" ? t("metalGold") : t("metalSilver")}
              />

              {/* Tax card — per-country selector */}
              <TaxByCountrySelector
                isInvestmentGold={product.investmentGold}
                metal={product.metal}
              />

              {/* Where to buy */}
              <WhereToBuyCard locale={locale} t={t} />

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                  <h3 className="text-base font-semibold text-content-0 mb-4">
                    {t("otherProducts", { metal: product.metal })}
                  </h3>
                  <div className="space-y-3">
                    {relatedProducts.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={{ pathname: "/productos/[slug]" as const, params: { slug: rp.slug } }}
                        className="flex items-center gap-3 p-3 rounded-sm hover:bg-surface-2 transition-colors group"
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: metalColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-content-0 group-hover:text-brand-gold transition-colors truncate">
                            {rp.shortName}
                          </div>
                          <div className="text-xs text-content-3">
                            {rp.purityLabel.split(" ")[0]} · {rp.premiumRange}
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-content-3 group-hover:text-content-1 transition-colors flex-shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/productos"
                    className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-content-3 hover:text-brand-gold transition-colors"
                  >
                    {t("viewAll")}
                    <svg
                      className="w-3 h-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
                <h3 className="text-base font-semibold text-content-0 mb-3">
                  {t("disclaimer")}
                </h3>
                <p className="text-xs text-content-3 leading-relaxed">
                  {t("disclaimerText")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
