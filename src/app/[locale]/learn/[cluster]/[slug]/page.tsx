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
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getTopicBySlug } from "@/lib/learn/topics";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { suggestInternalLinks } from "@/lib/learn/internal-links";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";
import { RelatedArticles } from "@/components/learn/RelatedArticles";

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

    // Fall back to English
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

    // Get internal links
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

export async function generateMetadata({
  params,
}: {
  params: { cluster: string; slug: string };
}): Promise<Metadata> {
  const locale = await getLocale();
  const tl = await getTranslations({ locale, namespace: "learnSection" });
  const topic = getTopicBySlug(params.slug);
  if (!topic) return { title: tl("notFound") };

  const data = await getArticleData(params.slug, locale);
  const title = data?.localization.seoTitle || topic.titleEn;
  const description = data?.localization.metaDescription || topic.summaryEn;

  const alternates = getAlternates(locale, {
    pathname: "/learn/[cluster]/[slug]",
    params: { cluster: params.cluster, slug: params.slug },
  });

  return {
    title: `${title} — ${tl("breadcrumb")} | Metalorix`,
    description,
    openGraph: {
      title: `${title} — Metalorix`,
      description,
      type: "article",
      url: alternates.canonical,
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
  const locale = await getLocale();
  const topic = getTopicBySlug(params.slug);

  if (!topic || topic.clusterSlug !== params.cluster) notFound();

  const cluster = TAXONOMY.find((c) => c.slug === params.cluster);
  const subcluster = cluster?.subclusters.find(
    (s) => s.slug === topic.subclusterSlug
  );

  const data = await getArticleData(params.slug, locale);

  // Get related articles from topic inventory as fallback
  const linkSuggestions = suggestInternalLinks(params.slug, 6);
  const relatedArticles = (data?.links || []).length > 0
    ? data!.links.map((l) => ({
        slug: l.targetSlug,
        clusterSlug: topic.clusterSlug,
        title: l.anchor || l.targetSlug,
        difficulty: topic.difficulty,
        linkType: l.linkType,
      }))
    : linkSuggestions.map((l) => {
        const t = getTopicBySlug(l.targetSlug);
        return {
          slug: l.targetSlug,
          clusterSlug: t?.clusterSlug || params.cluster,
          title: l.suggestedAnchor,
          difficulty: t?.difficulty || "beginner",
          linkType: l.linkType,
        };
      });

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

  const hasContent = content.length > 0;

  const alternates = getAlternates(locale, {
    pathname: "/learn/[cluster]/[slug]",
    params: { cluster: params.cluster, slug: params.slug },
  });

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: summary,
    url: alternates.canonical,
    author: {
      "@type": "Organization",
      name: "Metalorix",
      url: "https://metalorix.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Metalorix",
      url: "https://metalorix.com",
    },
  };

  if (faq.length > 0) {
    jsonLd.mainEntity = faq.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[780px] px-6">
          <LearnBreadcrumb
            items={[
              { label: tc("breadcrumbHome"), href: "/" },
              { label: t("breadcrumb"), href: "/learn" },
              {
                label: cluster?.nameEn || params.cluster,
                href: `/learn/${params.cluster}`,
              },
              { label: title },
            ]}
          />

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                  DIFFICULTY_STYLES[topic.difficulty] || ""
                }`}
              >
                {topic.difficulty.charAt(0).toUpperCase() +
                  topic.difficulty.slice(1)}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-2 text-content-3">
                {topic.articleType}
              </span>
              {subcluster && (
                <span className="text-[10px] text-content-3">
                  {subcluster.nameEn}
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

          {/* Content */}
          {hasContent ? (
            <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
              {content.split("\n").map((line, i) => {
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
                {t("preparingArticleHint", { name: cluster?.nameEn || params.cluster })}
              </p>
            </div>
          )}

          {/* Key Takeaways */}
          {keyTakeaways.length > 0 && (
            <div className="mt-10 p-5 rounded-lg bg-surface-1 border border-border">
              <h2 className="text-base font-bold text-content-0 mb-3">
                {t("keyTakeaways")}
              </h2>
              <ul className="space-y-2">
                {keyTakeaways.map((t: string, i: number) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-content-1"
                  >
                    <span className="text-brand-gold shrink-0">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ */}
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

          {/* Related Articles */}
          <RelatedArticles articles={relatedArticles} />

          {/* Footer */}
          <footer className="mt-10 pt-6 border-t border-border">
            <div className="flex justify-between items-center">
              <Link
                href={{ pathname: "/learn/[cluster]" as const, params: { cluster: params.cluster } }}
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
                {t("backTo", { name: cluster?.nameEn || params.cluster })}
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
