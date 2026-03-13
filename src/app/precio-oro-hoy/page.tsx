import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";

export async function generateMetadata() {
  const t = await getTranslations("goldPricePage");
  return {
    title: t("title") + " — Metalorix",
    description: t("subtitle"),
    keywords: [
      "precio oro hoy",
      "cotización oro hoy",
      "precio oro tiempo real",
      "gold price today",
      "xau usd hoy",
      "precio onza oro hoy",
      "valor del oro hoy",
    ],
    alternates: {
      canonical: "https://metalorix.com/precio-oro-hoy",
    },
    openGraph: {
      title: t("title") + " — Metalorix",
      description: t("subtitle"),
      type: "website",
      url: "https://metalorix.com/precio-oro-hoy",
    },
  };
}

export default async function PrecioOroHoyPage() {
  const t = await getTranslations("goldPricePage");
  const tc = await getTranslations("common");

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
              {[
                t("factor1"),
                t("factor2"),
                t("factor3"),
                t("factor4"),
                t("factor5"),
                t("factor6"),
              ].map((item) => (
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
              {[
                { href: "/precio-gramo-oro", labelKey: "gramPrice", descKey: "gramPriceDesc" },
                { href: "/conversor-divisas", labelKey: "multiCurrency", descKey: "multiCurrencyDesc" },
                { href: "/ratio-oro-plata", labelKey: "ratioTool", descKey: "ratioToolDesc" },
                { href: "/calculadora-rentabilidad", labelKey: "roiCalc", descKey: "roiCalcDesc" },
                { href: "/alertas", labelKey: "priceAlerts", descKey: "priceAlertsDesc" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between p-3 rounded-sm hover:bg-surface-2 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-content-0 group-hover:text-brand-gold transition-colors">
                      {t(link.labelKey)}
                    </div>
                    <div className="text-xs text-content-3">{t(link.descKey)}</div>
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
