import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { InvestmentComparison } from "@/components/guide/InvestmentComparison";

export const revalidate = 86400;
import {
  InvestmentMethodCard,
  INVESTMENT_METHODS,
} from "@/components/guide/InvestmentMethodCard";
import { EtfTable } from "@/components/guide/EtfTable";
import { FaqSection } from "@/components/guide/FaqSection";
import { FAQ_ITEMS } from "@/lib/data/faq-items";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("guide");
  return {
    title: t("title") + " | Metalorix",
    description: t("subtitle"),
    keywords: [
      "cómo invertir en oro",
      "ETF oro Europa",
      "oro físico vs ETF",
      "comprar oro seguro",
      "mejores ETF oro",
      "invertir en plata",
      "oro en Suiza",
      "Xetra-Gold",
      "Invesco Physical Gold",
      "guía inversión metales preciosos",
    ],
    openGraph: {
      title: "Cómo invertir en oro y metales preciosos — Guía completa",
      description:
        "Compara las diferentes formas de invertir en metales preciosos: oro físico, bóvedas, ETFs y más. Con tabla de ETFs europeos.",
      type: "website",
      url: "https://metalorix.com/guia-inversion",
    },
    alternates: {
      canonical: "https://metalorix.com/guia-inversion",
    },
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default async function GuiaInversionPage() {
  const t = await getTranslations("guide");
  const tc = await getTranslations("common");

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
        item: "https://metalorix.com/guia-inversion",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {INVESTMENT_METHODS.map((method) => (
                <InvestmentMethodCard key={method.title} method={method} />
              ))}
            </div>
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
              {t("faqTitle")}
            </h2>
            <FaqSection />
          </div>

          {/* Legal disclaimer */}
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h3 className="text-base font-semibold text-content-0 mb-3">
              {t("legalTitle")}
            </h3>
            <p className="text-xs text-content-3 leading-relaxed">
              {t("legalText")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
