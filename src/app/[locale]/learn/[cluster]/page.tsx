import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  if (!cluster) return { title: "Not Found — Metalorix" };

  return {
    title: `${cluster.nameEn} — Learn | Metalorix`,
    description: cluster.descriptionEn,
    openGraph: {
      title: `${cluster.nameEn} — Learn | Metalorix`,
      description: cluster.descriptionEn,
      url: `https://metalorix.com/learn/${cluster.slug}`,
    },
    alternates: {
      canonical: `https://metalorix.com/learn/${cluster.slug}`,
    },
  };
}

export default async function ClusterPage({
  params,
}: {
  params: { cluster: string };
}) {
  const tc = await getTranslations("common");
  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  if (!cluster) notFound();

  const clusterTopics = ALL_TOPICS.filter(
    (t) => t.clusterSlug === cluster.slug
  );
  const pillarTopics = clusterTopics.filter((t) => t.isPillar);

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1100px] px-6">
        <LearnBreadcrumb
          items={[
            { label: tc("breadcrumbHome"), href: "/" },
            { label: "Learn", href: "/learn" },
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
            {clusterTopics.length} articles across{" "}
            {cluster.subclusters.length} topics
          </p>
        </header>

        {/* Pillar articles */}
        {pillarTopics.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-content-3 uppercase tracking-wider mb-4">
              Start Here
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

        {/* Subclusters */}
        {cluster.subclusters.map((sub) => {
          const subTopics = clusterTopics
            .filter((t) => t.subclusterSlug === sub.slug && !t.isPillar)
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
