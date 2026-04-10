import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DEALER_COUNTRIES, getCountryName } from "@/lib/data/dealers";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getAlternates, buildMetaTitle } from "@/lib/seo/alternates";
import { BusinessForm } from "@/components/dealers/BusinessForm";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dealers");
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/donde-comprar/registrar");

  return {
    title: buildMetaTitle(t("registerTitle"), "—"),
    description: t("registerSeoDesc"),
    keywords: t("registerSeoKw"),
    alternates,
    openGraph: {
      title: t("registerTitle"),
      description: t("registerSeoDesc"),
      type: "website",
      url: alternates.canonical,
    },
  };
}

export default async function RegisterBusinessPage() {
  const t = await getTranslations("dealers");
  const tc = await getTranslations("common");
  const locale = await getLocale();

  const bc = breadcrumbSchema(
    [
      { name: t("breadcrumb"), path: "/donde-comprar" },
      { name: t("registerBreadcrumb"), path: "/donde-comprar/registrar" },
    ],
    tc("breadcrumbHome"),
    locale
  );

  const countries = DEALER_COUNTRIES.map((c) => ({
    code: c.code,
    name: getCountryName(c, locale),
  })).sort((a, b) => a.name.localeCompare(b.name));

  const tValues: Record<string, string> = {
    formBusinessName: t("formBusinessName"),
    formBusinessNameHint: t("formBusinessNameHint"),
    formEmail: t("formEmail"),
    formEmailHint: t("formEmailHint"),
    formCountry: t("formCountry"),
    formCountryPlaceholder: t("formCountryPlaceholder"),
    formCity: t("formCity"),
    formCityHint: t("formCityHint"),
    formAddress: t("formAddress"),
    formWebsite: t("formWebsite"),
    formPhone: t("formPhone"),
    formWhatsApp: t("formWhatsApp"),
    formInstagram: t("formInstagram"),
    formInstagramHint: t("formInstagramHint"),
    formType: t("formType"),
    formMetals: t("formMetals"),
    formServices: t("formServices"),
    formDescription: t("formDescription"),
    formDescriptionHint: t("formDescriptionHint"),
    formSubmit: t("formSubmit"),
    formSubmitting: t("formSubmitting"),
    typeOnline: t("typeOnline"),
    typePhysical: t("typePhysical"),
    typeBoth: t("typeBoth"),
    servicesBuying: t("servicesBuying"),
    servicesSelling: t("servicesSelling"),
    servicesJewelry: t("servicesJewelry"),
    servicesInvestment: t("servicesInvestment"),
    servicesRefining: t("servicesRefining"),
    servicesAppraisal: t("servicesAppraisal"),
    successTitle: t("successTitle"),
    successMsg: t("successMsg"),
    errorGeneric: t("errorGeneric"),
    errorEmailInvalid: t("errorEmailInvalid"),
    errorRequired: t("errorRequired"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
          <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
            <Link href="/" className="hover:text-content-1 transition-colors">
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/donde-comprar" className="hover:text-content-1 transition-colors">
              {t("breadcrumb")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{t("registerBreadcrumb")}</span>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
              {t("registerTitle")}
            </h1>
            <p className="text-content-2 mb-10 leading-relaxed">
              {t("registerDesc")}
            </p>

            <BusinessForm countries={countries} t={tValues} />
          </div>

          <div className="mt-16 p-6 rounded-DEFAULT bg-surface-1 border border-border max-w-2xl">
            <h3 className="text-base font-semibold text-content-0 mb-2">
              {t("disclaimer")}
            </h3>
            <p className="text-xs text-content-3 leading-relaxed">
              {t("disclaimerText")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
