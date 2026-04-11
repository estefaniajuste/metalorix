import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates, buildMetaTitle } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema, faqSchema } from "@/lib/seo/schemas";
import { Link } from "@/i18n/navigation";

const MetalOutlookPage = dynamic(
  () => import("@/components/predictions/MetalOutlookPage").then((m) => m.MetalOutlookPage),
  {
    ssr: false,
    loading: () => (
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-[420px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" />
        <div className="h-[420px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" />
      </div>
    ),
  }
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "outlook" });
  const rawDesc = t("metaDesc");
  const description = rawDesc.length > 155
    ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" "))
    : rawDesc;

  return {
    title: buildMetaTitle(t("metaTitle")),
    description,
    keywords:
      locale === "es"
        ? ["predicciones oro", "outlook metales preciosos", "prediccion precio oro", "analisis oro IA", "forecast plata oro"]
        : locale === "de"
        ? ["Goldpreis Prognose", "Edelmetall Vorhersage", "Gold Analyse KI"]
        : ["gold price prediction", "precious metals outlook", "gold forecast AI", "silver price prediction", "gold analysis model"],
    alternates: getAlternates(locale, "/outlook"),
    openGraph: {
      title: t("metaTitle"),
      description,
      type: "website",
      url: getAlternates(locale, "/outlook").canonical,
    },
  };
}

export default async function OutlookPage() {
  const t = await getTranslations("outlook");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("h1"), path: "/outlook" },
    ],
    tc("breadcrumbHome"),
    locale
  );

  const app = softwareAppSchema({
    name: t("h1"),
    description: t("metaDesc"),
    path: "/outlook",
    locale,
  });

  const faqItems = [
    { question: t("faq1q"), answer: t("faq1a") },
    { question: t("faq2q"), answer: t("faq2a") },
    { question: t("faq3q"), answer: t("faq3a") },
    { question: t("faq4q"), answer: t("faq4a") },
    { question: t("faq5q"), answer: t("faq5a") },
  ];
  const faqLd = faqSchema(faqItems);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-content-3 mb-6">
            <Link href="/" className="hover:text-brand-gold transition-colors">{tc("breadcrumbHome")}</Link>
            <span>/</span>
            <Link href="/herramientas" className="hover:text-brand-gold transition-colors">{tt("title")}</Link>
            <span>/</span>
            <span className="text-content-2">{t("h1")}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
              {t("h1")}
            </h1>
            <p className="text-content-2 leading-relaxed max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          {/* Main outlook component */}
          <MetalOutlookPage locale={locale} />

          {/* Methodology */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("methodology")}</h2>
            <p className="text-sm text-content-2 leading-relaxed mb-4">{t("methodologyDesc")}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { factor: t("technical"), desc: t("technicalDesc"), shortW: "40%", longW: "20%" },
                { factor: t("momentum"), desc: t("momentumDesc"), shortW: "25%", longW: "15%" },
                { factor: t("sentiment"), desc: t("sentimentDesc"), shortW: "20%", longW: "30%" },
                { factor: t("macro"), desc: t("macroDesc"), shortW: "15%", longW: "35%" },
              ].map((item) => (
                <div key={item.factor} className="p-4 rounded-lg bg-surface-1 border border-border">
                  <span className="text-sm font-semibold text-content-0">{item.factor}</span>
                  <p className="text-xs text-content-3 mt-1 leading-relaxed">{item.desc}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[10px] text-content-3">
                      {t("shortTermLabel")}: <b className="text-content-1">{item.shortW}</b>
                    </span>
                    <span className="text-[10px] text-content-3">
                      {t("longTermLabel")}: <b className="text-content-1">{item.longW}</b>
                    </span>
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
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-surface-1 border border-border text-xs text-content-3 leading-relaxed">
            {t("disclaimer")}
          </div>
        </div>
      </section>
    </>
  );
}
