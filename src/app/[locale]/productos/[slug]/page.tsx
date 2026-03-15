import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { PRODUCTS, getProduct, getLocalizedProducts } from "@/lib/data/products";
import { ProductSpotPrice } from "@/components/products/ProductSpotPrice";
import { TaxByCountrySelector } from "@/components/products/TaxByCountrySelector";
import type { MetalSymbol } from "@/lib/providers/metals";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const t = await getTranslations({ locale, namespace: "products" });
  const product = getProduct(slug, locale);
  if (!product) return { title: t("notFound") };

  const alternates = getAlternates(locale, {
    pathname: "/productos/[slug]",
    params: { slug: product.slug },
  });

  return {
    title: product.seo.title + " | Metalorix",
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

  const allProducts = getLocalizedProducts(locale);
  const relatedProducts = allProducts.filter(
    (p) => p.metal === product.metal && p.slug !== product.slug
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: productAlternates.canonical,
    brand: {
      "@type": "Brand",
      name: product.mint,
    },
    category: `${product.type === "moneda" ? t("typeCoin") : t("typeBar")} — ${product.metal === "oro" ? t("metalGold") : t("metalSilver")}`,
    material: product.metal === "oro" ? "Gold" : "Silver",
    weight: {
      "@type": "QuantitativeValue",
      value: product.grossWeightG,
      unitCode: "GRM",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: t("specPurity"),
        value: product.purityLabel,
      },
      {
        "@type": "PropertyValue",
        name: t("specFineWeight"),
        value: `${product.fineWeightOz} oz troy`,
      },
    ],
  };

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

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
