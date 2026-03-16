import { Link } from "@/i18n/navigation";

interface ArticleCardProps {
  slug: string;
  clusterSlug: string;
  localizedSlug?: string;
  localizedClusterSlug?: string;
  title: string;
  summary: string;
  difficulty: string;
  articleType: string;
  isPillar?: boolean;
  difficultyLabel: string;
  typeLabel: string;
  pillarLabel?: string;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced:
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function ArticleCard({
  slug,
  clusterSlug,
  localizedSlug,
  localizedClusterSlug,
  title,
  summary,
  difficulty,
  articleType,
  isPillar,
  difficultyLabel,
  typeLabel,
  pillarLabel,
}: ArticleCardProps) {
  return (
    <Link
      href={{ pathname: "/learn/[cluster]/[slug]" as const, params: { cluster: localizedClusterSlug ?? clusterSlug, slug: localizedSlug ?? slug } }}
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
          {difficultyLabel}
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
          {typeLabel}
        </span>
        {isPillar && pillarLabel && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold">
            {pillarLabel}
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
