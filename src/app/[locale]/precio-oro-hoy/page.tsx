import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return {
    title: t("precioOroHoy.title"),
    description: t("precioOroHoy.description"),
    keywords: locale === "en"
      ? ["gold price today", "gold quote today", "gold price real time", "xau usd today", "gold ounce price today", "gold value today"]
      : ["precio oro hoy", "cotización oro hoy", "precio oro tiempo real", "gold price today", "xau usd hoy", "precio onza oro hoy", "valor del oro hoy"],
    alternates: getAlternates(locale, "/precio-oro-hoy"),
    openGraph: {
      title: t("precioOroHoy.ogTitle"),
      description: t("precioOroHoy.ogDescription"),
      type: "website",
      url: "https://metalorix.com/precio-oro-hoy",
    },
  };
}

export default async function PrecioOroHoyPage() {
  const t = await getTranslations("goldToday");
  const tc = await getTranslations("common");

  const bulletItems = [
    t("fedDecisions"),
    t("inflationData"),
    t("geopolitical"),
    t("dollarStrength"),
    t("centralBankDemand"),
    t("etfFlows"),
  ];

  const toolLinks = [
    { href: "/precio-gramo-oro", label: t("gramPrice"), desc: t("gramPriceDesc") },
    { href: "/conversor-divisas", label: t("multiCurrency"), desc: t("multiCurrencyDesc") },
    { href: "/ratio-oro-plata", label: t("ratioLink"), desc: t("ratioLinkDesc") },
    { href: "/calculadora-rentabilidad", label: t("roiCalc"), desc: t("roiCalcDesc") },
    { href: "/alertas", label: t("alertsLink"), desc: t("alertsLinkDesc") },
  ];

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">
            {tc("breadcrumbHome")}
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

        <MetalPageContent symbol="XAU" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("whatMoves")}
            </h2>
            <ul className="space-y-3 text-sm text-content-2 leading-relaxed">
              {bulletItems.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-gold mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("relatedTools")}
            </h2>
            <div className="space-y-3">
              {toolLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className="flex items-center justify-between p-3 rounded-sm hover:bg-surface-2 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-content-0 group-hover:text-brand-gold transition-colors">
                      {link.label}
                    </div>
                    <div className="text-xs text-content-3">{link.desc}</div>
                  </div>
                  <svg className="w-4 h-4 text-content-3 group-hover:text-brand-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
