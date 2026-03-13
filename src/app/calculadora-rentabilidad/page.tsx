import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { RoiCalculator } from "@/components/tools/RoiCalculator";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title:
    "Calculadora de rentabilidad del oro, plata y platino — Metalorix",
  description:
    "Calcula cuánto habrías ganado invirtiendo en oro, plata o platino. Simulador con datos reales desde el año 2000.",
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
    title: "Calculadora de rentabilidad — Metalorix",
    description:
      "¿Cuánto habrías ganado invirtiendo en oro? Calcula la rentabilidad con datos reales.",
    type: "website",
    url: "https://metalorix.com/calculadora-rentabilidad",
  },
};

export default async function CalculadoraRentabilidadPage() {
  const t = await getTranslations("roiCalc");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");

  const bc = breadcrumbSchema([
    { name: "Herramientas", path: "/herramientas" },
    { name: "Calculadora de rentabilidad", path: "/calculadora-rentabilidad" },
  ]);
  const app = softwareAppSchema({
    name: "Calculadora de rentabilidad — Metalorix",
    description: "Calcula cuánto habrías ganado invirtiendo en oro, plata o platino con datos reales.",
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
            {tt("title")}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{tt("roiCalculator")}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          {tt("roiCalculator")}
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          {tt("roiDesc")}
        </p>

        <RoiCalculator />

        {/* SEO content */}
        <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("isProfitable")}
          </h2>
          <p className="text-content-2 leading-relaxed mb-4">
            {t("profitableP1")}
          </p>
          <p className="text-content-2 leading-relaxed mb-4">
            {t("profitableP2")}
          </p>
          <p className="text-content-2 leading-relaxed">
            {t("profitableP3")}
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
