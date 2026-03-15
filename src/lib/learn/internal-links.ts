import type { TopicDefinition, InternalLinkSuggestion, LinkType } from "./types";
import { ALL_TOPICS } from "./topics";
import { TAXONOMY } from "./taxonomy";

/**
 * Suggests internal links for a given article based on taxonomy, tags and explicit relations.
 * Returns sorted by relevance score (highest first).
 */
export function suggestInternalLinks(
  slug: string,
  maxLinks: number = 8
): InternalLinkSuggestion[] {
  const source = ALL_TOPICS.find((t) => t.slug === slug);
  if (!source) return [];

  const suggestions: InternalLinkSuggestion[] = [];
  const seen = new Set<string>();

  // 1. Explicit related slugs (highest relevance)
  if (source.relatedSlugs) {
    for (const targetSlug of source.relatedSlugs) {
      const target = ALL_TOPICS.find((t) => t.slug === targetSlug);
      if (!target || targetSlug === slug) continue;
      seen.add(targetSlug);
      suggestions.push({
        sourceSlug: slug,
        targetSlug,
        linkType: determineLinkType(source, target),
        relevanceScore: 95,
        suggestedAnchor: target.titleEn,
      });
    }
  }

  // 2. Pillar article of same subcluster
  if (!source.isPillar) {
    const pillar = ALL_TOPICS.find(
      (t) =>
        t.subclusterSlug === source.subclusterSlug &&
        t.isPillar &&
        t.slug !== slug
    );
    if (pillar && !seen.has(pillar.slug)) {
      seen.add(pillar.slug);
      suggestions.push({
        sourceSlug: slug,
        targetSlug: pillar.slug,
        linkType: "see_also",
        relevanceScore: 90,
        suggestedAnchor: pillar.titleEn,
      });
    }
  }

  // 3. Same subcluster articles
  const sameSubcluster = ALL_TOPICS.filter(
    (t) =>
      t.subclusterSlug === source.subclusterSlug &&
      t.slug !== slug &&
      !seen.has(t.slug)
  );
  for (const target of sameSubcluster.slice(0, 4)) {
    seen.add(target.slug);
    suggestions.push({
      sourceSlug: slug,
      targetSlug: target.slug,
      linkType: "related",
      relevanceScore: 75,
      suggestedAnchor: target.titleEn,
    });
  }

  // 4. Same cluster, different subcluster — tag overlap
  const sameClusterOtherSub = ALL_TOPICS.filter(
    (t) =>
      t.clusterSlug === source.clusterSlug &&
      t.subclusterSlug !== source.subclusterSlug &&
      t.slug !== slug &&
      !seen.has(t.slug)
  );
  for (const target of sameClusterOtherSub) {
    const tagOverlap = source.tags.filter((tag) => target.tags.includes(tag));
    if (tagOverlap.length > 0) {
      seen.add(target.slug);
      suggestions.push({
        sourceSlug: slug,
        targetSlug: target.slug,
        linkType: "related",
        relevanceScore: 50 + tagOverlap.length * 10,
        suggestedAnchor: target.titleEn,
      });
    }
  }

  // 5. Cross-cluster tag overlap
  const crossCluster = ALL_TOPICS.filter(
    (t) =>
      t.clusterSlug !== source.clusterSlug &&
      t.slug !== slug &&
      !seen.has(t.slug)
  );
  for (const target of crossCluster) {
    const tagOverlap = source.tags.filter((tag) => target.tags.includes(tag));
    const metalOverlap =
      source.metals && target.metals
        ? source.metals.filter((m) => target.metals!.includes(m))
        : [];
    const score = tagOverlap.length * 8 + metalOverlap.length * 5;
    if (score >= 8) {
      seen.add(target.slug);
      suggestions.push({
        sourceSlug: slug,
        targetSlug: target.slug,
        linkType: "see_also",
        relevanceScore: Math.min(score + 30, 80),
        suggestedAnchor: target.titleEn,
      });
    }
  }

  // 6. Glossary connections
  if (source.glossaryTermSlugs) {
    const glossaryArticles = ALL_TOPICS.filter(
      (t) =>
        t.articleType === "glossary" &&
        source.glossaryTermSlugs!.some(
          (gs) => t.slug.includes(gs) || t.tags.includes(gs)
        ) &&
        t.slug !== slug &&
        !seen.has(t.slug)
    );
    for (const target of glossaryArticles.slice(0, 3)) {
      seen.add(target.slug);
      suggestions.push({
        sourceSlug: slug,
        targetSlug: target.slug,
        linkType: "related",
        relevanceScore: 45,
        suggestedAnchor: target.titleEn,
      });
    }
  }

  // 7. Difficulty progression: link beginners to intermediate, intermediate to advanced
  if (source.difficulty !== "advanced") {
    const nextLevel =
      source.difficulty === "beginner" ? "intermediate" : "advanced";
    const progression = ALL_TOPICS.find(
      (t) =>
        t.subclusterSlug === source.subclusterSlug &&
        t.difficulty === nextLevel &&
        t.slug !== slug &&
        !seen.has(t.slug)
    );
    if (progression) {
      seen.add(progression.slug);
      suggestions.push({
        sourceSlug: slug,
        targetSlug: progression.slug,
        linkType: "deeper_dive",
        relevanceScore: 70,
        suggestedAnchor: progression.titleEn,
      });
    }
  }

  return suggestions
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxLinks);
}

