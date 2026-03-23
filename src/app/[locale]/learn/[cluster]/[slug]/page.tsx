import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getDb } from "@/lib/db";
import {
  learnArticles,
  learnArticleLocalizations,
  learnInternalLinks,
  glossaryTerms,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getTopicBySlug } from "@/lib/learn/topics";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { suggestInternalLinks } from "@/lib/learn/internal-links";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { RelatedArticles } from "@/components/learn/RelatedArticles";
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
import type { Locale } from "@/i18n/config";

export const revalidate = 86400;

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
        ? gTerm.definition.slice(0, 155)
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

  if (!topic) return { title: tl("notFound") };

  const data = await getArticleData(topic.slug, locale);
  const title = data?.localization.seoTitle || topic.titleEn;
  const description = data?.localization.metaDescription || topic.summaryEn;

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

  if (!topic || topic.clusterSlug !== baseClusterSlug) notFound();

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
  const relatedArticles = await Promise.all(
    ((data?.links || []).length > 0
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
        })
    ).map(async (article) => ({
      ...article,
      localizedSlug: await getLocalizedArticleSlug(article.slug, locale),
      localizedClusterSlug: getLocalizedClusterSlug(article.clusterSlug, locale),
    }))
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
            <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
              {strippedContent.split("\n").map((line, i) => {
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

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-content-2 mb-3">
              {t("explorePlatform")}
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                {t("viewPrices")}
              </Link>
              <Link
                href="/herramientas"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                {t("viewTools")}
              </Link>
              <Link
                href="/alertas"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                {t("setAlerts")}
              </Link>
            </div>
          </div>

          <footer className="mt-10 pt-6 border-t border-border">
            <div className="flex justify-between items-center">
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
