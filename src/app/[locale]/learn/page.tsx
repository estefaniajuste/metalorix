import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { ALL_TOPICS } from "@/lib/learn/topics";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { getLocalizedCluster } from "@/lib/learn/taxonomy-i18n";
import { getLocalizedArticleTitles } from "@/lib/learn/article-titles";
import type { Locale } from "@/i18n/config";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "learnSection" });
  const alternates = getAlternates(locale, "/learn");

  return {
    title: `${t("title")} — Metalorix`,
    description: t("description"),
    openGraph: {
      title: `${t("title")} — Metalorix`,
      description: t("description"),
      url: alternates.canonical,
    },
    alternates,
  };
}

const CLUSTER_ICONS: Record<string, string> = {
  fundamentals: "📐",
  history: "📜",
  "markets-trading": "📊",
  investment: "💰",
  "physical-metals": "🪙",
  "price-factors": "📈",
  "production-industry": "⛏️",
  "geology-science": "🌍",
  "regulation-tax": "📋",
  "security-authenticity": "🔒",
  "ratios-analytics": "📉",
  macroeconomics: "🏦",
  guides: "📖",
  "faq-mistakes": "❓",
  comparisons: "⚖️",
  glossary: "📝",
};

export default async function LearnPage() {
  const tc = await getTranslations("common");
  const t = await getTranslations("learnSection");
  const locale = (await getLocale()) as Locale;

  const stats = {
    total: ALL_TOPICS.length,
    beginner: ALL_TOPICS.filter((tp) => tp.difficulty === "beginner").length,
    intermediate: ALL_TOPICS.filter((tp) => tp.difficulty === "intermediate")
      .length,
    advanced: ALL_TOPICS.filter((tp) => tp.difficulty === "advanced").length,
    clusters: TAXONOMY.length,
  };

  const pillarSlugs = ALL_TOPICS.filter((tp) => tp.isPillar && tp.priority === 1)
    .slice(0, 6)
    .map((tp) => tp.slug);
  const localizedTitles = await getLocalizedArticleTitles(pillarSlugs, locale);

  const alternates = getAlternates(locale, "/learn");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("description"),
    url: alternates.canonical,
    publisher: {
      "@type": "Organization",
      name: "Metalorix",
      url: "https://metalorix.com",
    },
    numberOfItems: stats.total,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1100px] px-6">
          <LearnBreadcrumb
            items={[
              { label: tc("breadcrumbHome"), href: "/" },
              { label: t("breadcrumb") },
            ]}
          />

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-content-2 leading-relaxed max-w-[700px]">
              {t("description")}
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-content-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                {stats.total} {t("articles")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {stats.beginner} {t("beginner")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {stats.intermediate} {t("intermediate")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {stats.advanced} {t("advanced")}
              </span>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TAXONOMY.map((cluster) => {
              const count = ALL_TOPICS.filter(
                (tp) => tp.clusterSlug === cluster.slug
              ).length;
              const icon = CLUSTER_ICONS[cluster.slug] || "📄";
              const localized = getLocalizedCluster(cluster.slug, locale);
              const clusterName = localized?.name ?? cluster.nameEn;
              const clusterDesc = localized?.description ?? cluster.descriptionEn;
              return (
                <Link
                  key={cluster.slug}
                  href={{ pathname: "/learn/[cluster]" as const, params: { cluster: cluster.slug } }}
                  className="group relative rounded-lg border border-border bg-surface-1 p-6 hover:border-brand-gold/40 hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-3">{icon}</div>
                  <h2 className="text-base font-bold text-content-0 group-hover:text-brand-gold transition-colors mb-2">
                    {clusterName}
                  </h2>
                  <p className="text-sm text-content-2 leading-relaxed mb-3 line-clamp-2">
                    {clusterDesc}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-content-3">
                    <span>{t("articlesCount", { count })}</span>
                    <span>·</span>
                    <span>{t("topicsCount", { count: cluster.subclusters.length })}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-12 rounded-lg border border-brand-gold/20 bg-[rgba(214,179,90,0.04)] p-6">
            <h2 className="text-lg font-bold text-content-0 mb-3">
              {t("newToMetals")}
            </h2>
            <p className="text-sm text-content-2 mb-4">
              {t("newToMetalsDescription")}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_TOPICS.filter((tp) => tp.isPillar && tp.priority === 1)
                .slice(0, 6)
                .map((tp) => {
                  const loc = localizedTitles.get(tp.slug);
                  return (
                    <Link
                      key={tp.slug}
                      href={{ pathname: "/learn/[cluster]/[slug]" as const, params: { cluster: tp.clusterSlug, slug: tp.slug } }}
                      className="text-sm font-medium px-3 py-1.5 rounded-full border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                    >
                      {loc?.title ?? tp.titleEn}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
