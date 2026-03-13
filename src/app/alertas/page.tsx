import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SubscribeForm } from "@/components/alerts/SubscribeForm";

export async function generateMetadata() {
  const t = await getTranslations("metadata");
  return {
    title: t("alertsTitle"),
    description: t("alertsDesc"),
    alternates: { canonical: "https://metalorix.com/alertas" },
  };
}

export default async function AlertasPage() {
  const t = await getTranslations("alerts");
  const tn = await getTranslations("nav");

  const alertTypes = [
    { titleKey: "priceLevel" as const, descKey: "priceLevelDesc" as const, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg> },
    { titleKey: "sharpMove" as const, descKey: "sharpMoveDesc" as const, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
    { titleKey: "highLow" as const, descKey: "highLowDesc" as const, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg> },
    { titleKey: "ratioAlert" as const, descKey: "ratioAlertDesc" as const, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg> },
    { titleKey: "technicalCross" as const, descKey: "technicalCrossDesc" as const, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg> },
    { titleKey: "instantEmail" as const, descKey: "instantEmailDesc" as const, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
  ];

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-content-2 leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="mb-16">
          <SubscribeForm />
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-bold text-content-0 mb-6 text-center">
            {t("typesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alertTypes.map((type) => (
              <div
                key={type.titleKey}
                className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover transition-colors"
              >
                <div className="text-brand-gold mb-3">{type.icon}</div>
                <h3 className="text-base font-semibold text-content-0 mb-2">
                  {t(type.titleKey)}
                </h3>
                <p className="text-sm text-content-2 leading-relaxed">
                  {t(type.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-content-2 mb-4">
            {t("checkPrices")}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/precio/oro"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all"
            >
              {t("goldPrice")}
            </Link>
            <Link
              href="/herramientas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-1 border border-border text-content-0 hover:border-border-hover transition-all"
            >
              {tn("tools")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
