import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EconomicCalendar } from "@/components/tools/EconomicCalendar";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calendarPage");
  return {
    title: t("title") + " — Metalorix",
    description: t("subtitle"),
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
      title: t("title") + " — Metalorix",
      description: t("subtitle"),
      type: "website",
      url: "https://metalorix.com/calendario-economico",
    },
  };
}

export default async function CalendarioEconomicoPage() {
  const t = await getTranslations("calendarPage");
  const tc = await getTranslations("common");

  const bc = breadcrumbSchema([
    { name: t("breadcrumbTools"), path: "/herramientas" },
    { name: t("breadcrumb"), path: "/calendario-economico" },
  ]);
  const page = webPageSchema({
    name: t("title"),
    description: t("subtitle"),
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
