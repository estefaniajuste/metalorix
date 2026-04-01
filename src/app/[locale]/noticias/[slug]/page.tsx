import type { Metadata } from "next";
import { Link, getPathname } from "@/i18n/navigation";
import { notFound, redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import type { Locale } from "@/i18n/routing";
import { getDb } from "@/lib/db";
import { articles, articleTranslations, glossaryTerms, learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and, ne, desc, sql } from "drizzle-orm";
import { injectGlossaryLinks } from "@/lib/ai/glossary-generator";
import { ArticleShareBar } from "@/components/dashboard/ArticleShareBar";
import { ContextualToolCards, InlineToolCallout, getToolsForNews } from "@/components/tools/ContextualToolCards";

async function getArticle(slug: string, locale: string) {
  const db = getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    if (result[0]) return result[0];

    // Resolve by translation slug (any locale) — enables redirect when wrong slug on /es/
    const anyTranslation = await db
      .select({ articleId: articleTranslations.articleId })
      .from(articleTranslations)
      .where(eq(articleTranslations.slug, slug))
      .limit(1);

    if (anyTranslation[0]) {
      const base = await db
        .select()
        .from(articles)
        .where(eq(articles.id, anyTranslation[0].articleId))
        .limit(1);
      return base[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

async function getTranslation(articleId: number, locale: string) {
  if (locale === "es") return null;

  const db = getDb();
  if (!db) return null;

  try {
    const result = await db
      .select({
        id: articleTranslations.id,
        articleId: articleTranslations.articleId,
        locale: articleTranslations.locale,
        slug: articleTranslations.slug,
        title: articleTranslations.title,
        excerpt: articleTranslations.excerpt,
        content: articleTranslations.content,
        createdAt: articleTranslations.createdAt,
      })
      .from(articleTranslations)
      .where(
        and(
          eq(articleTranslations.articleId, articleId),
          eq(articleTranslations.locale, locale)
        )
      )
      .limit(1);
    return result[0] ?? null;
  } catch {
    return null;
  }
}

/** Returns a map of locale → slug for all translations of an article. */
async function getAllTranslationSlugs(articleId: number): Promise<Record<string, string>> {
  const db = getDb();
  if (!db) return {};
  try {
    const rows = await db
      .select({ locale: articleTranslations.locale, slug: articleTranslations.slug })
      .from(articleTranslations)
      .where(eq(articleTranslations.articleId, articleId));
    const result: Record<string, string> = {};
    for (const r of rows) {
      if (r.slug) result[r.locale] = r.slug;
    }
    return result;
  } catch {
    return {};
  }
}

async function getRelatedArticles(articleId: number, category: string, locale: string) {
  const db = getDb();
  if (!db) return [];

  try {
    const rows = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        excerpt: articles.excerpt,
        category: articles.category,
        metals: articles.metals,
        publishedAt: articles.publishedAt,
      })
      .from(articles)
      .where(and(eq(articles.published, true), ne(articles.id, articleId)))
      .orderBy(desc(articles.publishedAt))
      .limit(12);

    const withTranslations = await Promise.all(
      rows.map(async (a) => {
        if (locale === "es") return { ...a, displayTitle: a.title, displayExcerpt: a.excerpt, displaySlug: a.slug };
        const [tr] = await db
          .select({ title: articleTranslations.title, excerpt: articleTranslations.excerpt, slug: articleTranslations.slug })
          .from(articleTranslations)
          .where(and(eq(articleTranslations.articleId, a.id), eq(articleTranslations.locale, locale)))
          .limit(1);
        return {
          ...a,
          displayTitle: tr?.title ?? a.title,
          displayExcerpt: tr?.excerpt ?? a.excerpt,
          displaySlug: tr?.slug ?? a.slug,
        };
      })
    );

    const sameCategory = withTranslations.filter((a) => a.category === category);
    const others = withTranslations.filter((a) => a.category !== category);
    return [...sameCategory, ...others].slice(0, 4);
  } catch {
    return [];
  }
}

async function getRelatedLearnArticles(metals: string[] | null, locale: string, limit = 3) {
  const db = getDb();
  if (!db || !metals || metals.length === 0) return [];
  try {
    // Find published learn articles that match the metals in this news article
    const rows = await db
      .select({
        slug: learnArticles.slug,
        clusterSlug: sql<string>`(SELECT slug FROM learn_clusters WHERE id = ${learnArticles.clusterId})`,
        locTitle: learnArticleLocalizations.title,
        locSlug: learnArticleLocalizations.slug,
        locSummary: learnArticleLocalizations.summary,
        locContent: learnArticleLocalizations.content,
        difficulty: learnArticles.difficulty,
      })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        and(
          eq(learnArticleLocalizations.articleId, learnArticles.id),
          eq(learnArticleLocalizations.locale, locale)
        )
      )
      .where(
        and(
          eq(learnArticles.status, "published"),
          eq(learnArticles.isPillar, true)
        )
      )
      .orderBy(desc(learnArticles.publishedAt))
      .limit(20);

    // Filter to those that mention the metals
    const metalSymbolMap: Record<string, string[]> = {
      XAU: ["gold", "oro", "XAU"],
      XAG: ["silver", "plata", "XAG"],
      XPT: ["platinum", "platino", "XPT"],
      XPD: ["palladium", "paladio", "XPD"],
      HG: ["copper", "cobre", "HG"],
    };
    const relevantKeywords = metals.flatMap((m) => metalSymbolMap[m] ?? [m.toLowerCase()]);

    const matched = rows.filter((r) => {
      const text = `${r.locTitle} ${r.locSummary}`.toLowerCase();
      return relevantKeywords.some((kw) => text.includes(kw));
    });

    return (matched.length >= limit ? matched : rows).slice(0, limit).map((r) => ({
      slug: r.slug,
      clusterSlug: r.clusterSlug || "investment",
      localizedSlug: r.locSlug ?? r.slug,
      title: r.locTitle,
      summary: r.locSummary?.slice(0, 100) ?? "",
      readingTimeMin: r.locContent ? Math.max(1, Math.round(r.locContent.split(/\s+/).length / 200)) : 3,
      difficulty: r.difficulty,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug, params.locale);

  if (!article) {
    const t = await getTranslations("article");
    return { title: t("notFound"), robots: { index: false, follow: false } };
  }

  const locale = params.locale;
  const translation = await getTranslation(article.id, locale);
  const title = translation?.title ?? article.title;
  const description = translation?.excerpt ?? article.excerpt ?? article.title;

  // Fetch all translation slugs to build correct per-locale hreflang alternates.
  // Without this, all locales would share the same slug (wrong language in URL).
  const slugsByLocale = await getAllTranslationSlugs(article.id);

  const alternates = getAlternates(locale, (loc) => ({
    pathname: "/noticias/[slug]",
    params: {
      slug: loc === "es" ? article.slug : (slugsByLocale[loc] ?? article.slug),
    },
  }));

  // Detect wrong-language slug (e.g. /en/news/metales-... instead of /en/news/precious-...)
  const correctSlug = locale === "es" ? article.slug : (translation?.slug ?? article.slug);
  const hasWrongSlug = params.slug !== correctSlug;

  return {
    title: `${title} | Metalorix`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: alternates.canonical,
      publishedTime: article.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates,
    // Prevent indexing when the URL slug doesn't match the locale's canonical slug.
    // The correct slug URL will be indexed via the canonical alternate.
    ...(hasWrongSlug && { robots: { index: false, follow: true } }),
  };
}

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
  XPD: "#CED0CE",
  HG: "#B87333",
};

function renderInlineLinks(text: string, glossarySlugsInLocale?: Set<string>, isSourcesSection?: boolean) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const linkText = match[1];
    const href = match[2];
    const isExternal = href.startsWith("http");

    const learnMatch =
      href.match(/^\/learn\/([^/]+)\/([^/]+)$/) ||
      href.match(/^\/aprende-inversion\/([^/]+)\/([^/]+)$/);
    const legacyAprendeMatch = href.match(/^\/aprende\/(.+)$/);

    const isGlossaryLink = learnMatch?.[1] === "glossary" || !!legacyAprendeMatch;
    const glossarySlug = isGlossaryLink
      ? (learnMatch?.[2] || legacyAprendeMatch?.[1])
      : null;

    if (isGlossaryLink && glossarySlugsInLocale && glossarySlug && !glossarySlugsInLocale.has(glossarySlug)) {
      parts.push(linkText);
    } else if (learnMatch) {
      parts.push(
        <Link
          key={match.index}
          href={{ pathname: "/learn/[cluster]/[slug]" as const, params: { cluster: learnMatch[1], slug: learnMatch[2] } }}
          className="text-brand-gold hover:underline font-medium"
        >
          {linkText}
        </Link>
      );
    } else if (legacyAprendeMatch) {
      parts.push(
        <Link
          key={match.index}
          href={{ pathname: "/learn/[cluster]/[slug]" as const, params: { cluster: "glossary", slug: legacyAprendeMatch[1] } }}
          className="text-brand-gold hover:underline font-medium"
        >
          {linkText}
        </Link>
      );
    } else if (isExternal) {
      if (isSourcesSection) {
        parts.push(
          <a
            key={match.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold hover:underline font-medium"
          >
            {linkText}
          </a>
        );
      } else {
        parts.push(linkText);
      }
    } else {
      parts.push(linkText);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const t = await getTranslations("article");
  const tc = await getTranslations("common");
  const tn = await getTranslations("metalNames");
  const tcat = await getTranslations("categories");
  const locale = await getLocale();

  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      daily: tcat("daily"),
      weekly: tcat("weekly"),
      event: tcat("event"),
      educational: tcat("educational"),
    };
    return map[cat] ?? cat;
  };

  const metalName = (symbol: string) => {
    const map: Record<string, string> = {
      XAU: tn("XAU"),
      XAG: tn("XAG"),
      XPT: tn("XPT"),
      XPD: tn("XPD"),
      HG: tn("HG"),
    };
    return map[symbol] ?? symbol;
  };

  const article = await getArticle(params.slug, locale);

  if (!article) {
    notFound();
  }

  const translation = await getTranslation(article.id, locale);
  // Redirect to correct localized slug when URL has wrong-language slug
  // - Spanish page with English slug: /es/noticias/precious-metals-... → /es/noticias/metales-preciosos-...
  // - English page with Spanish slug: /en/news/metales-preciosos-... → /en/news/precious-metals-...
  const correctSlug = locale === "es" ? article.slug : (translation?.slug ?? article.slug);
  if (params.slug !== correctSlug) {
    redirect(getPathname({ locale: locale as Locale, href: { pathname: "/noticias/[slug]", params: { slug: correctSlug } } as any }));
  }

  const displayTitle = translation?.title ?? article.title;
  const displayExcerpt = translation?.excerpt ?? article.excerpt;
  const displayContent = translation?.content ?? article.content;
  const displaySlug = translation?.slug ?? article.slug;

  const linkedContent = await injectGlossaryLinks(displayContent);
  const relatedNews = await getRelatedArticles(article.id, article.category, locale);
  const relatedLearn = await getRelatedLearnArticles(article.metals, locale, 3);
  const wordCount = displayContent ? displayContent.split(/\s+/).length : 0;
  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  let glossarySlugsInLocale: Set<string> | undefined;
  {
    const db = getDb();
    if (db) {
      try {
        const rows = await db
          .select({ slug: glossaryTerms.slug })
          .from(glossaryTerms)
          .where(and(eq(glossaryTerms.locale, locale), eq(glossaryTerms.published, true)));
        glossarySlugsInLocale = new Set(rows.map((r) => r.slug));
      } catch {
        glossarySlugsInLocale = new Set();
      }
    } else {
      glossarySlugsInLocale = new Set();
    }
  }

  const citations = (() => {
    const lines = displayContent.split("\n");
    const sourcesRe = /^##\s*(Fuentes|Sources|Quellen|Kaynaklar|المصادر|来源)\s*$/i;
    const linkRe = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/g;
    let inSrc = false;
    const urls: string[] = [];
    for (const line of lines) {
      if (sourcesRe.test(line)) { inSrc = true; continue; }
      if (inSrc && line.startsWith("## ")) break;
      if (inSrc) {
        let m;
        while ((m = linkRe.exec(line)) !== null) urls.push(m[1]);
      }
    }
    return urls;
  })();

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: displayTitle,
    description: displayExcerpt,
    url: `https://metalorix.com${getPathname({ locale: locale as Locale, href: { pathname: "/noticias/[slug]", params: { slug: displaySlug } } as any })}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    wordCount,
    inLanguage: locale,
    author: {
      "@type": "Organization",
      name: "Metalorix",
      url: "https://metalorix.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Metalorix",
      url: "https://metalorix.com",
      logo: {
        "@type": "ImageObject",
        url: "https://metalorix.com/icon-512.png",
      },
    },
  };
  if (citations.length > 0) {
    jsonLd.citation = citations.map((u) => ({ "@type": "WebPage", url: u }));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[780px] px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-content-3 mb-6" aria-label={tc("breadcrumbNav")}>
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/noticias"
              className="hover:text-content-1 transition-colors"
            >
              {t("breadcrumbNews")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1 truncate max-w-[200px] inline-block align-bottom">
              {displayTitle}
            </span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
                {categoryLabel(article.category)}
              </span>
              {article.metals?.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-2"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: METAL_COLORS[m] ?? "#D6B35A",
                    }}
                  />
                  {metalName(m)}
                </span>
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight leading-tight mb-4">
              {displayTitle}
            </h1>

            {displayExcerpt && (
              <p className="text-lg text-content-2 leading-relaxed">
                {displayExcerpt}
              </p>
            )}

            <div className="flex items-center gap-4 mt-5 text-xs text-content-3">
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString(locale, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              <span className="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {readingMinutes} {t("minRead")}
              </span>
              <span>Metalorix</span>
            </div>

            <div className="mt-5">
              <ArticleShareBar
                title={displayTitle}
                url={`https://metalorix.com${getPathname({ locale: locale as Locale, href: { pathname: "/noticias/[slug]", params: { slug: displaySlug } } as any })}`}
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
            {(() => {
              const lines = linkedContent.split("\n");
              let inSources = false;
              let h2Count = 0;
              const inlineToolId = getToolsForNews(article.metals)[0];
              const elements: React.ReactNode[] = [];
              lines.forEach((paragraph, i) => {
                if (!paragraph.trim()) return;
                const sourcesHeading = /^##\s*(Fuentes|Sources|Quellen|Kaynaklar|المصادر|来源)\s*$/i;
                if (sourcesHeading.test(paragraph)) inSources = true;
                if (paragraph.startsWith("## ")) {
                  h2Count++;
                  if (h2Count === 3 && inlineToolId) {
                    elements.push(
                      <InlineToolCallout
                        key="inline-tool"
                        toolId={inlineToolId}
                        label={t(`tool${inlineToolId.charAt(0).toUpperCase()}${inlineToolId.slice(1)}` as any)}
                        hint={t(`tool${inlineToolId.charAt(0).toUpperCase()}${inlineToolId.slice(1)}Hint` as any)}
                        cta={t("tryCta")}
                      />
                    );
                  }
                  elements.push(
                    <h2 key={i}>{renderInlineLinks(paragraph.replace("## ", ""), glossarySlugsInLocale, inSources)}</h2>
                  );
                  return;
                }
                if (paragraph.startsWith("### ")) {
                  elements.push(
                    <h3 key={i}>{renderInlineLinks(paragraph.replace("### ", ""), glossarySlugsInLocale, inSources)}</h3>
                  );
                  return;
                }
                if (paragraph.startsWith("- ")) {
                  elements.push(
                    <li key={i} className="ml-5 list-disc">{renderInlineLinks(paragraph.slice(2), glossarySlugsInLocale, inSources)}</li>
                  );
                  return;
                }
                elements.push(<p key={i}>{renderInlineLinks(paragraph, glossarySlugsInLocale, inSources)}</p>);
              });
              return elements;
            })()}
          </div>

          {/* Share + Footer */}
          <div className="mt-10 pt-6 border-t border-border">
            <ArticleShareBar
              title={displayTitle}
              url={`https://metalorix.com${getPathname({ locale: locale as Locale, href: { pathname: "/noticias/[slug]", params: { slug: displaySlug } } as any })}`}
            />
          </div>

          {relatedNews.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="text-lg font-bold text-content-0 mb-4">{t("relatedNews")}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {relatedNews.map((r) => (
                  <Link
                    key={r.id}
                    href={{ pathname: "/noticias/[slug]", params: { slug: r.displaySlug } }}
                    className="group block p-4 rounded-lg bg-surface-1 border border-border hover:border-brand-gold/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider">
                        {categoryLabel(r.category)}
                      </span>
                      {r.publishedAt && (
                        <time className="text-[10px] text-content-3" dateTime={r.publishedAt.toISOString()}>
                          {r.publishedAt.toLocaleDateString(locale, { month: "short", day: "numeric" })}
                        </time>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-content-0 group-hover:text-brand-gold transition-colors leading-snug line-clamp-2">
                      {r.displayTitle}
                    </h3>
                    {r.displayExcerpt && (
                      <p className="mt-1 text-xs text-content-3 line-clamp-2">{r.displayExcerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedLearn.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <h2 className="text-lg font-bold text-content-0 mb-4">{t("learnMore")}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {relatedLearn.map((article) => (
                  <Link
                    key={article.slug}
                    href={{
                      pathname: "/learn/[cluster]/[slug]" as const,
                      params: { cluster: article.clusterSlug, slug: article.localizedSlug },
                    }}
                    className="group flex flex-col gap-2 p-4 rounded-lg border border-border bg-surface-1 hover:border-brand-gold/40 hover:bg-surface-2 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
                        {article.difficulty}
                      </span>
                      <span className="text-[10px] text-content-3 inline-flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {article.readingTimeMin} min
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-content-0 group-hover:text-brand-gold transition-colors leading-snug">
                      {article.title}
                    </span>
                    {article.summary && (
                      <p className="text-xs text-content-3 line-clamp-2 leading-relaxed">{article.summary}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ContextualToolCards
            toolIds={getToolsForNews(article.metals)}
            heading={t("tryTheseTools")}
            labels={{
              ratio: t("toolRatio"),
              ratioHint: t("toolRatioHint"),
              roi: t("toolRoi"),
              roiHint: t("toolRoiHint"),
              converter: t("toolConverter"),
              converterHint: t("toolConverterHint"),
              comparator: t("toolComparator"),
              comparatorHint: t("toolComparatorHint"),
              calendar: t("toolCalendar"),
              calendarHint: t("toolCalendarHint"),
              alerts: t("toolAlerts"),
              alertsHint: t("toolAlertsHint"),
              guide: t("toolGuide"),
              guideHint: t("toolGuideHint"),
            }}
          />

          <footer className="mt-8 pt-8 border-t border-border">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-5">
              <p className="text-xs text-content-3 leading-relaxed">
                {t("aiDisclaimer")}
              </p>
            </div>

            <div className="mt-8 bg-surface-1 border border-brand-gold/20 rounded-DEFAULT p-6 text-center">
              <p className="text-sm font-semibold text-content-0 mb-1">{tc("alertPromo")}</p>
              <p className="text-xs text-content-3 mb-4">{tc("alertPromoDesc")}</p>
              <Link
                href="/alertas"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#0B0F17] bg-brand-gold hover:brightness-110 transition-all px-5 py-2 rounded-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
                {tc("alertPromoCta")}
              </Link>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t("allNews")}
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                {tc("breadcrumbHome")}
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
