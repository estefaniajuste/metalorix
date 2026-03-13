import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RoiCalculator } from "@/components/tools/RoiCalculator";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calculatorPage");
  return {
    title: t("title") + " — Metalorix",
    description: t("subtitle"),
    keywords: [
      "calculadora rentabilidad oro",
      "simulador inversión oro",
      "cuanto habría ganado invirtiendo en oro",
      "rentabilidad histórica oro",
      "invertir en oro rentabilidad",
      "calculadora inversión metales preciosos",
    ],
    alternates: {
      canonical: "https://metalorix.com/calculadora-rentabilidad",
    },
    openGraph: {
      title: t("title") + " — Metalorix",
      description: t("subtitle"),
      type: "website",
      url: "https://metalorix.com/calculadora-rentabilidad",
    },
  };
}

export default async function CalculadoraRentabilidadPage() {
  const t = await getTranslations("calculatorPage");
  const tc = await getTranslations("common");

  const bc = breadcrumbSchema([
    { name: t("breadcrumbTools"), path: "/herramientas" },
    { name: t("breadcrumb"), path: "/calculadora-rentabilidad" },
  ]);
  const app = softwareAppSchema({
    name: t("title") + " — Metalorix",
    description: t("subtitle"),
    path: "/calculadora-rentabilidad",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/herramientas"
            className="hover:text-content-1 transition-colors"
          >
            {t("breadcrumbTools")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("breadcrumb")}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>

        <RoiCalculator />

        {/* SEO content */}
        <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("isItWorth")}
          </h2>
          <p className="text-content-2 leading-relaxed mb-4">
            {t("isItWorthP1")}
          </p>
          <p className="text-content-2 leading-relaxed mb-4">
            {t("isItWorthP2")}
          </p>
          <p className="text-content-2 leading-relaxed">
            {t("isItWorthP3")}
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
