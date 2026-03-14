import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { InvestmentComparison } from "@/components/guide/InvestmentComparison";

export const revalidate = 86400;
import { InvestmentMethodsList } from "@/components/guide/InvestmentMethodCard";
import { EtfTable } from "@/components/guide/EtfTable";
import { FaqSection } from "@/components/guide/FaqSection";
import { getFaqItems } from "@/lib/data/faq-items";
import {
  breadcrumbSchema as breadcrumbSchemaFn,
  faqSchema as faqSchemaFn,
} from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";

const SEO_KEYWORDS: Record<string, string[]> = {
  es: [
    "cómo invertir en oro", "ETF oro Europa", "oro físico vs ETF",
    "comprar oro seguro", "mejores ETF oro", "invertir en plata",
    "oro en Suiza", "Xetra-Gold", "Invesco Physical Gold",
    "guía inversión metales preciosos",
  ],
  en: [
    "how to invest in gold", "gold ETF Europe", "physical gold vs ETF",
    "buy gold safely", "best gold ETFs", "invest in silver",
    "gold in Switzerland", "Xetra-Gold", "Invesco Physical Gold",
    "precious metals investment guide",
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide");
  const locale = await getLocale();
  return {
    title: t("title") + " — Metalorix",
    description: t("subtitle"),
    keywords: SEO_KEYWORDS[locale] || SEO_KEYWORDS.es,
    openGraph: {
      title: t("title") + " — Metalorix",
      description: t("subtitle"),
      type: "website",
      url: "https://metalorix.com/guia-inversion",
    },
    alternates: {
      canonical: "https://metalorix.com/guia-inversion",
    },
  };
}

export default async function GuiaInversionPage() {
  const t = await getTranslations("guide");
  const tc = await getTranslations("common");

  const bc = breadcrumbSchemaFn(
    [{ name: t("breadcrumb"), path: "/guia-inversion" }],
    tc("breadcrumbHome"),
  );
  const locale = await getLocale();
  const faqItems = getFaqItems(locale);
  const faq = faqSchemaFn(
    faqItems.map((item) => ({ question: item.question, answer: item.answer })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("breadcrumb")}</span>
          </nav>

          {/* Hero */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-content-2 mb-12 max-w-3xl leading-relaxed">
            {t("subtitle")}
          </p>

          {/* Section 1: Comparison table */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-2">
              {t("quickComparison")}
            </h2>
            <p className="text-sm text-content-2 mb-5">
              {t("quickComparisonDesc")}
            </p>
            <InvestmentComparison />
          </div>

          {/* Section 2: Method cards */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-2">
              {t("detailedAnalysis")}
            </h2>
            <p className="text-sm text-content-2 mb-6">
              {t("detailedAnalysisDesc")}
            </p>
            <InvestmentMethodsList />
          </div>

          {/* Section 3: ETF table */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-2">
              {t("etfTitle")}
            </h2>
            <p className="text-sm text-content-2 mb-5">
              {t("etfDesc")}
            </p>
            <EtfTable />
            <p className="text-xs text-content-3 mt-3">
              {t("etfDisclaimer")}
            </p>
          </div>

          {/* Section 4: FAQ */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-6">
              {t("faq")}
            </h2>
            <FaqSection />
          </div>

          {/* Legal disclaimer */}
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h3 className="text-base font-semibold text-content-0 mb-3">
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
