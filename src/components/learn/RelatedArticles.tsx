import { Link } from "@/i18n/navigation";

interface RelatedArticle {
  slug: string;
  clusterSlug: string;
  localizedSlug?: string;
  localizedClusterSlug?: string;
  title: string;
  difficulty: string;
  linkType: string;
  summary?: string;
  readingTimeMin?: number;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-red-500/10 text-red-400",
};

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
      <div className="grid gap-3 sm:grid-cols-2">
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
            className="group flex flex-col gap-2 p-4 rounded-lg border border-border bg-surface-1 hover:border-brand-gold/40 hover:bg-surface-2 transition-all"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3 shrink-0">
                {linkTypeLabels[article.linkType] || article.linkType}
              </span>
              {article.difficulty && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[article.difficulty] ?? "bg-surface-2 text-content-3"}`}>
                  {article.difficulty}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-content-0 group-hover:text-brand-gold transition-colors leading-snug">
              {article.title}
            </span>
            {article.summary && (
              <p className="text-xs text-content-3 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>
            )}
            {article.readingTimeMin !== undefined && article.readingTimeMin > 0 && (
              <span className="text-[10px] text-content-3 inline-flex items-center gap-1 mt-auto">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {article.readingTimeMin} min
              </span>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}
