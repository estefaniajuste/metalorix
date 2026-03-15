import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getAlternates } from "@/lib/seo/alternates";
import { getDb } from "@/lib/db";
import { glossaryTerms } from "@/lib/db/schema";
import { eq, asc, and } from "drizzle-orm";
import {
  GLOSSARY_CATEGORIES,
  getCategoryLabel,
} from "@/lib/data/glossary-categories";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "learn" });
  return {
    title: `${t("title")} — Metalorix`,
    description: t("subtitle"),
    alternates: getAlternates(locale, "/aprende"),
  };
}

async function getPublishedTerms(locale: string) {
  const db = getDb();
  if (!db) return [];
  try {
    return await db
      .select({
        slug: glossaryTerms.slug,
        term: glossaryTerms.term,
        definition: glossaryTerms.definition,
        category: glossaryTerms.category,
        content: glossaryTerms.content,
      })
      .from(glossaryTerms)
      .where(and(eq(glossaryTerms.published, true), eq(glossaryTerms.locale, locale)))
      .orderBy(asc(glossaryTerms.term));
  } catch {
    return [];
  }
}

export default async function AprendePage() {
  const locale = await getLocale();
  const alternates = getAlternates(locale, "/aprende");
  const t = await getTranslations("learn");
  const tc = await getTranslations("common");
  const terms = await getPublishedTerms(locale);

  const termsByCategory = new Map<string, typeof terms>();
  for (const term of terms) {
    const cat = term.category ?? "conceptos-basicos";
    const list = termsByCategory.get(cat) ?? [];
    list.push(term);
    termsByCategory.set(cat, list);
  }

  const activeCategories = GLOSSARY_CATEGORIES.filter((c) =>
    termsByCategory.has(c.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: t("title"),
    description: t("subtitle"),
    url: alternates.canonical,
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
      url: `${alternates.canonical}/${term.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1200px] px-6">
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
            <span className="text-content-1">{t("title")}</span>
          </nav>

          <div className="max-w-2xl mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-3">
              {t("title")}
            </h1>
            <p className="text-content-2 leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Category quick nav */}
          {activeCategories.length > 1 && (
            <div className="bg-surface-1 border border-border rounded-DEFAULT p-5 mb-10">
              <div className="text-xs font-semibold text-content-3 uppercase tracking-wider mb-3">
                {t("categories")}
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="text-xs text-content-2 hover:text-brand-gold px-3 py-1.5 bg-surface-2 rounded-xs transition-colors"
                  >
                    {getCategoryLabel(cat.id, locale)}
                    <span className="ml-1.5 text-content-3">
                      ({termsByCategory.get(cat.id)?.length ?? 0})
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Stats bar */}
          <div className="flex items-center gap-6 mb-10 text-sm text-content-3">
            <span>
              {terms.length} {t("termsCount")}
            </span>
            <span>
              {activeCategories.length} {t("categoriesCount")}
            </span>
          </div>

          {/* Terms by category */}
          {activeCategories.map((cat) => {
            const catTerms = termsByCategory.get(cat.id) ?? [];
            return (
              <section key={cat.id} id={cat.id} className="mb-14 scroll-mt-20">
                <h2 className="text-xl font-bold text-content-0 mb-6 flex items-center gap-3">
                  {getCategoryLabel(cat.id, locale)}
                  <span className="text-xs font-medium text-content-3 bg-surface-2 px-2 py-0.5 rounded-full">
                    {catTerms.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catTerms.map((term) => (
                    <Link
                      key={term.slug}
                      href={{ pathname: "/aprende/[slug]" as const, params: { slug: term.slug } }}
                      className="bg-surface-1 border border-border rounded-DEFAULT p-5 hover:border-border-hover hover:shadow-card hover:-translate-y-0.5 transition-all group"
                    >
                      <h3 className="text-sm font-semibold text-content-0 mb-2 group-hover:text-brand-gold transition-colors">
                        {term.term}
                      </h3>
                      <p className="text-xs text-content-2 leading-relaxed line-clamp-3">
                        {term.definition}
                      </p>
                      {term.content && (
                        <span className="inline-block mt-3 text-[10px] font-semibold text-brand-gold uppercase tracking-wider">
                          {t("readMore")}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {terms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-content-2 mb-4">{t("emptyState")}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-surface-1 border border-border rounded-DEFAULT p-6 text-center">
            <h3 className="text-base font-semibold text-content-0 mb-2">
              {t("ctaTitle")}
            </h3>
            <p className="text-sm text-content-2 mb-4">{t("ctaDesc")}</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-brand-gold text-[#0B0F17] hover:bg-brand-gold-hover transition-all"
              >
                {t("viewDashboard")}
              </Link>
              <Link
                href="/herramientas"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-semibold bg-surface-2 text-content-0 hover:bg-surface-2/80 transition-all"
              >
                {t("viewTools")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
