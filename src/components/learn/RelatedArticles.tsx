import Link from "next/link";

interface RelatedArticle {
  slug: string;
  clusterSlug: string;
  title: string;
  difficulty: string;
  linkType: string;
}

const LINK_TYPE_LABELS: Record<string, string> = {
  related: "Related",
  prerequisite: "Prerequisite",
  deeper_dive: "Go Deeper",
  comparison: "Compare",
  see_also: "See Also",
};

export function RelatedArticles({
  articles,
}: {
  articles: RelatedArticle[];
}) {
  if (articles.length === 0) return null;

  return (
    <aside className="mt-10 pt-8 border-t border-border">
      <h2 className="text-lg font-bold text-content-0 mb-4">
        Related Articles
      </h2>
      <div className="grid gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/learn/${article.clusterSlug}/${article.slug}`}
            className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-1 hover:border-brand-gold/40 transition-all"
          >
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3 shrink-0">
              {LINK_TYPE_LABELS[article.linkType] || article.linkType}
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
