import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema } from "@/lib/seo/schemas";

const toolSkeleton = (h = "h-[300px]") => (
  <div className={`w-full ${h} bg-surface-1 border border-border rounded-DEFAULT animate-shimmer`} />
);

const MetalComparison = dynamic(
  () => import("@/components/tools/MetalComparison").then((m) => m.MetalComparison),
  { ssr: false, loading: () => toolSkeleton("h-[420px]") }
);

const GoldSilverRatio = dynamic(
  () => import("@/components/tools/GoldSilverRatio").then((m) => m.GoldSilverRatio),
  { ssr: false, loading: () => toolSkeleton() }
);

const CurrencyConverter = dynamic(
  () => import("@/components/tools/CurrencyConverter").then((m) => m.CurrencyConverter),
  { ssr: false, loading: () => toolSkeleton() }
);

const UnitConverter = dynamic(
  () => import("@/components/tools/UnitConverter").then((m) => m.UnitConverter),
  { ssr: false, loading: () => toolSkeleton() }
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

export default async function HerramientasPage() {
  const t = await getTranslations("tools");
  const tc = await getTranslations("common");
  const breadcrumb = breadcrumbSchema([{ name: t("title"), path: "/herramientas" }], tc("breadcrumbHome"));
  const appSchema = softwareAppSchema({
    name: `${t("title")} Metalorix`,
    description: t("subtitle"),
    path: "/herramientas",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
            {t("title")}
          </h1>
          <p className="text-content-2 mb-10 max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="mb-8">
            <MetalComparison />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <GoldSilverRatio />
            <CurrencyConverter />
          </div>

          <div className="mb-6">
            <UnitConverter />
          </div>

          <div className="mb-6">
            <DcaCalculator />
          </div>

          <div className="mb-16">
            <ToolsTechnicalIndicators />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            <Link href="/calculadora-rentabilidad" className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover hover:shadow-card transition-all group">
              <div className="text-brand-gold mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              </div>
              <h3 className="text-base font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">{t("roiCalculator")}</h3>
              <p className="text-sm text-content-2 leading-relaxed">{t("roiDesc")}</p>
            </Link>
            <Link href="/ratio-oro-plata" className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover hover:shadow-card transition-all group">
              <div className="text-brand-gold mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
              <h3 className="text-base font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">{t("ratio")}</h3>
              <p className="text-sm text-content-2 leading-relaxed">{t("ratioDesc")}</p>
            </Link>
            <Link href="/conversor-divisas" className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover hover:shadow-card transition-all group">
              <div className="text-brand-gold mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              </div>
              <h3 className="text-base font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">{t("converter")}</h3>
              <p className="text-sm text-content-2 leading-relaxed">{t("converterDesc")}</p>
            </Link>
            <Link href="/comparador" className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover hover:shadow-card transition-all group">
              <div className="text-brand-gold mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
              </div>
              <h3 className="text-base font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">{t("comparator")}</h3>
              <p className="text-sm text-content-2 leading-relaxed">{t("comparatorDesc")}</p>
            </Link>
            <Link href="/calendario-economico" className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover hover:shadow-card transition-all group">
              <div className="text-brand-gold mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              </div>
              <h3 className="text-base font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">{t("calendar")}</h3>
              <p className="text-sm text-content-2 leading-relaxed">{t("calendarDesc")}</p>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
