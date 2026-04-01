import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema, faqSchema } from "@/lib/seo/schemas";
import { Link } from "@/i18n/navigation";

const PortfolioTracker = dynamic(
  () => import("@/components/portfolio/PortfolioTracker").then((m) => m.PortfolioTracker),
  { ssr: false, loading: () => <div className="h-[500px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" /> }
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("portfolio");
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/portfolio");
  const rawDesc = t("metaDesc");
  const metaDesc = rawDesc.length > 155
    ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(".") + 1) || rawDesc.slice(0, 155)
    : rawDesc;
  return {
    title: `${t("h1")} — Metalorix`,
    description: metaDesc,
    keywords: locale === "es"
      ? ["portfolio metales preciosos", "tracker oro plata", "valor cartera oro", "rentabilidad inversión oro"]
      : locale === "de"
      ? ["Edelmetall Portfolio", "Gold Silber Tracker", "Goldportfolio Wert"]
      : ["precious metals portfolio tracker", "gold holdings tracker", "silver portfolio value", "gold investment performance", "track gold coins"],
    alternates,
    openGraph: {
      title: t("h1"),
      description: metaDesc,
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("h1"), path: "/portfolio" },
    ],
    tc("breadcrumbHome"),
    locale,
  );

  const app = softwareAppSchema({
    name: t("h1"),
    description: t("metaDesc"),
    path: "/portfolio",
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
        <div className="mx-auto max-w-[960px] px-6">
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

          <PortfolioTracker />

          {/* FAQ */}
          <div className="mt-12 space-y-3">
            <h2 className="text-xl font-bold text-content-0 mb-4">FAQ</h2>
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
        </div>
      </section>
    </>
  );
}
