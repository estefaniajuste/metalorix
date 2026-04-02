import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { breadcrumbSchema, softwareAppSchema, howToSchema } from "@/lib/seo/schemas";
import { Link } from "@/i18n/navigation";

const JewelryCalculator = dynamic(
  () => import("@/components/tools/JewelryCalculator").then((m) => m.JewelryCalculator),
  { ssr: false, loading: () => <div className="h-[400px] bg-surface-1 border border-border rounded-DEFAULT animate-pulse" /> }
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "jewelryPage" });
  const rawDesc = t("metaDesc");
  const metaDesc = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  return {
    title: t("metaTitle"),
    description: metaDesc,
    keywords: locale === "es"
      ? ["cuanto vale mi oro", "valor joyas oro", "calculadora oro quilates", "precio oro 18 quilates gramo", "valor anillo oro", "calcular valor oro", "precio gramo oro 9k 14k 18k 22k 24k", "cuanto vale una joya de plata", "valor joyas plata 925"]
      : locale === "de"
      ? ["Goldwert berechnen", "Schmuck Goldwert", "Gold Karat Rechner", "18 Karat Gold Preis pro Gramm", "Goldring Wert berechnen"]
      : ["jewelry gold value calculator", "how much is my gold worth", "gold karat value calculator", "18k gold price per gram", "gold ring value calculator", "scrap gold calculator", "silver jewelry value", "925 silver value calculator"],
    alternates: getAlternates(locale, "/valor-joyas"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
      type: "website",
      url: getAlternates(locale, "/valor-joyas").canonical,
    },
  };
}

export default async function ValorJoyasPage() {
  const t = await getTranslations("jewelryPage");
  const tc = await getTranslations("common");
  const tt = await getTranslations("tools");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: tt("title"), path: "/herramientas" },
      { name: t("h1"), path: "/valor-joyas" },
    ],
    tc("breadcrumbHome"),
    locale,
  );

  const app = softwareAppSchema({
    name: t("h1"),
    description: t("metaDesc"),
    path: "/valor-joyas",
    locale,
  });

  const howTo = howToSchema({
    name: t("h1"),
    description: t("metaDesc"),
    steps: [
      { name: t("step1Name"), text: t("step1Text") },
      { name: t("step2Name"), text: t("step2Text") },
      { name: t("step3Name"), text: t("step3Text") },
      { name: t("step4Name"), text: t("step4Text") },
    ],
    url: getAlternates(locale, "/valor-joyas").canonical || "",
    locale,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />

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

          {/* Calculator */}
          <div className="p-6 rounded-DEFAULT border border-border bg-surface-1 mb-10">
            <JewelryCalculator />
          </div>

          {/* How it works */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("howItWorksTitle")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { step: "1", name: t("step1Name"), text: t("step1Text") },
                { step: "2", name: t("step2Name"), text: t("step2Text") },
                { step: "3", name: t("step3Name"), text: t("step3Text") },
                { step: "4", name: t("step4Name"), text: t("step4Text") },
              ].map((s) => (
                <div key={s.step} className="flex gap-3 p-4 rounded-lg bg-surface-1 border border-border">
                  <span className="w-7 h-7 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold flex items-center justify-center shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-content-0 mb-0.5">{s.name}</div>
                    <div className="text-xs text-content-3 leading-relaxed">{s.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Karat table */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("karatTableTitle")}</h2>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2">
                    <th className="text-left px-4 py-3 text-content-2 font-semibold">{t("karat")}</th>
                    <th className="text-left px-4 py-3 text-content-2 font-semibold">{t("fineness")}</th>
                    <th className="text-left px-4 py-3 text-content-2 font-semibold">{t("purityPct")}</th>
                    <th className="text-left px-4 py-3 text-content-2 font-semibold">{t("commonUse")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { k: "24k", f: "999", p: "99.9%", use: t("use24k") },
                    { k: "22k", f: "917", p: "91.7%", use: t("use22k") },
                    { k: "18k", f: "750", p: "75.0%", use: t("use18k") },
                    { k: "14k", f: "585", p: "58.5%", use: t("use14k") },
                    { k: "10k", f: "417", p: "41.7%", use: t("use10k") },
                    { k: "9k",  f: "375", p: "37.5%", use: t("use9k") },
                  ].map((row, i) => (
                    <tr key={row.k} className={`border-b border-border ${i % 2 === 0 ? "" : "bg-surface-1"}`}>
                      <td className="px-4 py-3 font-semibold text-brand-gold">{row.k}</td>
                      <td className="px-4 py-3 text-content-1">{row.f}‰</td>
                      <td className="px-4 py-3 text-content-1">{row.p}</td>
                      <td className="px-4 py-3 text-content-3 text-xs">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEO FAQ */}
          <div className="mb-10 space-y-4">
            <h2 className="text-xl font-bold text-content-0 mb-4">{t("faqTitle")}</h2>
            {[
              { q: t("faq1q"), a: t("faq1a") },
              { q: t("faq2q"), a: t("faq2a") },
              { q: t("faq3q"), a: t("faq3a") },
              { q: t("faq4q"), a: t("faq4a") },
            ].map((item, i) => (
              <details key={i} className="group rounded-lg border border-border bg-surface-1 overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-semibold text-content-0 list-none">
                  {item.q}
                  <svg className="shrink-0 ml-3 transition-transform group-open:rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-sm text-content-2 leading-relaxed border-t border-border pt-3">
                  {item.a}
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
