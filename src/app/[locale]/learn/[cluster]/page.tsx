import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { ALL_TOPICS } from "@/lib/learn/topics";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { ArticleCard } from "@/components/learn/ArticleCard";

export const revalidate = 86400;

export async function generateStaticParams() {
  return TAXONOMY.map((c) => ({ cluster: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { cluster: string };
}): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "learnSection" });
  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  if (!cluster) return { title: t("notFound") };

  const alternates = getAlternates(locale, {
    pathname: "/learn/[cluster]",
    params: { cluster: cluster.slug },
  });

  return {
    title: `${cluster.nameEn} — ${t("breadcrumb")} | Metalorix`,
    description: cluster.descriptionEn,
    openGraph: {
      title: `${cluster.nameEn} — ${t("breadcrumb")} | Metalorix`,
      description: cluster.descriptionEn,
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
  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  if (!cluster) notFound();

  const clusterTopics = ALL_TOPICS.filter(
    (tp) => tp.clusterSlug === cluster.slug
  );
  const pillarTopics = clusterTopics.filter((tp) => tp.isPillar);

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <LearnBreadcrumb
          items={[
            { label: tc("breadcrumbHome"), href: "/" },
            { label: t("breadcrumb"), href: "/learn" },
            { label: cluster.nameEn },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight mb-3">
            {cluster.nameEn}
          </h1>
          <p className="text-lg text-content-2 leading-relaxed max-w-[700px]">
            {cluster.descriptionEn}
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
              {pillarTopics.map((topic) => (
                <ArticleCard
                  key={topic.slug}
                  slug={topic.slug}
                  clusterSlug={topic.clusterSlug}
                  title={topic.titleEn}
                  summary={topic.summaryEn}
                  difficulty={topic.difficulty}
                  articleType={topic.articleType}
                  isPillar
                />
              ))}
            </div>
          </div>
        )}

        {cluster.subclusters.map((sub) => {
          const subTopics = clusterTopics
            .filter((tp) => tp.subclusterSlug === sub.slug && !tp.isPillar)
            .sort((a, b) => a.priority - b.priority);

          if (subTopics.length === 0) return null;

          return (
            <div key={sub.slug} className="mb-10">
              <h2 className="text-xl font-bold text-content-0 mb-2">
                {sub.nameEn}
              </h2>
              <p className="text-sm text-content-2 mb-4">
                {sub.descriptionEn}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subTopics.map((topic) => (
                  <ArticleCard
                    key={topic.slug}
                    slug={topic.slug}
                    clusterSlug={topic.clusterSlug}
                    title={topic.titleEn}
                    summary={topic.summaryEn}
                    difficulty={topic.difficulty}
                    articleType={topic.articleType}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
