import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { TAXONOMY } from "@/lib/learn/taxonomy";
import { ALL_TOPICS } from "@/lib/learn/topics";
import { LearnBreadcrumb } from "@/components/learn/LearnBreadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Learn About Precious Metals — Metalorix",
    description:
      "Free educational library on gold, silver, platinum and palladium. Over 1,000 articles covering fundamentals, investing, markets, history and more.",
    openGraph: {
      title: "Learn About Precious Metals — Metalorix",
      description:
        "Comprehensive educational resource on precious metals investing, markets, history, and practical guides.",
      url: "https://metalorix.com/learn",
    },
    alternates: {
      canonical: "https://metalorix.com/learn",
    },
  };
}

const CLUSTER_ICONS: Record<string, string> = {
  fundamentals: "📐",
  history: "📜",
  "markets-trading": "📊",
  investment: "💰",
  "physical-metals": "🪙",
  "price-factors": "📈",
  "production-industry": "⛏️",
  "geology-science": "🌍",
  "regulation-tax": "📋",
  "security-authenticity": "🔒",
  "ratios-analytics": "📉",
  macroeconomics: "🏦",
  guides: "📖",
  "faq-mistakes": "❓",
  comparisons: "⚖️",
  glossary: "📝",
};

export default async function LearnPage() {
  const tc = await getTranslations("common");

  const stats = {
    total: ALL_TOPICS.length,
    beginner: ALL_TOPICS.filter((t) => t.difficulty === "beginner").length,
    intermediate: ALL_TOPICS.filter((t) => t.difficulty === "intermediate")
      .length,
    advanced: ALL_TOPICS.filter((t) => t.difficulty === "advanced").length,
    clusters: TAXONOMY.length,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn About Precious Metals",
    description:
      "Comprehensive educational library on gold, silver, platinum and palladium.",
    url: "https://metalorix.com/learn",
    publisher: {
      "@type": "Organization",
      name: "Metalorix",
      url: "https://metalorix.com",
    },
    numberOfItems: stats.total,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="py-[var(--section-py)]">
        <div className="mx-auto max-w-[1100px] px-6">
          <LearnBreadcrumb
            items={[
              { label: tc("breadcrumbHome"), href: "/" },
              { label: "Learn" },
            ]}
          />

          {/* Hero */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-content-0 tracking-tight mb-4">
              Learn About Precious Metals
            </h1>
            <p className="text-lg text-content-2 leading-relaxed max-w-[700px]">
              A comprehensive, free educational library covering everything from
              the basics of gold and silver to advanced market analysis and
              investment strategies.
            </p>
            <div className="flex flex-wrap gap-4 mt-6 text-sm text-content-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
                {stats.total} articles
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {stats.beginner} beginner
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {stats.intermediate} intermediate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                {stats.advanced} advanced
              </span>
            </div>
          </header>

          {/* Cluster Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TAXONOMY.map((cluster) => {
              const count = ALL_TOPICS.filter(
                (t) => t.clusterSlug === cluster.slug
              ).length;
              const icon = CLUSTER_ICONS[cluster.slug] || "📄";
              return (
                <Link
                  key={cluster.slug}
                  href={`/learn/${cluster.slug}`}
                  className="group relative rounded-lg border border-border bg-surface-1 p-6 hover:border-brand-gold/40 hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-3">{icon}</div>
                  <h2 className="text-base font-bold text-content-0 group-hover:text-brand-gold transition-colors mb-2">
                    {cluster.nameEn}
                  </h2>
                  <p className="text-sm text-content-2 leading-relaxed mb-3 line-clamp-2">
                    {cluster.descriptionEn}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-content-3">
                    <span>{count} articles</span>
                    <span>·</span>
                    <span>
                      {cluster.subclusters.length} topics
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Start */}
          <div className="mt-12 rounded-lg border border-brand-gold/20 bg-[rgba(214,179,90,0.04)] p-6">
            <h2 className="text-lg font-bold text-content-0 mb-3">
              New to precious metals?
            </h2>
            <p className="text-sm text-content-2 mb-4">
              Start with the fundamentals and work your way up. These pillar
              articles give you a solid foundation.
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_TOPICS.filter((t) => t.isPillar && t.priority === 1)
                .slice(0, 6)
                .map((t) => (
                  <Link
                    key={t.slug}
                    href={`/learn/${t.clusterSlug}/${t.slug}`}
                    className="text-sm font-medium px-3 py-1.5 rounded-full border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/10 transition-colors"
                  >
                    {t.titleEn}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
