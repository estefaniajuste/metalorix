import { Link } from "@/i18n/navigation";
import { HomeEmailCapture } from "@/components/dashboard/HomeEmailCapture";
import { getTranslations, getLocale } from "next-intl/server";
import { getLocalizedClusterSlug } from "@/lib/learn/slug-i18n";
import { getCategoryLabel } from "@/lib/data/glossary-categories";
import type { Locale } from "@/i18n/routing";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, glossaryTerms } from "@/lib/db/schema";
import { eq, desc, and, inArray } from "drizzle-orm";
import { DEALER_COUNTRIES, getDealersByCountry, getCountryName } from "@/lib/data/dealers";

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
  XPD: "#CED0CE",
  HG: "#B87333",
};

async function getLatestArticles() {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.publishedAt))
      .limit(6);
  } catch {
    return [];
  }
}

async function getTranslationsForArticles(
  articleIds: number[],
  locale: string
) {
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
    /* fallback to Spanish */
  }
  return map;
}

async function getFeaturedGlossary(locale: string) {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select({
        slug: glossaryTerms.slug,
        term: glossaryTerms.term,
        definition: glossaryTerms.definition,
        category: glossaryTerms.category,
      })
      .from(glossaryTerms)
      .where(and(eq(glossaryTerms.published, true), eq(glossaryTerms.locale, locale)))
      .orderBy(desc(glossaryTerms.createdAt))
      .limit(4);
    // Only show glossary in user's locale — never fallback to Spanish in EN/other locales
    return rows;
  } catch {
    return [];
  }
}

