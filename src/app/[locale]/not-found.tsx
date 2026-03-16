import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { getAlternates } from "@/lib/seo/alternates";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { logError } from "@/lib/error-logger";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("notFoundTitle"),
    alternates: getAlternates(locale, "/"),
  };
}

export default async function NotFound() {
  const t = await getTranslations("errors");
  const tc = await getTranslations("common");
  const tn = await getTranslations("nav");
  const locale = await getLocale();

  const hdrs = await headers();
  const path = hdrs.get("x-pathname") || hdrs.get("x-next-url") || hdrs.get("x-invoke-path") || "";
  const referer = hdrs.get("referer");
  const userAgent = hdrs.get("user-agent");
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip");

  logError({
    statusCode: 404,
    path: path || `/${locale}/unknown`,
    referer,
    userAgent,
    locale,
    ip,
    message: "Page not found",
  });

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-sm bg-[rgba(214,179,90,0.12)] mb-8">
          <span className="text-4xl font-extrabold text-brand-gold">404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
          {t("notFound")}
        </h1>
        <p className="text-content-2 mb-10 max-w-md mx-auto leading-relaxed">
          {t("notFoundDesc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-gold text-surface-0 font-semibold text-sm px-6 py-3 rounded-sm hover:brightness-110 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {tc("backToDashboard")}
          </Link>
          <Link
            href={{ pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("oro", locale) } }}
            className="inline-flex items-center justify-center gap-2 bg-surface-1 border border-border text-content-0 font-semibold text-sm px-6 py-3 rounded-sm hover:border-border-hover hover:shadow-card transition-all"
          >
            {t("viewGoldPrice")}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("oro", locale) } }, label: t("goldPrice"), desc: t("goldPriceDesc") },
            { href: { pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("plata", locale) } }, label: t("silverPrice"), desc: t("silverPriceDesc") },
            { href: "/herramientas", label: tn("tools"), desc: t("toolsDesc") },
          ].map((link) => (
            <Link
              key={typeof link.href === "string" ? link.href : link.href.pathname + link.href.params.metal}
              href={link.href as any}
              className="bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-border-hover hover:shadow-card transition-all text-start"
            >
              <div className="text-sm font-semibold text-content-0 mb-1">
                {link.label}
              </div>
              <div className="text-xs text-content-3">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
