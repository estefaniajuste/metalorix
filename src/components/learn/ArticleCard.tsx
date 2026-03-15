import Link from "next/link";

interface ArticleCardProps {
  slug: string;
  clusterSlug: string;
  title: string;
  summary: string;
  difficulty: string;
  articleType: string;
  isPillar?: boolean;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const TYPE_LABELS: Record<string, string> = {
  glossary: "Glossary",
  explainer: "Explainer",
  guide: "Guide",
  comparison: "Comparison",
  faq: "FAQ",
  historical: "Historical",
  practical: "Practical",
  macro: "Macro",
  investment: "Investment",
  industry: "Industry",
  pillar: "Overview",
};

export function ArticleCard({
  slug,
  clusterSlug,
  title,
  summary,
  difficulty,
  articleType,
  isPillar,
}: ArticleCardProps) {
  return (
    <Link
      href={`/learn/${clusterSlug}/${slug}`}
      className={`group block rounded-lg border transition-all hover:border-brand-gold/40 hover:shadow-md ${
        isPillar
          ? "border-brand-gold/20 bg-[rgba(214,179,90,0.04)]"
          : "border-border bg-surface-1"
      } p-5`}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.beginner
          }`}
        >
          {DIFFICULTY_LABELS[difficulty] || difficulty}
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
          {TYPE_LABELS[articleType] || articleType}
        </span>
        {isPillar && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold">
            Pillar
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-content-0 group-hover:text-brand-gold transition-colors leading-snug mb-2">
        {title}
      </h3>
      <p className="text-sm text-content-2 leading-relaxed line-clamp-2">
        {summary}
      </p>
    </Link>
  );
}
