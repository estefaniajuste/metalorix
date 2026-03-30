import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { howToSchema, organizationSchema } from "@/lib/seo/schemas";
import { getPathname } from "@/i18n/navigation";
import { getDb } from "@/lib/db";
import {
  learnArticles,
  learnArticleLocalizations,
  learnClusters,
  learnInternalLinks,
  glossaryTerms,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getTopicBySlug } from "@/lib/learn/topics";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { suggestInternalLinks } from "@/lib/learn/internal-links";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { RelatedArticles } from "@/components/learn/RelatedArticles";
import { LearnPriceBanner } from "@/components/learn/LearnPriceBanner";
import {
  getLocalizedCluster,
  getLocalizedSubcluster,
} from "@/lib/learn/taxonomy-i18n";
import {
  getBaseClusterSlug,
  getLocalizedClusterSlug,
  getBaseArticleSlug,
  getLocalizedArticleSlug,
  getArticleSlugsForAllLocales,
} from "@/lib/learn/slug-i18n";
import { routing } from "@/i18n/routing";
import { SetLocalePathOverrides } from "@/components/layout/SetLocalePathOverrides";
import { ContextualToolCards, InlineToolCallout, getToolsForArticle } from "@/components/tools/ContextualToolCards";
import type { Locale } from "@/i18n/config";

async function findArticleInDb(slug: string): Promise<{ slug: string; clusterSlug: string } | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const [row] = await db
      .select({ slug: learnArticles.slug, clusterSlug: learnClusters.slug })
      .from(learnArticles)
      .innerJoin(learnClusters, eq(learnClusters.id, learnArticles.clusterId))
      .where(eq(learnArticles.slug, slug))
      .limit(1);
    if (row) return row;

    const [locRow] = await db
      .select({
        slug: learnArticles.slug,
        clusterSlug: learnClusters.slug,
      })
      .from(learnArticleLocalizations)
      .innerJoin(learnArticles, eq(learnArticles.id, learnArticleLocalizations.articleId))
      .innerJoin(learnClusters, eq(learnClusters.id, learnArticles.clusterId))
      .where(eq(learnArticleLocalizations.slug, slug))
      .limit(1);
    return locRow ?? null;
  } catch {
    return null;
  }
}

function truncateDescription(text: string, maxLen = 155): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastPeriod = truncated.lastIndexOf(".");
  if (lastPeriod > maxLen * 0.6) return truncated.slice(0, lastPeriod + 1);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLen * 0.6) return truncated.slice(0, lastSpace);
  return truncated;
}

export const revalidate = 3600;

async function getArticleData(slug: string, locale: string) {
  const db = getDb();
  if (!db) return null;

  try {
    const [article] = await db
      .select()
      .from(learnArticles)
      .where(eq(learnArticles.slug, slug))
      .limit(1);

    if (!article) return null;

    const [loc] = await db
      .select()
      .from(learnArticleLocalizations)
      .where(
        and(
          eq(learnArticleLocalizations.articleId, article.id),
          eq(learnArticleLocalizations.locale, locale)
        )
      )
      .limit(1);

    const localization =
      loc ||
      (
        await db
          .select()
          .from(learnArticleLocalizations)
          .where(
            and(
              eq(learnArticleLocalizations.articleId, article.id),
              eq(learnArticleLocalizations.locale, "en")
            )
          )
          .limit(1)
      )[0];

    if (!localization) return null;

    const links = await db
      .select({
        targetSlug: learnArticles.slug,
        targetCluster: learnArticles.clusterId,
        linkType: learnInternalLinks.linkType,
        anchor: learnInternalLinks.anchor,
        relevanceScore: learnInternalLinks.relevanceScore,
      })
      .from(learnInternalLinks)
      .innerJoin(
        learnArticles,
        eq(learnInternalLinks.targetArticleId, learnArticles.id)
      )
      .where(eq(learnInternalLinks.sourceArticleId, article.id))
      .limit(8);

    return { article, localization, links };
  } catch {
    return null;
  }
}

