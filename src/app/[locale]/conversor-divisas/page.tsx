import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { MultiCurrencyTable } from "@/components/tools/MultiCurrencyTable";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";
import { getAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("conversor.title"),
    description: t("conversor.description"),
    keywords: locale === "en"
      ? ["gold price in euros", "gold price in pounds", "gold gram price euros", "gold price EUR", "platinum price euros", "silver price euros", "gold currency converter"]
      : ["precio oro en euros", "precio oro en libras", "precio gramo oro euros", "gold price eur", "precio platino euros", "precio plata euros", "conversor divisas oro"],
    alternates: getAlternates(locale, "/conversor-divisas"),
    openGraph: {
      title: t("conversor.ogTitle"),
      description: t("conversor.ogDescription"),
      type: "website",
      url: "https://metalorix.com/conversor-divisas",
    },
  };
}

export default async function ConversorDivisasPage() {
  const t = await getTranslations("currencyConverter");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");

  const tp = await getTranslations("pages");

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("breadcrumb"), path: "/conversor-divisas" },
    ],
    tc("breadcrumbHome"),
  );
  const app = softwareAppSchema({
    name: tp("conversor.ogTitle"),
    description: tp("conversor.description"),
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
