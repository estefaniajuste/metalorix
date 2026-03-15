import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${t("termsTitle")} — Metalorix`,
    robots: { index: true, follow: true },
    alternates: getAlternates(locale, "/terminos"),
  };
}

export default async function TerminosPage() {
  const t = await getTranslations("legal");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
          <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("termsTitle")}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-8">
          {t("termsTitle")}
        </h1>

        <div className="prose-metalorix space-y-6 text-content-2 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">1. {t("acceptance")}</h2>
            <p>{t("terms.acceptanceContent")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">2. {t("serviceDescription")}</h2>
            <p>{t("terms.serviceIntro")}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t("terms.servicePrices")}</li>
              <li>{t("terms.serviceCharts")}</li>
              <li>{t("terms.serviceTools")}</li>
              <li>{t("terms.serviceArticles")}</li>
              <li>{t("terms.serviceAlerts")}</li>
              <li>{t("terms.serviceNewsletter")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">3. {t("registration")}</h2>
            <p>{t("terms.registrationContent")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">4. {t("acceptableUse")}</h2>
            <p>{t("terms.useIntro")}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t("terms.useNoIllegal")}</li>
              <li>{t("terms.useNoAccess")}</li>
              <li>{t("terms.useNoScraping")}</li>
              <li>{t("terms.useNoReproduce")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">5. {t("dataAccuracy")}</h2>
            <p>{t("terms.dataAccuracyP1")} <strong>{t("terms.dataAccuracyBold")}</strong></p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">6. {t("disclaimer")}</h2>
            <p>{t("terms.disclaimerContent")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">7. {t("modifications")}</h2>
            <p>{t("terms.modificationsContent")}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-content-0 mb-2">8. {t("contact")}</h2>
            <p>{t("terms.contactContent")} <a href="mailto:hello@metalorix.com" className="text-brand-gold hover:underline">hello@metalorix.com</a></p>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-content-3">{t("lastUpdated")}</p>
            <div className="flex gap-4 mt-2">
              <Link href="/aviso-legal" className="text-xs text-brand-gold hover:underline">{t("legalNotice")}</Link>
              <Link href="/privacidad" className="text-xs text-brand-gold hover:underline">{t("privacyPolicy")}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