export async function HomePreview() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");
  const tm = await getTranslations("metalNames");

  const latestArticles = await getLatestArticles();
  const glossary = await getFeaturedGlossary(locale);
  const trMap = await getTranslationsForArticles(
    latestArticles.map((a) => a.id),
    locale
  );

  const hasNews = latestArticles.length > 0;
  const hasGlossary = glossary.length > 0;

  const CATEGORY_LABELS: Record<string, string> = {
    daily: tc("daily"),
    weekly: tc("weekly"),
    event: tc("event"),
    educational: tc("educational"),
  };

  const featuredArticle = hasNews ? latestArticles[0] : null;
  const restArticles = hasNews ? latestArticles.slice(1) : [];

  return (
    <section className="pb-[var(--section-py)]">
      <div className="mx-auto max-w-[1200px] px-6">
        {hasNews && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-2xl font-bold text-content-0 flex items-center gap-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                    <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
                    <line x1="10" y1="6" x2="18" y2="6" />
                    <line x1="10" y1="10" x2="18" y2="10" />
                    <line x1="10" y1="14" x2="14" y2="14" />
                  </svg>
                  {t("latestNews")}
                </h2>
                <p className="text-sm text-content-2 mt-1">
                  {t("latestNewsDesc")}
                </p>
              </div>
              <Link
                href="/noticias"
                className="text-sm font-semibold text-brand-gold hover:underline flex-shrink-0 flex items-center gap-1"
              >
                {t("viewAllNews")}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            {featuredArticle && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Featured article - large card */}
                <Link
                  href={{
                    pathname: "/noticias/[slug]" as const,
                    params: { slug: trMap.get(featuredArticle.id)?.slug ?? featuredArticle.slug },
                  }}
                  className="lg:col-span-2 bg-surface-1 border border-border rounded-DEFAULT overflow-hidden hover:border-border-hover hover:shadow-card-hover hover:-translate-y-0.5 transition-all group flex flex-col"
                >
                  <div
                    className="h-2"
                    style={{ backgroundColor: METAL_COLORS[featuredArticle.metals?.[0] ?? "XAU"] ?? "#D6B35A" }}
                  />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
                        {CATEGORY_LABELS[featuredArticle.category] ?? featuredArticle.category}
                      </span>
                      {featuredArticle.metals?.slice(0, 3).map((m) => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-content-3"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: METAL_COLORS[m] ?? "#D6B35A" }}
                          />
                          {tm(m as "XAU" | "XAG" | "XPT" | "XPD" | "HG")}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-bold text-content-0 leading-snug mb-3 group-hover:text-brand-gold transition-colors">
                      {trMap.get(featuredArticle.id)?.title ?? featuredArticle.title}
                    </h3>
                    {(trMap.get(featuredArticle.id)?.excerpt ?? featuredArticle.excerpt) && (
                      <p className="text-sm text-content-2 leading-relaxed line-clamp-4 mb-4 flex-1">
                        {trMap.get(featuredArticle.id)?.excerpt ?? featuredArticle.excerpt}
                      </p>
                    )}
                    <div className="text-[11px] text-content-3 mt-auto">
                      {featuredArticle.publishedAt?.toLocaleDateString(locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </Link>

                {/* Rest of articles - stacked */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restArticles.map((article) => {
                    const mainMetal = article.metals?.[0] ?? "XAU";
                    const color = METAL_COLORS[mainMetal] ?? "#D6B35A";
                    const tr = trMap.get(article.id);
                    const title = tr?.title ?? article.title;
                    const excerpt = tr?.excerpt ?? article.excerpt;
                    const linkSlug = tr?.slug ?? article.slug;
                    return (
                      <Link
                        key={article.id}
                        href={{
                          pathname: "/noticias/[slug]" as const,
                          params: { slug: linkSlug },
                        }}
                        className="bg-surface-1 border border-border rounded-DEFAULT overflow-hidden hover:border-border-hover hover:shadow-card hover:-translate-y-0.5 transition-all group"
                      >
                        <div className="h-1" style={{ backgroundColor: color }} />
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
                              {CATEGORY_LABELS[article.category] ?? article.category}
                            </span>
                            {article.metals?.slice(0, 2).map((m) => (
                              <span
                                key={m}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-content-3"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: METAL_COLORS[m] ?? "#D6B35A" }}
                                />
                                {tm(m as "XAU" | "XAG" | "XPT" | "XPD" | "HG")}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-sm font-semibold text-content-0 leading-snug mb-1.5 line-clamp-2 group-hover:text-brand-gold transition-colors">
                            {title}
                          </h3>
                          {excerpt && (
                            <p className="text-xs text-content-2 leading-relaxed line-clamp-2 mb-2">
                              {excerpt}
                            </p>
                          )}
                          <div className="text-[10px] text-content-3">
                            {article.publishedAt?.toLocaleDateString(locale, {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {hasGlossary && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-content-0">
                  {t("learnSection")}
                </h2>
                <p className="text-sm text-content-2 mt-1">
                  {t("learnSectionDesc")}
                </p>
              </div>
              <Link
                href="/learn"
                className="text-sm font-medium text-brand-gold hover:underline flex-shrink-0"
              >
                {t("viewAllLearn")} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {glossary.map((term) => (
                <Link
                  key={term.slug}
                  href={{ pathname: "/learn/[cluster]/[slug]" as const, params: { cluster: getLocalizedClusterSlug("glossary", locale as Locale), slug: term.slug } }}
                  className="bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-border-hover hover:-translate-y-0.5 transition-all group"
                >
                  {term.category && (
                    <span className="text-[10px] font-medium text-content-3 uppercase tracking-wider">
                      {getCategoryLabel(term.category, locale)}
                    </span>
                  )}
                  <h3 className="text-sm font-semibold text-content-0 mt-1 mb-1.5 group-hover:text-brand-gold transition-colors">
                    {term.term}
                  </h3>
                  {term.definition && (
                    <p className="text-xs text-content-2 leading-relaxed line-clamp-2">
                      {term.definition}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {!hasNews && !hasGlossary && (
          <div>
            <h2 className="text-xl font-bold text-content-0 mb-6">{t("exploreTitle")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: "/herramientas", title: "quickTools", desc: "quickToolsDesc" },
                { href: "/guia-inversion", title: "quickGuide", desc: "quickGuideDesc" },
                { href: "/learn", title: "quickLearn", desc: "quickLearnDesc" },
                { href: "/noticias", title: "quickNews", desc: "quickNewsDesc" },
              ].map(({ href, title, desc }) => (
                <Link
                  key={title}
                  href={href as any}
                  className="bg-surface-1 border border-border rounded-DEFAULT p-6 hover:border-border-hover hover:-translate-y-0.5 transition-all group"
                >
                  <h3 className="text-base font-semibold text-content-0 group-hover:text-brand-gold transition-colors">
                    {t(title)}
                  </h3>
                  <p className="text-sm text-content-2 mt-1">
                    {t(desc)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className={hasNews || hasGlossary ? "mt-14" : "mt-10"}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-content-0 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D6B35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                {t("quickTools")}
              </h2>
              <p className="text-sm text-content-2 mt-1">{t("quickToolsDesc")}</p>
            </div>
            <Link
              href="/herramientas"
              className="text-sm font-semibold text-brand-gold hover:underline flex-shrink-0 flex items-center gap-1"
            >
              {t("viewAllTools")}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              { href: "/ratio-oro-plata", icon: "⚖️", title: "quickRatio", desc: "quickRatioDesc" },
              { href: "/calculadora-rentabilidad", icon: "📈", title: "quickRoi", desc: "quickRoiDesc" },
              { href: "/conversor-divisas", icon: "💱", title: "quickConverter", desc: "quickConverterDesc" },
              { href: "/comparador", icon: "📊", title: "quickComparator", desc: "quickComparatorDesc" },
              { href: "/calendario-economico", icon: "📅", title: "quickCalendar", desc: "quickCalendarDesc" },
              { href: "/guia-inversion", icon: "📖", title: "quickGuide", desc: "quickGuideDesc" },
            ] as const).map(({ href, icon, title, desc }) => (
              <Link
                key={title}
                href={href as any}
                className="bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-brand-gold/30 hover:-translate-y-0.5 transition-all group text-center"
              >
                <span className="text-2xl block mb-2">{icon}</span>
                <h3 className="text-xs font-semibold text-content-0 group-hover:text-brand-gold transition-colors">
                  {t(title)}
                </h3>
                <p className="text-[10px] text-content-3 mt-0.5 leading-snug">{t(desc)}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <DealersBanner locale={locale} t={t} />
        </div>

        <div className="mt-10">
          <HomeEmailCapture />
        </div>
      </div>
    </section>
  );
}

interface DealersBannerProps {
  locale: string;
  t: Awaited<ReturnType<typeof getTranslations<"home">>>;
}

function DealersBanner({ locale, t }: DealersBannerProps) {
  const featured = DEALER_COUNTRIES.filter((c) => getDealersByCountry(c.code).length > 0).slice(0, 8);

  return (
    <div className="rounded-DEFAULT border border-border bg-surface-1 p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-content-0 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D6B35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {t("dealersBannerTitle")}
          </h2>
          <p className="text-sm text-content-2 mt-1 max-w-lg">
            {t("dealersBannerDesc")}
          </p>
        </div>
        <Link
          href="/donde-comprar"
          className="flex-shrink-0 text-sm font-semibold text-brand-gold hover:underline flex items-center gap-1"
        >
          {t("dealersBannerCta")}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {featured.map((country) => {
          const slug = country.slug[locale] ?? country.slug.en;
          const name = getCountryName(country, locale);
          const count = getDealersByCountry(country.code).length;
          return (
            <Link
              key={country.code}
              href={{ pathname: "/donde-comprar/[country]" as const, params: { country: slug } }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 border border-border hover:border-brand-gold/30 hover:bg-surface-3 transition-colors text-sm text-content-1"
            >
              <span aria-hidden="true">{country.flagEmoji}</span>
              <span className="font-medium">{name}</span>
              <span className="text-xs text-content-3">({count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
