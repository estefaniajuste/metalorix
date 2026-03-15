import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { ALL_TOPICS } from "@/lib/learn/topics";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { ArticleCard } from "@/components/learn/ArticleCard";
import {
  getLocalizedCluster,
  getLocalizedSubcluster,
} from "@/lib/learn/taxonomy-i18n";
import { getLocalizedArticleTitles } from "@/lib/learn/article-titles";
import type { Locale } from "@/i18n/config";

export const revalidate = 86400;

export async function generateStaticParams() {
  return TAXONOMY.map((c) => ({ cluster: c.slug }));
}

const DIFFICULTY_KEY: Record<string, string> = {
  beginner: "difficultyBeginner",
  intermediate: "difficultyIntermediate",
  advanced: "difficultyAdvanced",
};

const TYPE_KEY: Record<string, string> = {
  glossary: "typeGlossary",
  explainer: "typeExplainer",
  guide: "typeGuide",
  comparison: "typeComparison",
  faq: "typeFaq",
  historical: "typeHistorical",
  practical: "typePractical",
  macro: "typeMacro",
  investment: "typeInvestment",
  industry: "typeIndustry",
  pillar: "typePillar",
};

export async function generateMetadata({
  params,
}: {
  params: { cluster: string };
}): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations({ locale, namespace: "learnSection" });
  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  if (!cluster) return { title: t("notFound") };

  const localized = getLocalizedCluster(cluster.slug, locale);
  const clusterName = localized?.name ?? cluster.nameEn;
  const clusterDesc = localized?.description ?? cluster.descriptionEn;

  const alternates = getAlternates(locale, {
    pathname: "/learn/[cluster]",
    params: { cluster: cluster.slug },
  });

  return {
    title: `${clusterName} — ${t("breadcrumb")} | Metalorix`,
    description: clusterDesc,
    openGraph: {
      title: `${clusterName} — ${t("breadcrumb")} | Metalorix`,
      description: clusterDesc,
      url: alternates.canonical,
    },
    alternates,
  };
}

export default async function ClusterPage({
  params,
}: {
  params: { cluster: string };
}) {
  const tc = await getTranslations("common");
  const t = await getTranslations("learnSection");
  const locale = (await getLocale()) as Locale;
  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  if (!cluster) notFound();

  const clusterTopics = ALL_TOPICS.filter(
    (tp) => tp.clusterSlug === cluster.slug
  );
  const pillarTopics = clusterTopics.filter((tp) => tp.isPillar);

  const localizedCluster = getLocalizedCluster(cluster.slug, locale);
  const clusterName = localizedCluster?.name ?? cluster.nameEn;
  const clusterDesc = localizedCluster?.description ?? cluster.descriptionEn;

  const allSlugs = clusterTopics.map((tp) => tp.slug);
  const localizedTitles = await getLocalizedArticleTitles(allSlugs, locale);

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <LearnBreadcrumb
          items={[
            { label: tc("breadcrumbHome"), href: "/" },
            { label: t("breadcrumb"), href: "/learn" },
            { label: clusterName },
          ]}
          ariaLabel={tc("breadcrumbNav")}
        />

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight mb-3">
            {clusterName}
          </h1>
          <p className="text-lg text-content-2 leading-relaxed max-w-[700px]">
            {clusterDesc}
          </p>
          <p className="text-sm text-content-3 mt-3">
            {t("articlesCount", { count: clusterTopics.length })}
            {" · "}
            {t("topicsCount", { count: cluster.subclusters.length })}
          </p>
        </header>

        {pillarTopics.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-content-3 uppercase tracking-wider mb-4">
              {t("startHere")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {pillarTopics.map((topic) => {
                const loc = localizedTitles.get(topic.slug);
                return (
                  <ArticleCard
                    key={topic.slug}
                    slug={topic.slug}
                    clusterSlug={topic.clusterSlug}
                    title={loc?.title ?? topic.titleEn}
                    summary={loc?.summary ?? topic.summaryEn}
                    difficulty={topic.difficulty}
                    articleType={topic.articleType}
                    isPillar
                    difficultyLabel={t(DIFFICULTY_KEY[topic.difficulty] ?? "difficultyBeginner")}
                    typeLabel={t(TYPE_KEY[topic.articleType] ?? "typePillar")}
                    pillarLabel={t("pillarBadge")}
                  />
                );
              })}
            </div>
          </div>
        )}

        {cluster.subclusters.map((sub) => {
          const subTopics = clusterTopics
            .filter((tp) => tp.subclusterSlug === sub.slug && !tp.isPillar)
            .sort((a, b) => a.priority - b.priority);

          if (subTopics.length === 0) return null;

          const localizedSub = getLocalizedSubcluster(sub.slug, locale);
          const subName = localizedSub?.name ?? sub.nameEn;
          const subDesc = localizedSub?.description ?? sub.descriptionEn;

          return (
            <div key={sub.slug} className="mb-10">
              <h2 className="text-xl font-bold text-content-0 mb-2">
                {subName}
              </h2>
              <p className="text-sm text-content-2 mb-4">
                {subDesc}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subTopics.map((topic) => {
                  const loc = localizedTitles.get(topic.slug);
                  return (
                    <ArticleCard
                      key={topic.slug}
                      slug={topic.slug}
                      clusterSlug={topic.clusterSlug}
                      title={loc?.title ?? topic.titleEn}
                      summary={loc?.summary ?? topic.summaryEn}
                      difficulty={topic.difficulty}
                      articleType={topic.articleType}
                      difficultyLabel={t(DIFFICULTY_KEY[topic.difficulty] ?? "difficultyBeginner")}
                      typeLabel={t(TYPE_KEY[topic.articleType] ?? "typePillar")}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
