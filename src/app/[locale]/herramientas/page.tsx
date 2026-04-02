import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema, faqSchema } from "@/lib/seo/schemas";

const toolSkeleton = (h = "h-[300px]") => (
  <div className={`w-full ${h} bg-surface-1 border border-border rounded-DEFAULT animate-shimmer`} />
);

const DcaCalculator = dynamic(
  () => import("@/components/tools/DcaCalculator").then((m) => m.DcaCalculator),
  { ssr: false, loading: () => toolSkeleton("h-[400px]") }
);

const ToolsTechnicalIndicators = dynamic(
  () => import("@/components/tools/ToolsTechnicalIndicators").then((m) => m.ToolsTechnicalIndicators),
  { ssr: false, loading: () => toolSkeleton("h-[500px]") }
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("toolsTitle"),
    description: t("toolsDesc"),
    alternates: getAlternates(locale, "/herramientas"),
  };
}

const TOOL_CARDS = [
  {
    href: "/comparador" as const,
    titleKey: "comparator" as const,
    descKey: "comparatorDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: "/ratio-oro-plata" as const,
    titleKey: "ratio" as const,
    descKey: "ratioDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: "/conversor-divisas" as const,
    titleKey: "converter" as const,
    descKey: "converterDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: "/calculadora-rentabilidad" as const,
    titleKey: "roiCalculator" as const,
    descKey: "roiDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    href: "/calendario-economico" as const,
    titleKey: "calendar" as const,
    descKey: "calendarDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/valor-joyas" as const,
    titleKey: "jewelryCalc" as const,
    descKey: "jewelryCalcDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="6 3 18 3 22 9 12 22 2 9" />
      </svg>
    ),
  },
  {
    href: "/fear-greed" as const,
    titleKey: "fearGreed" as const,
    descKey: "fearGreedDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    href: "/portfolio" as const,
    titleKey: "portfolioTracker" as const,
    descKey: "portfolioTrackerDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M2 10h2M20 10h2M2 14h2M20 14h2" />
      </svg>
    ),
  },
  {
    href: "/widget" as const,
    titleKey: "goldWidget" as const,
    descKey: "goldWidgetDesc" as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 18 22 12" />
        <polyline points="8 6 2 6 2 12" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <rect x="6" y="2" width="12" height="20" rx="2" />
      </svg>
    ),
  },
];

export default async function HerramientasPage() {
  const t = await getTranslations("tools");
  const tc = await getTranslations("common");
  const locale = await getLocale();
  const breadcrumb = breadcrumbSchema([{ name: t("title"), path: "/herramientas" }], tc("breadcrumbHome"), locale);
  const appSchema = softwareAppSchema({
    name: `${t("title")} Metalorix`,
    description: t("subtitle"),
    path: "/herramientas",
    locale,
  });
  const faq = faqSchema([
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {TOOL_CARDS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-brand-gold/40 hover:shadow-card transition-all group"
              >
                <div className="text-brand-gold mb-3">{tool.icon}</div>
                <h3 className="text-base font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">
                  {t(tool.titleKey)}
                </h3>
                <p className="text-sm text-content-2 leading-relaxed">
                  {t(tool.descKey)}
                </p>
              </Link>
            ))}
          </div>

          <div id="dca" className="mb-6">
            <DcaCalculator />
          </div>

          <div id="technical" className="mb-6">
            <ToolsTechnicalIndicators />
          </div>
        </div>
      </section>
    </>
  );
}
