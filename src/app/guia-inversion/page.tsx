import type { Metadata } from "next";
import Link from "next/link";
import { InvestmentComparison } from "@/components/guide/InvestmentComparison";
import {
  InvestmentMethodCard,
  INVESTMENT_METHODS,
} from "@/components/guide/InvestmentMethodCard";
import { EtfTable } from "@/components/guide/EtfTable";
import { FaqSection } from "@/components/guide/FaqSection";
import { FAQ_ITEMS } from "@/lib/data/faq-items";

export const metadata: Metadata = {
  title:
    "Cómo invertir en oro y metales preciosos — Guía completa | Metalorix",
  description:
    "Guía completa sobre las formas de invertir en oro, plata y platino: oro físico, caja fuerte, bóvedas en Suiza, ETFs, ETCs y derivados. Ventajas, inconvenientes y tabla comparativa de ETFs europeos.",
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: "https://metalorix.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Guía de inversión",
      item: "https://metalorix.com/guia-inversion",
    },
  ],
};

export default function GuiaInversionPage() {
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
              Inicio
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">Guía de inversión</span>
          </nav>

          {/* Hero */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            Cómo invertir en metales preciosos
          </h1>
          <p className="text-content-2 mb-12 max-w-3xl leading-relaxed">
            Existen múltiples formas de tener exposición al oro, plata y
            platino, cada una con su nivel de riesgo, coste y complejidad.
            Esta guía compara todas las opciones para que elijas la que
            mejor se adapta a tu perfil.
          </p>

          {/* Section 1: Comparison table */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-2">
              Comparativa rápida
            </h2>
            <p className="text-sm text-content-2 mb-5">
              Resumen de los principales métodos de inversión en metales
              preciosos.
            </p>
            <InvestmentComparison />
          </div>

          {/* Section 2: Method cards */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-2">
              Análisis detallado por método
            </h2>
            <p className="text-sm text-content-2 mb-6">
              Ventajas, inconvenientes, nivel de accesibilidad y coste
              estimado de cada opción.
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
              Principales ETFs y ETCs en Europa
            </h2>
            <p className="text-sm text-content-2 mb-5">
              Productos cotizados con respaldo físico disponibles en brókers
              europeos. Filtra por metal y ordena por cualquier columna.
            </p>
            <EtfTable />
            <p className="text-xs text-content-3 mt-3">
              Datos orientativos. TER y tamaño del fondo pueden variar.
              Consulta la ficha del producto antes de invertir.
            </p>
          </div>

          {/* Section 4: FAQ */}
          <div className="mb-16">
            <h2 className="text-xl font-bold text-content-0 mb-6">
              Preguntas frecuentes
            </h2>
            <FaqSection />
          </div>

          {/* Legal disclaimer */}
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h3 className="text-base font-semibold text-content-0 mb-3">
              Aviso legal
            </h3>
            <p className="text-xs text-content-3 leading-relaxed">
              Esta guía tiene carácter informativo y educativo. No constituye
              asesoramiento financiero, fiscal ni de inversión. Los datos de
              ETFs son orientativos y pueden no estar actualizados. Antes de
              tomar cualquier decisión de inversión, consulta con un asesor
              financiero cualificado. Metalorix no se responsabiliza de las
              decisiones de inversión tomadas en base a esta información.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
