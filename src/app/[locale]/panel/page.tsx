import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { UserPanel } from "@/components/panel/UserPanel";
import { getAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "panel" });
  return {
    title: `${t("title")} — Metalorix`,
    description: t("subtitle"),
    robots: { index: false, follow: false },
    alternates: getAlternates(locale, "/panel"),
  };
}

export default async function PanelPage() {
  const t = await getTranslations("panel");
  const tc = await getTranslations("common");

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[800px] px-6">
        <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-content-1 transition-colors">{tc("breadcrumbHome")}</Link>
          <span className="mx-2">/</span>
          <span className="text-content-1">{t("title")}</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-content-0 tracking-tight mb-2">
          {t("title")}
        </h1>
        <p className="text-content-2 mb-8 text-sm">{t("subtitle")}</p>

        <UserPanel />
      </div>
    </section>
  );
}
