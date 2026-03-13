import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { GoldSilverRatioContent } from "@/components/ratio/GoldSilverRatioContent";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages");
  return {
    title: t("ratio.title"),
    description: t("ratio.description"),
    keywords: [
      "ratio oro plata",
      "gold silver ratio",
      "ratio oro plata histórico",
      "oro vs plata",
      "proporción oro plata",
      "invertir oro o plata",
    ],
    alternates: {
      canonical: "https://metalorix.com/ratio-oro-plata",
    },
    openGraph: {
      title: t("ratio.ogTitle"),
      description: t("ratio.ogDescription"),
      type: "website",
      url: "https://metalorix.com/ratio-oro-plata",
    },
  };
}

export default async function RatioOroPlataPage() {
  const t = await getTranslations("ratioPage");
  const tc = await getTranslations("common");
  const tp = await getTranslations("pages");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [{ name: t("breadcrumb"), path: "/ratio-oro-plata" }],
    tc("breadcrumbHome"),
  );
  const page = webPageSchema({
    name: tp("ratio.ogTitle"),
    description: tp("ratio.description"),
    path: "/ratio-oro-plata",
    locale,
  });

  const zones = [
    {
      zone: "Ratio > 80",
      color: "text-signal-up",
      text: t("above80"),
    },
    {
      zone: "Ratio 60-80",
      color: "text-brand-gold",
      text: t("zone6080"),
    },
    {
      zone: "Ratio < 60",
      color: "text-signal-down",
      text: t("below60"),
    },
  ];

  const stats = [
    {
      label: t("historicalAvg"),
      value: "~60",
      desc: t("historicalAvgDesc"),
    },
    {
      label: t("historicalMax"),
      value: "~127",
      desc: t("historicalMaxDesc"),
    },
    {
      label: t("historicalMin"),
      value: "~31",
      desc: t("historicalMinDesc"),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }} />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Breadcrumb */}
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

          {/* Interactive content */}
          <GoldSilverRatioContent />

          {/* Educational content */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-xl font-bold text-content-0 mb-4">
                {t("whatIs")}
              </h2>
              <p className="text-content-2 leading-relaxed mb-4">
                {t("whatIsP1")}
              </p>
              <p className="text-content-2 leading-relaxed">
                {t("whatIsP2")}
              </p>
            </div>

            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6">
              <h2 className="text-xl font-bold text-content-0 mb-4">
                {t("howToInvest")}
              </h2>
              <ul className="space-y-3">
                {zones.map((item) => (
                  <li key={item.zone} className="flex gap-3 text-sm">
                    <span
                      className={`font-bold whitespace-nowrap ${item.color}`}
                    >
                      {item.zone}
                    </span>
                    <span className="text-content-2 leading-relaxed">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical context */}
          <div className="mt-6 bg-surface-1 border border-border rounded-DEFAULT p-6">
            <h2 className="text-xl font-bold text-content-0 mb-4">
              {t("historicalContext")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface-0 border border-border rounded-sm p-4"
                >
                  <div className="text-xs text-content-3 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-brand-gold tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-content-3 mt-1">{stat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
