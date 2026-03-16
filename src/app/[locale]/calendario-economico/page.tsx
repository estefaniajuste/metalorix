import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { EconomicCalendar } from "@/components/tools/EconomicCalendar";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages");
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/calendario-economico");
  return {
    title: t("calendario.title"),
    description: t("calendario.description"),
    keywords: locale === "es"
      ? ["calendario económico oro", "FOMC oro", "reunión Fed tipos interés", "IPC inflación oro", "NFP nóminas no agrícolas", "BCE tipos interés", "eventos económicos metales preciosos"]
      : ["economic calendar gold", "FOMC gold", "Fed interest rate meeting", "CPI inflation gold", "NFP non-farm payrolls", "ECB interest rates", "economic events precious metals"],
    alternates,
    openGraph: {
      title: t("calendario.ogTitle"),
      description: t("calendario.ogDescription"),
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function CalendarioEconomicoPage() {
  const t = await getTranslations("calendarPage");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");

  const tp = await getTranslations("pages");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("breadcrumb"), path: "/calendario-economico" },
    ],
    tc("breadcrumbHome"),
    locale,
  );
  const page = webPageSchema({
    name: tp("calendario.title"),
    description: tp("calendario.description"),
    path: "/calendario-economico",
    locale,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }} />
      <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
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