async function getGlossaryTermData(slug: string, locale: string) {
  const db = getDb();
  if (!db) return null;

  try {
    // Try user's locale first
    const [localized] = await db
      .select()
      .from(glossaryTerms)
      .where(
        and(
          eq(glossaryTerms.slug, slug),
          eq(glossaryTerms.locale, locale),
          eq(glossaryTerms.published, true)
        )
      )
      .limit(1);

    if (localized) return { term: localized, isLocaleMatch: true };

    // Fall back to any published version (typically "es")
    const [fallback] = await db
      .select()
      .from(glossaryTerms)
      .where(and(eq(glossaryTerms.slug, slug), eq(glossaryTerms.published, true)))
      .limit(1);

    if (fallback) return { term: fallback, isLocaleMatch: false };
    return null;
  } catch {
    return null;
  }
}

/**
 * Resolve incoming params to base slugs, handling both localized and base slugs.
 */
async function resolveParams(
  params: { cluster: string; slug: string },
  locale: Locale
) {
  const baseClusterSlug = getBaseClusterSlug(params.cluster, locale);

  // Try the slug as a base slug first (topic files are keyed by base slug)
  let topic = getTopicBySlug(params.slug);

  // If not found, try resolving as a localized slug from the DB
  if (!topic) {
    const resolvedBase = await getBaseArticleSlug(params.slug, locale);
    if (resolvedBase) {
      topic = getTopicBySlug(resolvedBase);
    }
  }

  return { baseClusterSlug, topic };
}

export async function generateMetadata({
  params,
}: {
  params: { cluster: string; slug: string };
}): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const tl = await getTranslations({ locale, namespace: "learnSection" });

  const { baseClusterSlug, topic } = await resolveParams(params, locale);

  if (!topic && baseClusterSlug === "glossary") {
    const glossaryData = await getGlossaryTermData(params.slug, locale);
    if (glossaryData) {
      const { term: gTerm, isLocaleMatch } = glossaryData;
      const title = isLocaleMatch ? gTerm.term : tl("typeGlossary");
      const description = isLocaleMatch
        ? truncateDescription(gTerm.definition, 155)
        : tl("title");
      const alternates = getAlternates(locale, (loc) => ({
        pathname: "/learn/[cluster]/[slug]",
        params: {
          cluster: getLocalizedClusterSlug("glossary", loc),
          slug: gTerm.slug,
        },
      }));
      return {
        title: `${title} | Metalorix`,
        description,
        openGraph: {
          title,
          description,
          type: "article",
          url: alternates.canonical,
        },
        twitter: {
          card: "summary",
          title,
          description,
        },
        alternates,
        ...(isLocaleMatch ? {} : { robots: { index: false } }),
      };
    }
  }

  if (!topic) {
    const dbMatch = await findArticleInDb(params.slug);
    if (dbMatch) {
      return { title: "Redirecting...", robots: { index: false, follow: false } };
    }
    return { title: tl("notFound"), robots: { index: false, follow: false } };
  }

  if (topic.clusterSlug !== baseClusterSlug) {
    return { title: "Redirecting...", robots: { index: false, follow: false } };
  }

  const data = await getArticleData(topic.slug, locale);
  const rawTitle = data?.localization.seoTitle || topic.titleEn;
  const title = rawTitle
    .replace(/\s*\|\s*Metalorix\s*(Learn)?\s*/gi, "")
    .trim();
  const rawDesc = data?.localization.metaDescription || topic.summaryEn;
  const description = truncateDescription(rawDesc, 155);

  const metaSlugsByLocale = await getArticleSlugsForAllLocales(topic.slug);

  const alternates = getAlternates(locale, (loc) => ({
    pathname: "/learn/[cluster]/[slug]",
    params: {
      cluster: getLocalizedClusterSlug(baseClusterSlug, loc),
      slug: metaSlugsByLocale.get(loc) || topic.slug,
    },
  }));

  return {
    title: `${title} | Metalorix`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: alternates.canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates,
  };
}

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-rose-500/10 text-rose-400",
};

