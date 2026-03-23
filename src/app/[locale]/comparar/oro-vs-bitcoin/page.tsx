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
  const title = `${t("btcTitle")} [${year}] — Metalorix`;
  const description = t("btcDescription");
  const alternates = getAlternates(locale, "/comparar/oro-vs-bitcoin");
  const kwEs = [
    "oro vs bitcoin",
    "bitcoin vs oro",
    "invertir oro o bitcoin",
    "oro cripto comparación",
  ];
  const kwEn = [
    "gold vs bitcoin",
    "bitcoin vs gold",
    "gold or bitcoin investment",
    "gold crypto comparison",
  ];
  return {
    title,
    description,
    keywords: locale === "es" ? kwEs : kwEn,
    alternates,
    openGraph: { title, description, type: "article", url: alternates.canonical },
  };
}

export default async function GoldVsBitcoinPage() {
  const locale = await getLocale();
  const t = await getTranslations("comparisons");
  const tc = await getTranslations("common");
  const goldSlug = getLocalizedMetalSlug("oro", locale);

  const metrics = [
    { label: t("metric.assetType"), gold: t("btc.goldType"), other: t("btc.btcType") },
    { label: t("metric.history"), gold: t("btc.goldHistory"), other: t("btc.btcHistory") },
    { label: t("metric.supply"), gold: t("btc.goldSupply"), other: t("btc.btcSupply") },
    { label: t("metric.volatility"), gold: t("btc.goldVol"), other: t("btc.btcVol") },
    { label: t("metric.regulation"), gold: t("btc.goldReg"), other: t("btc.btcReg") },
    { label: t("metric.custody"), gold: t("btc.goldCustody"), other: t("btc.btcCustody") },
    { label: t("metric.inflation"), gold: t("btc.goldInflation"), other: t("btc.btcInflation") },
  ];

  const bc = breadcrumbSchema(
    [{ name: t("btcTitle"), path: "/comparar/oro-vs-bitcoin" }],
    tc("breadcrumbHome"),
    locale,
  );
  const page = webPageSchema({
    name: t("btcTitle"),
    description: t("btcDescription"),
    path: "/comparar/oro-vs-bitcoin",
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
            <span className="text-content-1">{t("btcTitle")}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("btcTitle")}
          </h1>
          <p className="text-content-2 mb-6 max-w-2xl leading-relaxed">{t("btcIntro")}</p>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-3">{t("btc.performanceTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed">{t("btc.performanceText")}</p>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden mb-10">
            <div className="grid grid-cols-3 text-sm font-semibold text-content-3 border-b border-border">
              <div className="p-4">{t("metric.label")}</div>
              <div className="p-4 text-center text-brand-gold">{t("goldLabel")}</div>
              <div className="p-4 text-center text-[#F7931A]">{t("btcLabel")}</div>
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
              <h2 className="text-lg font-bold text-brand-gold mb-3">{t("btc.goldProsTitle")}</h2>
              <p className="text-sm text-content-2 leading-relaxed">{t("btc.goldPros")}</p>
            </div>
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-lg font-bold text-[#F7931A] mb-3">{t("btc.btcProsTitle")}</h2>
              <p className="text-sm text-content-2 leading-relaxed">{t("btc.btcPros")}</p>
            </div>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-3">{t("btc.verdictTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed">{t("btc.verdict")}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={{ pathname: "/precio/[metal]", params: { metal: goldSlug } }}
              className="text-sm font-medium text-brand-gold hover:underline"
            >
              {t("goldLabel")} — {t("livePrice")}
            </Link>
            <Link href="/comparar/oro-vs-sp500" className="text-sm font-medium text-brand-gold hover:underline">
              {t("sp500Title")}
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
