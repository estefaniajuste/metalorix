import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { MetalPageContent } from "@/components/dashboard/MetalPageContent";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "pages" });
  const rawDesc = t("precioOroHoy.description");
  const description = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  const alternates = getAlternates(locale, "/precio-oro-hoy");
  return {
    title: t("precioOroHoy.title"),
    description,
    keywords: locale === "es"
      ? ["precio oro hoy", "cotización oro hoy", "precio oro tiempo real", "gold price today", "xau usd hoy", "precio onza oro hoy", "valor del oro hoy"]
      : ["gold price today", "gold quote today", "gold price real time", "xau usd today", "gold ounce price today", "gold value today"],
    alternates,
    openGraph: {
      title: t("precioOroHoy.ogTitle"),
      description,
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function PrecioOroHoyPage() {
  const t = await getTranslations("goldToday");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [{ name: t("breadcrumb"), path: "/precio-oro-hoy" }],
    tc("breadcrumbHome"),
    locale,
  );
  const faqItems = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A") },
  ];
  const faq = faqSchema(faqItems);

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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
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
        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-content-0 mb-5">{t("faqTitle")}</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={i} className="group rounded-DEFAULT border border-border bg-surface-1 overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-semibold text-content-0 [&::-webkit-details-marker]:hidden list-none">
                  {item.question}
                  <svg className="shrink-0 ml-3 w-4 h-4 text-content-3 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
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
