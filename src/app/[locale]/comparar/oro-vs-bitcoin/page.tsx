import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { Link } from "@/i18n/navigation";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo/schemas";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";

const GoldBtcDashboard = dynamic(
  () =>
    import("@/components/comparisons/GoldBtcDashboard").then(
      (m) => m.GoldBtcDashboard,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 mb-10 animate-shimmer h-[260px]" />
    ),
  },
);

const GoldBtcChart = dynamic(
  () =>
    import("@/components/comparisons/GoldBtcChart").then(
      (m) => m.GoldBtcChart,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="bg-surface-1 border border-border rounded-DEFAULT p-8 mb-10 animate-shimmer h-[440px]" />
    ),
  },
);

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
  const rawDesc = t("btcDescription");
  const description =
    rawDesc.length > 155
      ? rawDesc.slice(0, rawDesc.lastIndexOf(" ", 152)) + "…"
      : rawDesc;
  const alternates = getAlternates(locale, "/comparar/oro-vs-bitcoin");
  const kwEs = [
    "oro vs bitcoin",
    "bitcoin vs oro",
    "invertir oro o bitcoin",
    "oro cripto comparación",
    "ratio oro bitcoin",
  ];
  const kwEn = [
    "gold vs bitcoin",
    "bitcoin vs gold",
    "gold or bitcoin investment",
    "gold bitcoin ratio",
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

  const faqItems = Array.from({ length: 5 }, (_, i) => ({
    question: t(`faq${i + 1}Q`),
    answer: t(`faq${i + 1}A`),
  }));
  const faqLd = faqSchema(faqItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

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
          <p className="text-content-2 mb-8 max-w-2xl leading-relaxed">{t("btcIntro")}</p>

          {/* Live dashboard */}
          <GoldBtcDashboard />

          {/* Historical chart */}
          <GoldBtcChart />

          {/* Performance */}
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-3">{t("btc.performanceTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed">{t("btc.performanceText")}</p>
          </div>

          {/* Comparison table */}
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

          {/* Pros/cons */}
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

          {/* Verdict */}
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-3">{t("btc.verdictTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed">{t("btc.verdict")}</p>
          </div>

          {/* FAQ */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-content-0 mb-4">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <details
                  key={i}
                  className="group bg-surface-1 border border-border rounded-DEFAULT"
                >
                  <summary className="px-5 py-4 cursor-pointer text-sm font-medium text-content-0 flex items-center justify-between">
                    {item.question}
                    <span className="text-content-3 group-open:rotate-45 transition-transform text-lg leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-content-2 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Related links */}
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
            <Link href="/portfolio" className="text-sm font-medium text-brand-gold hover:underline">
              {t("portfolioLink")}
            </Link>
            <Link href="/precio-bitcoin" className="text-sm font-medium text-brand-gold hover:underline">
              {t("btcPriceLink")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
