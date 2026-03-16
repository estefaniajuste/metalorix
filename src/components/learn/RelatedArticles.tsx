import { Link } from "@/i18n/navigation";

interface RelatedArticle {
  slug: string;
  clusterSlug: string;
  localizedSlug?: string;
  localizedClusterSlug?: string;
  title: string;
  difficulty: string;
  linkType: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  heading: string;
  linkTypeLabels: Record<string, string>;
}

export function RelatedArticles({
  articles,
  heading,
  linkTypeLabels,
}: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <aside className="mt-10 pt-8 border-t border-border">
      <h2 className="text-lg font-bold text-content-0 mb-4">
        {heading}
      </h2>
      <div className="grid gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={{
              pathname: "/learn/[cluster]/[slug]" as const,
              params: {
                cluster: article.localizedClusterSlug ?? article.clusterSlug,
                slug: article.localizedSlug ?? article.slug,
              },
            }}
            className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-1 hover:border-brand-gold/40 transition-all"
          >
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3 shrink-0">
              {linkTypeLabels[article.linkType] || article.linkType}
            </span>
            <span className="text-sm font-medium text-content-1 group-hover:text-brand-gold transition-colors">
              {article.title}
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
