import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema, faqSchema } from "@/lib/seo/schemas";

export const revalidate = 3600;
import { Link } from "@/i18n/navigation";

const FearGreedGauge = dynamic(
  () => import("@/components/tools/FearGreedGauge").then((m) => m.FearGreedGauge),
  { ssr: false, loading: () => <div className="h-[400px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" /> }
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "fearGreedPage" });
  const rawDesc = t("metaDesc");
  const metaDesc = rawDesc.length > 155
    ? (rawDesc.slice(0, 155).lastIndexOf(".") > 90
      ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(".") + 1)
      : rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")))
    : rawDesc;
  return {
    title: t("metaTitle"),
    description: metaDesc,
    keywords: locale === "es"
      ? ["índice miedo y codicia metales preciosos", "sentimiento mercado oro", "indicador miedo codicia oro", "fear greed index oro", "sentimiento inversor metales"]
      : locale === "de"
      ? ["Angst Gier Index Edelmetalle", "Goldmarkt Stimmung", "Fear Greed Index Gold"]
      : ["fear and greed index precious metals", "gold market sentiment", "gold fear greed index", "precious metals sentiment indicator", "should I buy gold now"],
    alternates: getAlternates(locale, "/fear-greed"),
    openGraph: {
      title: t("metaTitle"),
      description: metaDesc,
      type: "website",
      url: getAlternates(locale, "/fear-greed").canonical,
    },
  };
}

export default async function FearGreedPage() {
  const t = await getTranslations("fearGreedPage");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("h1"), path: "/fear-greed" },
    ],
    tc("breadcrumbHome"),
    locale,
  );

  const app = softwareAppSchema({
    name: t("h1"),
    description: t("metaDesc"),
    path: "/fear-greed",
    locale,
  });

  const faqItems = [
    { question: t("faq1q"), answer: t("faq1a") },
    { question: t("faq2q"), answer: t("faq2a") },
    { question: t("faq3q"), answer: t("faq3a") },
  ];
  const faqLd = faqSchema(faqItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[860px] px-6">
          <nav className="flex items-center gap-2 text-xs text-content-3 mb-6">
            <Link href="/" className="hover:text-brand-gold transition-colors">{tc("breadcrumbHome")}</Link>
            <span>/</span>
            <Link href="/herramientas" className="hover:text-brand-gold transition-colors">{tt("title")}</Link>
            <span>/</span>
            <span className="text-content-2">{t("h1")}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
              {t("h1")}
            </h1>
            <p className="text-content-2 leading-relaxed max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          {/* Gauge */}
          <div className="p-6 sm:p-8 rounded-DEFAULT border border-border bg-surface-1 mb-10">
            <FearGreedGauge />
          </div>

          {/* Methodology */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("methodTitle")}</h2>
            <p className="text-sm text-content-2 leading-relaxed mb-4">{t("methodDesc")}</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { pct: "30%", name: t("comp1Name"), desc: t("comp1Desc") },
                { pct: "25%", name: t("comp2Name"), desc: t("comp2Desc") },
                { pct: "20%", name: t("comp3Name"), desc: t("comp3Desc") },
                { pct: "15%", name: t("comp4Name"), desc: t("comp4Desc") },
                { pct: "10%", name: t("comp5Name"), desc: t("comp5Desc") },
              ].map((c) => (
                <div key={c.name} className="p-4 rounded-lg bg-surface-1 border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-brand-gold bg-[rgba(214,179,90,0.12)] px-2 py-0.5 rounded">{c.pct}</span>
                    <span className="text-sm font-semibold text-content-0">{c.name}</span>
                  </div>
                  <p className="text-xs text-content-3 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scale explanation */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("scaleTitle")}</h2>
            <div className="space-y-2">
              {[
                { range: "0–20", label: t("labelExtremeFear"), desc: t("descExtremeFear"), color: "border-red-500/40 bg-red-500/5" },
                { range: "21–40", label: t("labelFear"), desc: t("descFear"), color: "border-orange-500/40 bg-orange-500/5" },
                { range: "41–60", label: t("labelNeutral"), desc: t("descNeutral"), color: "border-yellow-500/40 bg-yellow-500/5" },
                { range: "61–80", label: t("labelGreed"), desc: t("descGreed"), color: "border-lime-500/40 bg-lime-500/5" },
                { range: "81–100", label: t("labelExtremeGreed"), desc: t("descExtremeGreed"), color: "border-green-500/40 bg-green-500/5" },
              ].map((row) => (
                <div key={row.range} className={`flex items-start gap-3 p-3 rounded-lg border ${row.color}`}>
                  <span className="text-xs font-bold text-content-3 w-14 shrink-0 pt-0.5">{row.range}</span>
                  <div>
                    <span className="text-sm font-semibold text-content-0">{row.label}</span>
                    <p className="text-xs text-content-3 mt-0.5 leading-relaxed">{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-10 space-y-3">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("faqTitle")}</h2>
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-lg border border-border bg-surface-1 overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-semibold text-content-0 list-none">
                  {item.question}
                  <svg className="shrink-0 ml-3 transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-surface-1 border border-border text-xs text-content-3 leading-relaxed">
            {t("disclaimer")}
          </div>
        </div>
      </section>
    </>
  );
}
