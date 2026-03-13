import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EconomicCalendar } from "@/components/tools/EconomicCalendar";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Calendario económico para metales preciosos — FOMC, BCE, IPC, NFP | Metalorix",
  description:
    "Calendario de eventos económicos clave que mueven el precio del oro, plata y platino. Reuniones Fed (FOMC), BCE, datos de inflación (IPC), empleo (NFP) y más.",
  keywords: [
    "calendario económico oro",
    "FOMC oro",
    "reunión Fed tipos interés",
    "IPC inflación oro",
    "NFP nóminas no agrícolas",
    "BCE tipos interés",
    "eventos económicos metales preciosos",
  ],
  alternates: {
    canonical: "https://metalorix.com/calendario-economico",
  },
  openGraph: {
    title: "Calendario económico para metales preciosos — Metalorix",
    description:
      "Eventos clave que mueven los precios del oro: FOMC, BCE, IPC, NFP y más.",
    type: "website",
    url: "https://metalorix.com/calendario-economico",
  },
};

export default async function CalendarioEconomicoPage() {
  const t = await getTranslations("calendarPage");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");

  const bc = breadcrumbSchema([
    { name: "Herramientas", path: "/herramientas" },
    { name: "Calendario económico", path: "/calendario-economico" },
  ]);
  const page = webPageSchema({
    name: "Calendario económico para metales preciosos",
    description: "Eventos económicos clave que mueven el precio del oro, plata y platino: FOMC, BCE, IPC, NFP.",
    path: "/calendario-economico",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }} />
      <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/herramientas" className="hover:text-content-1 transition-colors">
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

        <EconomicCalendar />

        <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6">
          <h2 className="text-xl font-bold text-content-0 mb-4">
            {t("whyFollow")}
          </h2>
          <p className="text-content-2 text-sm leading-relaxed mb-4">
            {t("whyFollowP1")}
          </p>
          <p className="text-content-2 text-sm leading-relaxed">
            {t("whyFollowP2")}
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