export default async function LearnArticlePage({
  params,
}: {
  params: { cluster: string; slug: string };
}) {
  const tc = await getTranslations("common");
  const t = await getTranslations("learnSection");
  const locale = (await getLocale()) as Locale;

  const { baseClusterSlug, topic } = await resolveParams(params, locale);

  if ((!topic || topic.clusterSlug !== baseClusterSlug) && baseClusterSlug === "glossary") {
    const glossaryData = await getGlossaryTermData(params.slug, locale);
    if (glossaryData) {
      const { term: glossaryTerm, isLocaleMatch } = glossaryData;
      const locClusterSlug = getLocalizedClusterSlug("glossary", locale);
      const localizedCluster = getLocalizedCluster("glossary", locale);
      const clusterName = localizedCluster?.name ?? "Glossary & Terminology";
      const showContent = isLocaleMatch;

      return (
        <article className="py-[var(--section-py)]">
          <div className="mx-auto max-w-[780px] px-6">
            <LearnBreadcrumb
              items={[
                { label: tc("breadcrumbHome"), href: "/" },
                { label: t("breadcrumb"), href: "/learn" },
                {
                  label: clusterName,
                  href: { pathname: "/learn/[cluster]" as const, params: { cluster: locClusterSlug } },
                },
                { label: showContent ? glossaryTerm.term : t("typeGlossary") },
              ]}
              locale={locale}
              ariaLabel={tc("breadcrumbNav")}
            />

            {showContent ? (
              <>
                <header className="mb-8">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                      {t("difficultyBeginner")}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
                      {t("typeGlossary")}
                    </span>
                    {glossaryTerm.category && (
                      <span className="text-[10px] text-content-3">
                        {glossaryTerm.category}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight leading-tight mb-4">
                    {glossaryTerm.term}
                  </h1>

                  <p className="text-lg text-content-2 leading-relaxed">
                    {glossaryTerm.definition}
                  </p>
                </header>

                {glossaryTerm.content ? (
                  <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
                    {glossaryTerm.content.split("\n").map((line, i) => {
                      if (!line.trim()) return null;
                      if (line.startsWith("## "))
                        return <h2 key={i}>{line.slice(3)}</h2>;
                      if (line.startsWith("### "))
                        return <h3 key={i}>{line.slice(4)}</h3>;
                      if (line.startsWith("- "))
                        return (
                          <ul key={i}>
                            <li>{line.slice(2)}</li>
                          </ul>
                        );
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-lg border border-border bg-surface-1 text-center">
                    <p className="text-content-2 mb-2">
                      {t("preparingArticle")}
                    </p>
                    <p className="text-sm text-content-3">
                      {t("preparingArticleHint", { name: clusterName })}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <header className="mb-8">
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
                      {t("typeGlossary")}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight leading-tight mb-4">
                    {t("typeGlossary")}
                  </h1>
                </header>

                <div className="p-8 rounded-lg border border-border bg-surface-1 text-center">
                  <p className="text-content-2 mb-2">
                    {t("contentComingSoon")}
                  </p>
                  <p className="text-sm text-content-3">
                    {t("preparingArticleHint", { name: clusterName })}
                  </p>
                </div>
              </>
            )}

            <footer className="mt-10 pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <Link
                  href={{ pathname: "/learn/[cluster]" as const, params: { cluster: locClusterSlug } }}
                  className="inline-flex items-center gap-2 text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {t("backTo", { name: clusterName })}
                </Link>
                <Link
                  href="/learn"
                  className="text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
                >
                  {t("allTopics")}
                </Link>
              </div>
            </footer>
          </div>
        </article>
      );
    }
  }

  if (topic && topic.clusterSlug !== baseClusterSlug) {
    const correctCluster = getLocalizedClusterSlug(topic.clusterSlug, locale);
    const correctSlug = (await getLocalizedArticleSlug(topic.slug, locale)) || topic.slug;
    const path = getPathname({
      locale: locale as Locale,
      href: { pathname: "/learn/[cluster]/[slug]", params: { cluster: correctCluster, slug: correctSlug } } as any,
    });
    permanentRedirect(path);
  }

  if (!topic) {
    const dbMatch = await findArticleInDb(params.slug);
    if (dbMatch) {
      const correctCluster = getLocalizedClusterSlug(dbMatch.clusterSlug, locale);
      const correctSlug = (await getLocalizedArticleSlug(dbMatch.slug, locale)) || dbMatch.slug;
      const path = getPathname({
        locale: locale as Locale,
        href: { pathname: "/learn/[cluster]/[slug]", params: { cluster: correctCluster, slug: correctSlug } } as any,
      });
      permanentRedirect(path);
    }
    notFound();
  }

  const cluster = TAXONOMY.find((c) => c.slug === baseClusterSlug);
  const subcluster = cluster?.subclusters.find(
    (s) => s.slug === topic.subclusterSlug
  );

  const localizedCluster = getLocalizedCluster(baseClusterSlug, locale);
  const clusterName = localizedCluster?.name ?? cluster?.nameEn ?? baseClusterSlug;
  const localizedSub = subcluster
    ? getLocalizedSubcluster(subcluster.slug, locale)
    : null;
  const subclusterName = localizedSub?.name ?? subcluster?.nameEn;

  const locClusterSlug = getLocalizedClusterSlug(baseClusterSlug, locale);

  const DIFFICULTY_KEY: Record<string, string> = {
    beginner: "difficultyBeginner",
    intermediate: "difficultyIntermediate",
    advanced: "difficultyAdvanced",
  };
  const TYPE_KEY: Record<string, string> = {
    glossary: "typeGlossary",
    explainer: "typeExplainer",
    guide: "typeGuide",
    comparison: "typeComparison",
    faq: "typeFaq",
    historical: "typeHistorical",
    practical: "typePractical",
    macro: "typeMacro",
    investment: "typeInvestment",
    industry: "typeIndustry",
    pillar: "typePillar",
  };

  const data = await getArticleData(topic.slug, locale);

  const linkSuggestions = suggestInternalLinks(topic.slug, 6);
  const relatedArticlesBases = (data?.links || []).length > 0
    ? data!.links.map((l) => ({
        slug: l.targetSlug,
        clusterSlug: topic.clusterSlug,
        title: l.anchor || l.targetSlug,
        difficulty: topic.difficulty,
        linkType: l.linkType,
      }))
    : linkSuggestions.map((l) => {
        const tp = getTopicBySlug(l.targetSlug);
        return {
          slug: l.targetSlug,
          clusterSlug: tp?.clusterSlug || baseClusterSlug,
          title: l.suggestedAnchor,
          difficulty: tp?.difficulty || "beginner",
          linkType: l.linkType,
        };
      });

  // Fetch summary + word count for related articles to enrich the cards
  const db2 = getDb();
  const relatedSummaries = db2
    ? await (async () => {
        try {
          const slugs = relatedArticlesBases.map((a) => a.slug);
          if (slugs.length === 0) return new Map<string, { summary: string; wordCount: number }>();
          const { inArray: inArrayFn } = await import("drizzle-orm");
          const rows = await db2
            .select({
              slug: learnArticles.slug,
              summary: learnArticleLocalizations.summary,
              content: learnArticleLocalizations.content,
            })
            .from(learnArticles)
            .innerJoin(
              learnArticleLocalizations,
              eq(learnArticleLocalizations.articleId, learnArticles.id)
            )
            .where(
              eq(learnArticleLocalizations.locale, locale)
            )
            .then((all) => all.filter((r) => slugs.includes(r.slug)));
          const map = new Map<string, { summary: string; wordCount: number }>();
          for (const r of rows) {
            map.set(r.slug, {
              summary: r.summary || "",
              wordCount: r.content ? r.content.split(/\s+/).length : 0,
            });
          }
          return map;
        } catch { return new Map<string, { summary: string; wordCount: number }>(); }
      })()
    : new Map<string, { summary: string; wordCount: number }>();

  const relatedArticles = await Promise.all(
    relatedArticlesBases.map(async (article) => {
      const extra = relatedSummaries.get(article.slug);
      return {
        ...article,
        summary: extra?.summary?.slice(0, 120) || "",
        readingTimeMin: extra?.wordCount ? Math.max(1, Math.round(extra.wordCount / 200)) : undefined,
        localizedSlug: await getLocalizedArticleSlug(article.slug, locale),
        localizedClusterSlug: getLocalizedClusterSlug(article.clusterSlug, locale),
      };
    })
  );

  const title = data?.localization.title || topic.titleEn;
  const summary = data?.localization.summary || topic.summaryEn;
  const keyIdea = data?.localization.keyIdea || "";
  const content = data?.localization.content || "";
  const keyTakeaways = data?.localization.keyTakeaways
    ? (() => {
        try { return JSON.parse(data.localization.keyTakeaways); }
        catch { return []; }
      })()
    : [];
  const faq = data?.localization.faq
    ? (() => {
        try { return JSON.parse(data.localization.faq); }
        catch { return []; }
      })()
    : [];

  const strippedContent = content
    .replace(/## Key Takeaways[\s\S]*?(?=\n## |\n*$)/, "")
    .replace(/## Frequently Asked Questions[\s\S]*?(?=\n## |\n*$)/, "")
    .trim();
  const hasContent = strippedContent.length > 0;

  const articleSlugsByLocale = await getArticleSlugsForAllLocales(topic.slug);

  const localeHrefs: Record<string, { pathname: string; params: { cluster: string; slug: string } }> = {};
  for (const loc of routing.locales) {
    localeHrefs[loc] = {
      pathname: "/learn/[cluster]/[slug]",
      params: {
        cluster: getLocalizedClusterSlug(baseClusterSlug, loc as Locale),
        slug: articleSlugsByLocale.get(loc) || topic.slug,
      },
    };
  }

  const alternates = getAlternates(locale, (loc) => ({
    pathname: "/learn/[cluster]/[slug]",
    params: {
      cluster: getLocalizedClusterSlug(baseClusterSlug, loc),
      slug: articleSlugsByLocale.get(loc) || topic.slug,
    },
  }));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tc("breadcrumbHome"),
        item: `https://metalorix.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("breadcrumb"),
        item: `https://metalorix.com/${locale}/learn`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: clusterName,
        item: `https://metalorix.com/${locale}/learn/${locClusterSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: title,
      },
    ],
  };

  const wordCount = content ? content.split(/\s+/).length : 0;

  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: summary,
    url: alternates.canonical,
    inLanguage: locale,
    ...(wordCount > 0 && { wordCount }),
    ...(data?.article.publishedAt && {
      datePublished: data.article.publishedAt.toISOString(),
    }),
    ...(data?.article.updatedAt && {
      dateModified: data.article.updatedAt.toISOString(),
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": alternates.canonical,
    },
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
        url: "https://metalorix.com/favicon.png",
      },
    },
  };

  const faqJsonLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item: { question: string; answer: string }) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  // HowTo schema for guide/practical articles — extracts ## headings as steps
  const HOW_TO_TYPES = ["guide", "practical", "how-to", "tutorial"];
  const howToJsonLd =
    HOW_TO_TYPES.includes(topic.articleType) && hasContent && data?.localization
      ? (() => {
          const steps: { name: string; text: string }[] = [];
          const lines = strippedContent.split("\n");
          let currentStep: { name: string; lines: string[] } | null = null;
          for (const line of lines) {
            if (line.startsWith("## ")) {
              if (currentStep && currentStep.lines.some((l) => l.trim().length > 0)) {
                steps.push({ name: currentStep.name, text: currentStep.lines.join(" ").trim().slice(0, 300) });
              }
              currentStep = { name: line.replace(/^## /, "").trim(), lines: [] };
            } else if (currentStep && line.trim().length > 0 && !line.startsWith("#")) {
              currentStep.lines.push(line.trim());
            }
          }
          if (currentStep && currentStep.lines.some((l) => l.trim().length > 0)) {
            steps.push({ name: currentStep.name, text: currentStep.lines.join(" ").trim().slice(0, 300) });
          }
          if (steps.length < 2) return null;
          return howToSchema({
            name: title,
            description: data.localization.summary || "",
            steps,
            url: alternates.canonical || "",
            locale,
          });
        })()
      : null;

  const orgJsonLd = organizationSchema();

  return (
    <>
      <SetLocalePathOverrides hrefs={localeHrefs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <article className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[780px] px-6">
          <LearnBreadcrumb
            items={[
              { label: tc("breadcrumbHome"), href: "/" },
              { label: t("breadcrumb"), href: "/learn" },
              {
                label: clusterName,
                href: { pathname: "/learn/[cluster]", params: { cluster: locClusterSlug } },
              },
              { label: title },
            ]}
            locale={locale}
            ariaLabel={tc("breadcrumbNav")}
          />

          <LearnPriceBanner clusterSlug={baseClusterSlug} articleSlug={topic.slug} locale={locale} />

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                  DIFFICULTY_STYLES[topic.difficulty] || ""
                }`}
              >
                {t(DIFFICULTY_KEY[topic.difficulty] ?? "difficultyBeginner")}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
                {t(TYPE_KEY[topic.articleType] ?? "typePillar")}
              </span>
              {subclusterName && (
                <span className="text-[10px] text-content-3">
                  {subclusterName}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight leading-tight mb-4">
              {title}
            </h1>

            <div className="flex items-center gap-3 mb-4 text-xs text-content-3">
              {content && (
                <span className="inline-flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {Math.max(1, Math.round(content.split(/\s+/).length / 200))} {t("minRead")}
                </span>
              )}
              {data?.article.updatedAt && (
                <time dateTime={data.article.updatedAt.toISOString()}>
                  {data.article.updatedAt.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" })}
                </time>
              )}
            </div>

            <p className="text-lg text-content-2 leading-relaxed">
              {summary}
            </p>

            {keyIdea && (
              <div className="mt-4 p-4 rounded-lg border border-brand-gold/20 bg-[rgba(214,179,90,0.04)]">
                <p className="text-sm font-medium text-content-1">
                  <span className="text-brand-gold font-semibold">
                    {t("keyIdea")}:
                  </span>{" "}
                  {keyIdea}
                </p>
              </div>
            )}
          </header>

          {hasContent ? (
            <>
              {(() => {
                const headings = strippedContent
                  .split("\n")
                  .filter((l) => l.startsWith("## ") || l.startsWith("### "))
                  .map((l, i) => ({
                    id: `section-${i}`,
                    text: l.replace(/^#{2,3}\s+/, ""),
                    level: l.startsWith("### ") ? 3 : 2,
                  }));
                if (headings.length < 3) return null;
                return (
                  <nav className="mb-8 p-4 rounded-lg bg-surface-1 border border-border" aria-label={t("tableOfContents")}>
                    <p className="text-xs font-semibold text-content-2 uppercase tracking-wider mb-2">{t("tableOfContents")}</p>
                    <ul className="space-y-1">
                      {headings.map((h) => (
                        <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                          <a href={`#${h.id}`} className="text-sm text-content-2 hover:text-brand-gold transition-colors leading-relaxed">
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                );
              })()}
              <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
                {(() => {
                  let headingIdx = -1;
                  let h2Count = 0;
                  const inlineToolId = getToolsForArticle(baseClusterSlug, topic.slug)[0];
                  const elements: React.ReactNode[] = [];
                  strippedContent.split("\n").forEach((line, i) => {
                    if (!line.trim()) return;
                    if (line.startsWith("## ")) {
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
                      headingIdx++;
                      elements.push(<h2 key={i} id={`section-${headingIdx}`}>{line.slice(3)}</h2>);
                      return;
                    }
                    if (line.startsWith("### ")) {
                      headingIdx++;
                      elements.push(<h3 key={i} id={`section-${headingIdx}`}>{line.slice(4)}</h3>);
                      return;
                    }
                    if (line.startsWith("- ")) {
                      elements.push(
                        <ul key={i}>
                          <li>{line.slice(2)}</li>
                        </ul>
                      );
                      return;
                    }
                    elements.push(<p key={i}>{line}</p>);
                  });
                  return elements;
                })()}
              </div>
            </>
          ) : (
            <div className="p-8 rounded-lg border border-border bg-surface-1 text-center">
              <p className="text-content-2 mb-2">
                {t("preparingArticle")}
              </p>
              <p className="text-sm text-content-3">
                {t("preparingArticleHint", { name: clusterName })}
              </p>
            </div>
          )}

          {keyTakeaways.length > 0 && (
            <div className="mt-10 p-5 rounded-lg bg-surface-1 border border-border">
              <h2 className="text-base font-bold text-content-0 mb-3">
                {t("keyTakeaways")}
              </h2>
              <ul className="space-y-2">
                {keyTakeaways.map((takeaway: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-content-1"
                  >
                    <span className="text-brand-gold shrink-0">•</span>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {faq.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-content-0 mb-4">
                {t("faq")}
              </h2>
              <div className="space-y-4">
                {faq.map(
                  (item: { question: string; answer: string }, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-surface-1 border border-border"
                    >
                      <h3 className="text-sm font-semibold text-content-0 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-sm text-content-2 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <RelatedArticles
            articles={relatedArticles}
            heading={t("relatedArticles")}
            linkTypeLabels={{
              related: t("linkRelated"),
              prerequisite: t("linkPrerequisite"),
              deeper_dive: t("linkDeeperDive"),
              comparison: t("linkComparison"),
              see_also: t("linkSeeAlso"),
            }}
          />

          <ContextualToolCards
            toolIds={getToolsForArticle(baseClusterSlug, topic.slug)}
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

          <footer className="mt-10 pt-6 border-t border-border">
            <div className="bg-surface-1 border border-brand-gold/20 rounded-DEFAULT p-6 text-center">
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
                href={{ pathname: "/learn/[cluster]" as const, params: { cluster: locClusterSlug } }}
                className="inline-flex items-center gap-2 text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {t("backTo", { name: clusterName })}
              </Link>
              <Link
                href="/learn"
                className="text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                {t("allTopics")}
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
