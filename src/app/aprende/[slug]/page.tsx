import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getDb } from "@/lib/db";
import { glossaryTerms } from "@/lib/db/schema";
import { eq, and, ne, inArray, asc } from "drizzle-orm";
import { getCategoryLabel } from "@/lib/data/glossary-categories";

async function getTerm(slug: string) {
  const db = getDb();
  if (!db) return null;
  try {
    const result = await db
      .select()
      .from(glossaryTerms)
      .where(
        and(
          eq(glossaryTerms.slug, slug),
          eq(glossaryTerms.published, true)
        )
      )
      .limit(1);
    return result[0] ?? null;
  } catch {
    return null;
  }
}

async function getRelatedTerms(slugs: string[], excludeSlug: string) {
  const db = getDb();
  if (!db || slugs.length === 0) return [];
  try {
    return await db
      .select({
        slug: glossaryTerms.slug,
        term: glossaryTerms.term,
        definition: glossaryTerms.definition,
        category: glossaryTerms.category,
      })
      .from(glossaryTerms)
      .where(
        and(
          inArray(glossaryTerms.slug, slugs),
          eq(glossaryTerms.published, true),
          ne(glossaryTerms.slug, excludeSlug)
        )
      )
      .orderBy(asc(glossaryTerms.term))
      .limit(6);
  } catch {
    return [];
  }
}

async function getSameCategoryTerms(
  category: string,
  excludeSlug: string
) {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select({
        slug: glossaryTerms.slug,
        term: glossaryTerms.term,
        definition: glossaryTerms.definition,
      })
      .from(glossaryTerms)
      .where(
        and(
          eq(glossaryTerms.category, category),
          eq(glossaryTerms.published, true),
          ne(glossaryTerms.slug, excludeSlug)
        )
      )
      .orderBy(asc(glossaryTerms.term))
      .limit(6);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const term = await getTerm(params.slug);
  if (!term) {
    return { title: "No encontrado — Metalorix" };
  }

  const description =
    term.definition.length > 155
      ? term.definition.slice(0, 152) + "..."
      : term.definition;

  return {
    title: `${term.term} — Aprende | Metalorix`,
    description,
    openGraph: {
      title: `${term.term} — Metalorix`,
      description,
      type: "article",
      url: `https://metalorix.com/aprende/${term.slug}`,
    },
    alternates: {
      canonical: `https://metalorix.com/aprende/${term.slug}`,
    },
  };
}

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (!line.trim()) return null;

    if (line.startsWith("### ")) {
      return (
        <h3 key={i}>{renderInlineLinks(line.replace("### ", ""))}</h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={i}>{renderInlineLinks(line.replace("## ", ""))}</h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i}>{renderInlineLinks(line.replace("- ", ""))}</li>
      );
    }

    return <p key={i}>{renderInlineLinks(line)}</p>;
  });
}

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
        href={`/aprende/${match[2]}`}
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

export default async function TermPage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = await getLocale();
  const t = await getTranslations("learn");
  const tc = await getTranslations("common");

  const term = await getTerm(params.slug);
  if (!term) notFound();

  const relatedTerms =
    term.relatedSlugs && term.relatedSlugs.length > 0
      ? await getRelatedTerms(term.relatedSlugs, term.slug)
      : [];

  const sameCategoryTerms =
    term.category
      ? await getSameCategoryTerms(term.category, term.slug)
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: `https://metalorix.com/aprende/${term.slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Metalorix — Aprende",
      url: "https://metalorix.com/aprende",
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
          <nav
            className="text-sm text-content-3 mb-6"
            aria-label={tc("breadcrumbNav")}
          >
            <Link
              href="/"
              className="hover:text-content-1 transition-colors"
            >
              {tc("breadcrumbHome")}
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/aprende"
              className="hover:text-content-1 transition-colors"
            >
              {t("title")}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-content-1">{term.term}</span>
          </nav>

          {/* Header */}
          <header className="mb-10">
            {term.category && (
              <div className="mb-4">
                <Link
                  href={`/aprende#${term.category}`}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[rgba(214,179,90,0.12)] text-brand-gold uppercase tracking-wider hover:bg-[rgba(214,179,90,0.2)] transition-colors"
                >
                  {getCategoryLabel(term.category, locale)}
                </Link>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-0 tracking-tight leading-tight mb-4">
              {term.term}
            </h1>

            <div className="bg-surface-1 border border-border rounded-DEFAULT p-5">
              <p className="text-[15px] text-content-1 leading-relaxed">
                {term.definition}
              </p>
            </div>
          </header>

          {/* Expanded content */}
          {term.content && (
            <div className="prose-metalorix text-content-1 leading-relaxed text-[15px] [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-content-0 [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-content-0 [&>h3]:mt-8 [&>h3]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>li]:mb-2 [&>blockquote]:border-l-2 [&>blockquote]:border-brand-gold [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-content-2 [&>blockquote]:my-6">
              {renderContent(term.content)}
            </div>
          )}

          {!term.content && (
            <div className="py-8 text-center">
              <p className="text-sm text-content-3">
                {t("contentComingSoon")}
              </p>
            </div>
          )}

          {/* Related terms */}
          {relatedTerms.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-lg font-bold text-content-0 mb-5">
                {t("relatedTerms")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTerms.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/aprende/${rel.slug}`}
                    className="bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-border-hover hover:shadow-card transition-all group"
                  >
                    <h3 className="text-sm font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">
                      {rel.term}
                    </h3>
                    <p className="text-xs text-content-2 leading-relaxed line-clamp-2">
                      {rel.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Same category terms */}
          {sameCategoryTerms.length > 0 && (
            <section className="mt-10 pt-8 border-t border-border">
              <h2 className="text-lg font-bold text-content-0 mb-5">
                {t("moreInCategory")}{" "}
                <span className="text-brand-gold">
                  {getCategoryLabel(term.category!, locale)}
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sameCategoryTerms.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/aprende/${rel.slug}`}
                    className="bg-surface-1 border border-border rounded-DEFAULT p-4 hover:border-border-hover hover:shadow-card transition-all group"
                  >
                    <h3 className="text-sm font-semibold text-content-0 mb-1 group-hover:text-brand-gold transition-colors">
                      {rel.term}
                    </h3>
                    <p className="text-xs text-content-2 leading-relaxed line-clamp-2">
                      {rel.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA footer */}
          <footer className="mt-12 pt-8 border-t border-border">
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-6 text-center">
              <h3 className="text-base font-semibold text-content-0 mb-2">
                {t("ctaTitle")}
              </h3>
              <p className="text-sm text-content-2 mb-4">
                {t("ctaDesc")}
              </p>
              <div className="flex justify-center gap-3 flex-wrap">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all"
                >
                  {t("viewDashboard")}
                </Link>
                <Link
                  href="/aprende"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-2 text-content-0 hover:bg-surface-2/80 transition-all"
                >
                  {t("allTerms")}
                </Link>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Link
                href="/aprende"
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
                {t("allTerms")}
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
