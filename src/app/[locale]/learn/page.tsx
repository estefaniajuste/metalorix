import type { Metadata } from "next";
import { Link, getPathname } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { ALL_TOPICS } from "@/lib/learn/topics";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import {
  getLocalizedCluster,
  getLocalizedSubcluster,
} from "@/lib/learn/taxonomy-i18n";
import { getLocalizedArticleTitles } from "@/lib/learn/article-titles";
import { getLocalizedClusterSlug } from "@/lib/learn/slug-i18n";
import type { Locale } from "@/i18n/config";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "learnSection" });
  const alternates = getAlternates(locale, "/learn");

  const rawDesc = t("description");
  const description = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  return {
    title: `${t("title")} — Metalorix`,
    description,
    openGraph: {
      title: `${t("title")} — Metalorix`,
      description,
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
            locale={locale}
            ariaLabel={tc("breadcrumbNav")}
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

          <h2 className="text-xl font-bold text-content-0 mb-6">
            {t("topicIndex")}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {TAXONOMY.map((cluster) => {
              const count = ALL_TOPICS.filter(
                (tp) => tp.clusterSlug === cluster.slug
              ).length;
              const icon = CLUSTER_ICONS[cluster.slug] || "📄";
              const localized = getLocalizedCluster(cluster.slug, locale);
              const clusterName = localized?.name ?? cluster.nameEn;
              const locClusterSlug = getLocalizedClusterSlug(cluster.slug, locale);
              return (
                <div
                  key={cluster.slug}
                  className="rounded-lg border border-border bg-surface-1 p-5"
                >
                  <Link
                    href={{ pathname: "/learn/[cluster]" as const, params: { cluster: locClusterSlug } }}
                    className="group flex items-center gap-2.5 mb-3"
                  >
                    <span className="text-xl shrink-0">{icon}</span>
                    <h3 className="text-base font-bold text-content-0 group-hover:text-brand-gold transition-colors">
                      {clusterName}
                    </h3>
                    <span className="ml-auto text-xs text-content-3 shrink-0">
                      {count}
                    </span>
                  </Link>
                  <ul className="space-y-1 border-l-2 border-border pl-4">
                    {cluster.subclusters.map((sub) => {
                      const localizedSub = getLocalizedSubcluster(sub.slug, locale);
                      const subName = localizedSub?.name ?? sub.nameEn;
                      const subCount = ALL_TOPICS.filter(
                        (tp) =>
                          tp.clusterSlug === cluster.slug &&
                          tp.subclusterSlug === sub.slug
                      ).length;
                      const clusterHref = getPathname({
                        locale,
                        href: {
                          pathname: "/learn/[cluster]" as const,
                          params: { cluster: locClusterSlug },
                        },
                      });
                      return (
                        <li key={sub.slug}>
                          <a
                            href={`${clusterHref}#${sub.slug}`}
                            className="group/sub flex items-baseline gap-2 py-1 text-sm text-content-2 hover:text-brand-gold transition-colors"
                          >
                            <span className="group-hover/sub:text-brand-gold transition-colors">
                              {subName}
                            </span>
                            <span className="text-xs text-content-3 shrink-0">
                              {subCount}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
                  const locCluster = getLocalizedClusterSlug(tp.clusterSlug, locale);
                  return (
                    <Link
                      key={tp.slug}
                      href={{ pathname: "/learn/[cluster]/[slug]" as const, params: { cluster: locCluster, slug: loc?.localizedSlug ?? tp.slug } }}
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
