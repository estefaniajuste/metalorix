import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MultiCurrencyTable } from "@/components/tools/MultiCurrencyTable";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Precio del oro en euros, libras, francos y más divisas — Metalorix",
  description:
    "Precio del oro, plata y platino en 11 divisas: EUR, GBP, CHF, JPY, AUD, CAD, CNY, INR, MXN, BRL. Por onza, gramo y kilogramo.",
  keywords: [
    "precio oro en euros",
    "precio oro en libras",
    "precio gramo oro euros",
    "gold price eur",
    "precio platino euros",
    "precio plata euros",
    "conversor divisas oro",
  ],
  alternates: {
    canonical: "https://metalorix.com/conversor-divisas",
  },
  openGraph: {
    title: "Precio del oro en diferentes divisas — Metalorix",
    description:
      "Consulta el precio del oro, plata y platino en EUR, GBP, CHF, JPY y más divisas.",
    type: "website",
    url: "https://metalorix.com/conversor-divisas",
  },
};

export default async function ConversorDivisasPage() {
  const t = await getTranslations("currencyConverter");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");

  const bc = breadcrumbSchema([
    { name: "Herramientas", path: "/herramientas" },
    { name: "Conversor divisas", path: "/conversor-divisas" },
  ]);
  const app = softwareAppSchema({
    name: "Conversor multi-divisa — Metalorix",
    description: "Precio del oro, plata y platino en EUR, GBP, CHF, JPY y más divisas. Por onza, gramo y kilogramo.",
    path: "/conversor-divisas",
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
          <span className="text-content-1">{t("breadcrumb")}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          {t("title")}
        </h1>
        <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
          {t("subtitle")}
        </p>

        <MultiCurrencyTable />

        {/* SEO content */}
        <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("whyCurrency")}
          </h2>
          <p className="text-content-2 leading-relaxed mb-4">
            {t("whyCurrencyP1")}
          </p>
          <p className="text-content-2 leading-relaxed">
            {t("whyCurrencyP2")}
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
