import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema, faqSchema, howToSchema } from "@/lib/seo/schemas";
import { Link } from "@/i18n/navigation";

const WidgetConfigurator = dynamic(
  () =>
    import("@/components/widget/WidgetConfigurator").then(
      (m) => m.WidgetConfigurator,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-surface-1 border border-border rounded-DEFAULT animate-shimmer mt-10" />
    ),
  },
);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("widget");
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/widget");
  const rawDesc = t("metaDesc");
  const metaDesc =
    rawDesc.length > 155
      ? rawDesc.slice(0, rawDesc.lastIndexOf(" ", 152)) + "…"
      : rawDesc;
  return {
    title: `${t("metaTitle")} — Metalorix`,
    description: metaDesc,
    keywords: t("keywords"),
    alternates,
    openGraph: {
      title: `${t("metaTitle")} — Metalorix`,
      description: metaDesc,
      type: "website",
    },
  };
}

const BENEFITS = [
  { icon: "⚡", titleKey: "benefit1Title", descKey: "benefit1Desc" },
  { icon: "🎨", titleKey: "benefit2Title", descKey: "benefit2Desc" },
  { icon: "🔓", titleKey: "benefit3Title", descKey: "benefit3Desc" },
  { icon: "🪶", titleKey: "benefit4Title", descKey: "benefit4Desc" },
] as const;

export default async function WidgetPage() {
  const t = await getTranslations("widget");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("h1"), path: "/widget" },
    ],
    tc("breadcrumbHome"),
    locale,
  );

  const app = softwareAppSchema({
    name: t("h1"),
    description: t("subtitle"),
    path: "/widget",
    locale,
  });

  const faqItems = Array.from({ length: 5 }, (_, i) => ({
    question: t(`faq${i + 1}Q`),
    answer: t(`faq${i + 1}A`),
  }));
  const faqLd = faqSchema(faqItems);

  const howTo = howToSchema({
    name: t("howTitle"),
    description: t("subtitle"),
    steps: [
      { name: t("step1"), text: t("step1Desc") },
      { name: t("step2"), text: t("step2Desc") },
      { name: t("step3"), text: t("step3Desc") },
    ],
    url: `https://metalorix.com/${locale}/widget`,
    locale,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[960px] px-6">
          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="text-xs text-content-3 mb-6 flex items-center gap-1.5"
          >
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              {tc("breadcrumbHome")}
            </Link>
            <span>/</span>
            <Link
              href="/herramientas"
              className="hover:text-content-1 transition-colors"
            >
              {tt("title")}
            </Link>
            <span>/</span>
            <span className="text-content-1">{t("h1")}</span>
          </nav>

          {/* Hero */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("h1")}
          </h1>
          <p className="text-content-2 max-w-2xl leading-relaxed mb-2">
            {t("subtitle")}
          </p>

          {/* Configurator + Preview */}
          <WidgetConfigurator />

          {/* How to embed */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-content-0 mb-6">
              {t("howTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-surface-1 border border-border rounded-DEFAULT p-5"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center text-sm font-bold mb-3">
                    {n}
                  </div>
                  <h3 className="text-sm font-semibold text-content-0 mb-1">
                    {t(`step${n}` as any)}
                  </h3>
                  <p className="text-sm text-content-2 leading-relaxed">
                    {t(`step${n}Desc` as any)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-content-0 mb-6">
              {t("whyTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {BENEFITS.map((b) => (
                <div
                  key={b.titleKey}
                  className="bg-surface-1 border border-border rounded-DEFAULT p-5"
                >
                  <span className="text-2xl mb-2 block">{b.icon}</span>
                  <h3 className="text-sm font-semibold text-content-0 mb-1">
                    {t(b.titleKey)}
                  </h3>
                  <p className="text-sm text-content-2 leading-relaxed">
                    {t(b.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 mb-4">
            <h2 className="text-xl font-bold text-content-0 mb-6">FAQ</h2>
            <div className="space-y-4">
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
        </div>
      </section>
    </>
  );
}
