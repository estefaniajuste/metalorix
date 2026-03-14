import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { getDb } from "@/lib/db";
import { articles, articleTranslations } from "@/lib/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "news" });
  return {
    title: `${t("title")} — Metalorix`,
    description: t("subtitleEmpty"),
    alternates: getAlternates(locale, "/noticias"),
  };
}

export const revalidate = 300;

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
};

async function getPublishedArticles() {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(30);
  } catch {
    return [];
  }
}

async function getTranslationsForArticles(
  articleIds: number[],
  locale: string
): Promise<Map<number, { title: string; excerpt: string | null }>> {
  const map = new Map<number, { title: string; excerpt: string | null }>();
  if (locale === "es" || articleIds.length === 0) return map;

  const db = getDb();
  if (!db) return map;

  try {
    const rows = await db
      .select({
        articleId: articleTranslations.articleId,
        title: articleTranslations.title,
        excerpt: articleTranslations.excerpt,
      })
      .from(articleTranslations)
      .where(
        and(
          inArray(articleTranslations.articleId, articleIds),
          eq(articleTranslations.locale, locale)
        )
      );

    for (const row of rows) {
      map.set(row.articleId, { title: row.title, excerpt: row.excerpt });
    }
  } catch {
    // fallback to original Spanish
  }

  return map;
}

const sources = [
  "Reuters Commodities",
  "Kitco News",
  "World Gold Council",
  "BullionVault",
  "Investing.com",
  "London Bullion Market",
];

export default async function NoticiasPage() {
  const locale = await getLocale();
  const t = await getTranslations("news");
  const tc = await getTranslations("categories");
  const tm = await getTranslations("metalNames");
  const tn = await getTranslations("nav");
  const publishedArticles = await getPublishedArticles();
  const hasArticles = publishedArticles.length > 0;
  const translationsMap = await getTranslationsForArticles(
    publishedArticles.map((a) => a.id),
    locale
  );

  const contentTypes = [
    { title: t("dailySummary"), description: t("dailySummaryDesc"), frequency: t("dailySummaryFreq") },
    { title: t("weeklyAnalysis"), description: t("weeklyAnalysisDesc"), frequency: t("weeklyAnalysisFreq") },
    { title: t("marketAlert"), description: t("marketAlertDesc"), frequency: t("marketAlertFreq") },
    { title: t("educational"), description: t("educationalDesc"), frequency: t("educationalFreq") },
  ];

  const CATEGORY_LABELS: Record<string, string> = {
    daily: tc("daily"),
    weekly: tc("weekly"),
    event: tc("event"),
    educational: tc("educational"),
  };

  return (
    <section className="py-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mb-14">
          {!hasArticles && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider mb-5">
              {t("comingSoon")}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-content-2 leading-relaxed">
            {hasArticles ? t("subtitle") : t("subtitleEmpty")}
          </p>
        </div>

        {hasArticles && (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {publishedArticles.map((article) => {
                const mainMetal = article.metals?.[0] ?? "XAU";
                const color = METAL_COLORS[mainMetal] ?? "#D6B35A";
                const tr = translationsMap.get(article.id);
                const title = tr?.title ?? article.title;
                const excerpt = tr?.excerpt ?? article.excerpt;
                return (
                  <Link
                    key={article.id}
                    href={{ pathname: "/noticias/[slug]" as const, params: { slug: article.slug } }}
                    className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden hover:border-border-hover hover:shadow-card hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="h-1.5" style={{ backgroundColor: color }} />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
                          {CATEGORY_LABELS[article.category] ?? article.category}
                        </span>
                        {article.metals?.map((m) => (
                          <span key={m} className="inline-flex items-center gap-1 text-[10px] font-medium text-content-3">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: METAL_COLORS[m] ?? "#D6B35A" }} />
                            {tm(m as "XAU" | "XAG" | "XPT")}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-sm font-semibold text-content-0 leading-snug mb-2 line-clamp-2 group-hover:text-brand-gold transition-colors">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-xs text-content-2 leading-relaxed line-clamp-2 mb-3">{excerpt}</p>
                      )}
                      <div className="text-[10px] text-content-3">
                        {article.publishedAt?.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className={hasArticles ? "mt-8" : ""}>
          <h2 className="text-xl font-bold text-content-0 mb-6">
            {hasArticles ? t("contentTypes") : t("whatWePublish")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {contentTypes.map((type) => (
              <div key={type.title} className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-content-0">{type.title}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-2 text-content-3 uppercase tracking-wider">
                    {type.frequency}
                  </span>
                </div>
                <p className="text-sm text-content-2 leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 max-w-2xl mx-auto mb-12">
          <h3 className="text-base font-semibold text-content-0 mb-4 text-center">{t("sources")}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {sources.map((source) => (
              <span key={source} className="text-xs font-medium text-content-2 bg-surface-2 px-3 py-1.5 rounded-full">{source}</span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-content-2 mb-4">{t("checkPrices")}</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all">
              {t("viewDashboard")}
            </Link>
            <Link href={{ pathname: "/precio/[metal]" as const, params: { metal: getLocalizedMetalSlug("oro", locale) } }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-1 border border-border text-content-0 hover:border-border-hover transition-all">
              {t("goldPrice")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
