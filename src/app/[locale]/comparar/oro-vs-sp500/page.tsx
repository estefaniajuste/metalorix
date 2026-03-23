import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "comparisons" });
  const year = new Date().getFullYear();
  const title = `${t("sp500Title")} [${year}] — Metalorix`;
  const description = t("sp500Description");
  const alternates = getAlternates(locale, "/comparar/oro-vs-sp500");
  const kwEs = [
    "oro vs sp500",
    "oro vs s&p 500",
    "oro acciones comparación",
    "invertir oro o bolsa",
  ];
  const kwEn = [
    "gold vs s&p 500",
    "gold vs sp500",
    "gold vs stocks",
    "gold stock market comparison",
  ];
  return {
    title,
    description,
    keywords: locale === "es" ? kwEs : kwEn,
    alternates,
    openGraph: { title, description, type: "article", url: alternates.canonical },
  };
}

export default async function GoldVsSp500Page() {
  const locale = await getLocale();
  const t = await getTranslations("comparisons");
  const tc = await getTranslations("common");
  const goldSlug = getLocalizedMetalSlug("oro", locale);

  const metrics = [
    { label: t("metric.assetType"), gold: t("btc.goldType"), other: t("sp500.indexType") },
    { label: t("metric.history"), gold: t("btc.goldHistory"), other: t("sp500.indexHistory") },
    { label: t("metric.supply"), gold: t("btc.goldSupply"), other: t("sp500.indexSupply") },
    { label: t("metric.volatility"), gold: t("btc.goldVol"), other: t("sp500.indexVol") },
    { label: t("metric.regulation"), gold: t("btc.goldReg"), other: t("sp500.indexReg") },
    { label: t("metric.custody"), gold: t("btc.goldCustody"), other: t("sp500.indexCustody") },
    { label: t("metric.inflation"), gold: t("btc.goldInflation"), other: t("sp500.indexInflation") },
    { label: t("metric.returns"), gold: t("sp500.goldReturn"), other: t("sp500.indexReturn") },
  ];

  const bc = breadcrumbSchema(
    [{ name: t("sp500Title"), path: "/comparar/oro-vs-sp500" }],
    tc("breadcrumbHome"),
    locale,
  );
  const page = webPageSchema({
    name: t("sp500Title"),
    description: t("sp500Description"),
    path: "/comparar/oro-vs-sp500",
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
            <span className="text-content-1">{t("sp500Title")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("sp500Title")}
          </h1>
          <p className="text-content-2 mb-6 max-w-2xl leading-relaxed">{t("sp500Intro")}</p>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-3">{t("sp500.performanceTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed">{t("sp500.performanceText")}</p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden mb-10">
            <div className="grid grid-cols-3 text-sm font-semibold text-content-3 border-b border-border">
              <div className="p-4">{t("metric.label")}</div>
              <div className="p-4 text-center text-brand-gold">{t("goldLabel")}</div>
              <div className="p-4 text-center text-content-1">{t("sp500Label")}</div>
            </div>
            {metrics.map((m, i) => (
              <div key={i} className="grid grid-cols-3 text-sm border-b border-border/50 last:border-0">
                <div className="p-4 text-content-2 font-medium">{m.label}</div>
                <div className="p-4 text-center text-content-1">{m.gold}</div>
                <div className="p-4 text-center text-content-1">{m.other}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-lg font-bold text-brand-gold mb-3">{t("sp500.goldProsTitle")}</h2>
              <p className="text-sm text-content-2 leading-relaxed">{t("sp500.goldPros")}</p>
            </div>
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-lg font-bold text-content-0 mb-3">{t("sp500.sp500ProsTitle")}</h2>
              <p className="text-sm text-content-2 leading-relaxed">{t("sp500.sp500Pros")}</p>
            </div>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-3">{t("sp500.verdictTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed">{t("sp500.verdict")}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={{ pathname: "/precio/[metal]", params: { metal: goldSlug } }}
              className="text-sm font-medium text-brand-gold hover:underline"
            >
              {t("goldLabel")} — {t("livePrice")}
            </Link>
            <Link href="/comparar/oro-vs-bitcoin" className="text-sm font-medium text-brand-gold hover:underline">
              {t("btcTitle")}
            </Link>
            <Link href="/calculadora-rentabilidad" className="text-sm font-medium text-brand-gold hover:underline">
              {t("roiCalculatorLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