function determineLinkType(
  source: TopicDefinition,
  target: TopicDefinition
): LinkType {
  if (target.isPillar) return "see_also";
  if (
    source.difficulty === "beginner" &&
    target.difficulty !== "beginner"
  )
    return "deeper_dive";
  if (source.articleType === "comparison" || target.articleType === "comparison")
    return "comparison";
  if (target.articleType === "glossary") return "related";
  if (source.subclusterSlug === target.subclusterSlug) return "related";
  return "see_also";
}

/**
 * Generates all internal link suggestions for the entire topic inventory.
 * Useful for bulk operations and validation.
 */
export function generateAllLinkSuggestions(): InternalLinkSuggestion[] {
  const allSuggestions: InternalLinkSuggestion[] = [];
  for (const topic of ALL_TOPICS) {
    allSuggestions.push(...suggestInternalLinks(topic.slug));
  }
  return allSuggestions;
}

/**
 * Validates that link suggestions are bidirectional where appropriate.
 * Returns orphaned topics (topics with no incoming links).
 */
export function findOrphanedTopics(): string[] {
  const allLinks = generateAllLinkSuggestions();
  const hasIncoming = new Set<string>();

  for (const link of allLinks) {
    hasIncoming.add(link.targetSlug);
  }

  return ALL_TOPICS.filter((t) => !hasIncoming.has(t.slug)).map(
    (t) => t.slug
  );
}

/**
 * Returns hub page data for a cluster — pillar articles + subcluster summaries.
 */
export function getHubPageData(clusterSlug: string) {
  const cluster = TAXONOMY.find((c) => c.slug === clusterSlug);
  if (!cluster) return null;

  const pillarArticles = ALL_TOPICS.filter(
    (t) => t.clusterSlug === clusterSlug && t.isPillar
  );

  const subclusters = cluster.subclusters.map((sub) => {
    const articles = ALL_TOPICS.filter(
      (t) => t.subclusterSlug === sub.slug
    );
    return {
      ...sub,
      articleCount: articles.length,
      pillar: articles.find((a) => a.isPillar),
      articles: articles.slice(0, 5),
    };
  });

  return {
    cluster,
    pillarArticles,
    subclusters,
    totalArticles: ALL_TOPICS.filter(
      (t) => t.clusterSlug === clusterSlug
    ).length,
  };
}
