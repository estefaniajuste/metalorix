import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getLocalizedMetalSlug } from "@/lib/utils/metal-slugs";
import { getDb } from "@/lib/db";
import { articles, articleTranslations } from "@/lib/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { NewsFilters, type NewsArticle } from "@/components/news/NewsFilters";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "news" });
  const rawDesc = t("subtitle");
  const description = rawDesc.length > 155 ? rawDesc.slice(0, rawDesc.slice(0, 155).lastIndexOf(" ")) : rawDesc;
  const alternates = getAlternates(locale, "/noticias");
  return {
    title: `${t("title")} — Metalorix`,
    description,
    alternates,
    openGraph: {
      title: `${t("title")} — Metalorix`,
      description,
      type: "website",
      url: alternates.canonical,
    },
  };
}

export const revalidate = 300;

async function getPublishedArticles() {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(100);
  } catch {
    return [];
  }
}

async function getTranslationsForArticles(
  articleIds: number[],
  locale: string
): Promise<Map<number, { title: string; excerpt: string | null; slug: string | null }>> {
  const map = new Map<number, { title: string; excerpt: string | null; slug: string | null }>();
  if (locale === "es" || articleIds.length === 0) return map;

  const db = getDb();
  if (!db) return map;

  try {
    const rows = await db
      .select({
        articleId: articleTranslations.articleId,
        title: articleTranslations.title,
        excerpt: articleTranslations.excerpt,
        slug: articleTranslations.slug,
      })
      .from(articleTranslations)
      .where(
        and(
          inArray(articleTranslations.articleId, articleIds),
          eq(articleTranslations.locale, locale)
        )
      );

    for (const row of rows) {
      map.set(row.articleId, { title: row.title, excerpt: row.excerpt, slug: row.slug });
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
  const publishedArticles = await getPublishedArticles();
  const hasArticles = publishedArticles.length > 0;
  const translationsMap = await getTranslationsForArticles(
    publishedArticles.map((a) => a.id),
    locale
  );

  const serializedArticles: NewsArticle[] = publishedArticles.map((article) => {
    const tr = translationsMap.get(article.id);
    return {
      id: article.id,
      slug: tr?.slug ?? article.slug,
      title: tr?.title ?? article.title,
      excerpt: tr?.excerpt ?? article.excerpt,
      category: article.category,
      metals: article.metals,
      publishedAt: article.publishedAt?.toISOString() ?? null,
    };
  });

  const contentTypes = [
    { title: t("dailySummary"), description: t("dailySummaryDesc"), frequency: t("dailySummaryFreq") },
    { title: t("weeklyAnalysis"), description: t("weeklyAnalysisDesc"), frequency: t("weeklyAnalysisFreq") },
    { title: t("marketAlert"), description: t("marketAlertDesc"), frequency: t("marketAlertFreq") },
    { title: t("educational"), description: t("educationalDesc"), frequency: t("educationalFreq") },
  ];

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

        {hasArticles && <NewsFilters articles={serializedArticles} />}

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
