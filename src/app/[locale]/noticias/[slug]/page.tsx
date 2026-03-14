import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getDb } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { injectGlossaryLinks } from "@/lib/ai/glossary-generator";

async function getArticle(slug: string) {
  const db = getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);
    return result[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    const t = await getTranslations("article");
    return { title: t("notFound") };
  }

  return {
    title: `${article.title} — Metalorix`,
    description: article.excerpt ?? article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? article.title,
      type: "article",
      url: `https://metalorix.com/noticias/${article.slug}`,
      publishedTime: article.publishedAt?.toISOString(),
    },
    alternates: {
      canonical: `https://metalorix.com/noticias/${article.slug}`,
    },
  };
}

const METAL_COLORS: Record<string, string> = {
  XAU: "#D6B35A",
  XAG: "#A7B0BE",
  XPT: "#8B9DC3",
};

function renderInlineLinks(text: string) {
  const linkRegex = /\[([^\]]+)\]\(\/aprende\/([^)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        href={{ pathname: "/aprende/[slug]" as const, params: { slug: match[2] } }}
        className="text-brand-gold hover:underline font-medium"
      >
        {match[1]}
      </Link>
    );
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
    };
    return map[symbol] ?? symbol;
  };

  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const linkedContent = await injectGlossaryLinks(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    url: `https://metalorix.com/noticias/${article.slug}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[780px] px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-content-3 mb-6" aria-label="Breadcrumb">
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
              {article.title}
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
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-lg text-content-2 leading-relaxed">
                {article.excerpt}
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
              <span>Metalorix</span>
            </div>
          </header>

          {/* Content */}
          <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
            {linkedContent.split("\n").map((paragraph, i) => {
              if (!paragraph.trim()) return null;
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i}>{renderInlineLinks(paragraph.replace("## ", ""))}</h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={i}>{renderInlineLinks(paragraph.replace("### ", ""))}</h3>
                );
              }
              return <p key={i}>{renderInlineLinks(paragraph)}</p>;
            })}
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-5">
              <p className="text-xs text-content-3 leading-relaxed">
                {t("aiDisclaimer")}
              </p>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                href="/noticias"
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
                {t("allNews")}
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-content-2 hover:text-brand-gold transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}
