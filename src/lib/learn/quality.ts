import type { ArticleContent, QualityCheckResult, TopicDefinition } from "./types";

const MIN_WORD_COUNT: Record<string, number> = {
  glossary: 300,
  explainer: 600,
  guide: 700,
  comparison: 600,
  faq: 500,
  historical: 600,
  practical: 600,
  macro: 600,
  investment: 600,
  industry: 600,
  pillar: 1000,
};

const FILLER_PHRASES = [
  "it is important to note",
  "it should be noted",
  "throughout history",
  "in conclusion",
  "as we all know",
  "needless to say",
  "it goes without saying",
  "at the end of the day",
  "in today's world",
  "as a matter of fact",
  "it is worth mentioning",
  "it is interesting to note",
  "this is a very important",
  "without further ado",
  "in this article we will",
  "let's dive in",
  "let's explore",
  "buckle up",
  "shall we",
];

export function evaluateArticleQuality(
  content: ArticleContent,
  topic: TopicDefinition
): QualityCheckResult {
  const checks: QualityCheckResult["checks"] = [];

  const fullText = content.sections.map((s) => s.content).join(" ");
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const minWords = MIN_WORD_COUNT[topic.articleType] || 600;

  // 1. Minimum word count
  checks.push({
    name: "word_count",
    passed: wordCount >= minWords,
    message: `Word count: ${wordCount} (min: ${minWords})`,
    weight: 15,
  });

  // 2. Has key idea
  checks.push({
    name: "key_idea",
    passed: content.keyIdea.length >= 20,
    message: content.keyIdea.length >= 20
      ? "Key idea present and substantive"
      : "Key idea missing or too short",
    weight: 10,
  });

  // 3. Has sufficient sections
  const minSections = topic.articleType === "glossary" ? 2 : 3;
  checks.push({
    name: "section_count",
    passed: content.sections.length >= minSections,
    message: `Sections: ${content.sections.length} (min: ${minSections})`,
    weight: 10,
  });

  // 4. Sections have substance
  const thinSections = content.sections.filter(
    (s) => s.content.split(/\s+/).length < 30
  );
  checks.push({
    name: "section_depth",
    passed: thinSections.length === 0,
    message: thinSections.length === 0
      ? "All sections have sufficient depth"
      : `${thinSections.length} section(s) are too thin`,
    weight: 10,
  });

  // 5. Has key takeaways
  const needsTakeaways = topic.articleType !== "glossary";
  checks.push({
    name: "key_takeaways",
    passed: !needsTakeaways || content.keyTakeaways.length >= 2,
    message: `Key takeaways: ${content.keyTakeaways.length}`,
    weight: 8,
  });

  // 6. Has FAQ (when appropriate)
  const needsFaq = !["glossary"].includes(topic.articleType);
  checks.push({
    name: "faq_present",
    passed: !needsFaq || (content.faq?.length ?? 0) >= 1,
    message: `FAQ items: ${content.faq?.length ?? 0}`,
    weight: 5,
  });

  // 7. No filler phrases
  const lowerText = fullText.toLowerCase();
  const fillerFound = FILLER_PHRASES.filter((f) => lowerText.includes(f));
  checks.push({
    name: "no_filler",
    passed: fillerFound.length === 0,
    message: fillerFound.length === 0
      ? "No filler phrases detected"
      : `Filler phrases found: ${fillerFound.join(", ")}`,
    weight: 10,
  });

  // 8. SEO metadata
  const hasSeoTitle = content.seoTitle.length >= 30 && content.seoTitle.length <= 70;
  const hasMetaDesc =
    content.metaDescription.length >= 100 && content.metaDescription.length <= 160;
  checks.push({
    name: "seo_metadata",
    passed: hasSeoTitle && hasMetaDesc,
    message: `SEO title: ${content.seoTitle.length} chars, Meta desc: ${content.metaDescription.length} chars`,
    weight: 8,
  });

  // 9. Summary present and useful
  checks.push({
    name: "summary",
    passed: content.summary.length >= 50 && content.summary.length <= 500,
    message: `Summary: ${content.summary.length} chars`,
    weight: 7,
  });

  // 10. Lexical variety (unique words / total words)
  const words = fullText.toLowerCase().split(/\s+/).filter(Boolean);
  const uniqueWords = new Set(words);
  const lexicalDiversity = words.length > 0 ? uniqueWords.size / words.length : 0;
  checks.push({
    name: "lexical_variety",
    passed: lexicalDiversity >= 0.35,
    message: `Lexical diversity: ${(lexicalDiversity * 100).toFixed(1)}% (min: 35%)`,
    weight: 7,
  });

  // 11. Title quality
  checks.push({
    name: "title_quality",
    passed: content.title.length >= 20 && content.title.length <= 100,
    message: `Title length: ${content.title.length} chars`,
    weight: 5,
  });

  // 12. Consistency with topic definition
  const titleOverlap = topic.titleEn
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .some((w) => content.title.toLowerCase().includes(w));
  checks.push({
    name: "topic_consistency",
    passed: titleOverlap,
    message: titleOverlap
      ? "Title is consistent with topic definition"
      : "Title may not match the intended topic",
    weight: 5,
  });

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const passedWeight = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round((passedWeight / totalWeight) * 100);

  return { score, checks };
}

/**
 * Detects potential duplicate or overlapping topics in the inventory.
 */
export function detectDuplicateTopics(
  topics: TopicDefinition[]
): { slug1: string; slug2: string; similarity: number; reason: string }[] {
  const duplicates: {
    slug1: string;
    slug2: string;
    similarity: number;
    reason: string;
  }[] = [];

  for (let i = 0; i < topics.length; i++) {
    for (let j = i + 1; j < topics.length; j++) {
      const a = topics[i];
      const b = topics[j];

      // Title similarity (Jaccard on words)
      const aWords = new Set(
        a.titleEn.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
      );
      const bWords = new Set(
        b.titleEn.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
      );
      const intersection = Array.from(aWords).filter((w) => bWords.has(w)).length;
      const union = new Set([...Array.from(aWords), ...Array.from(bWords)]).size;
      const titleSimilarity = union > 0 ? intersection / union : 0;

      // Tag overlap
      const tagOverlap =
        a.tags.filter((t) => b.tags.includes(t)).length /
        Math.max(a.tags.length, b.tags.length, 1);

      // Same subcluster + high title similarity = potential duplicate
      if (
        a.subclusterSlug === b.subclusterSlug &&
        titleSimilarity > 0.5
      ) {
        duplicates.push({
          slug1: a.slug,
          slug2: b.slug,
          similarity: titleSimilarity,
          reason: `Same subcluster, title similarity ${(titleSimilarity * 100).toFixed(0)}%`,
        });
      } else if (titleSimilarity > 0.7) {
        duplicates.push({
          slug1: a.slug,
          slug2: b.slug,
          similarity: titleSimilarity,
          reason: `Cross-cluster title similarity ${(titleSimilarity * 100).toFixed(0)}%`,
        });
      } else if (
        a.subclusterSlug === b.subclusterSlug &&
        a.difficulty === b.difficulty &&
        a.articleType === b.articleType &&
        tagOverlap > 0.8
      ) {
        duplicates.push({
          slug1: a.slug,
          slug2: b.slug,
          similarity: tagOverlap,
          reason: "Same subcluster/difficulty/type with 80%+ tag overlap",
        });
      }
    }
  }

  return duplicates.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Validates all mandatory fields are present in the topic definition.
 */
export function validateTopicDefinition(
  topic: TopicDefinition
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!topic.slug) errors.push("Missing slug");
  if (!topic.clusterSlug) errors.push("Missing clusterSlug");
  if (!topic.subclusterSlug) errors.push("Missing subclusterSlug");
  if (!topic.titleEn) errors.push("Missing titleEn");
  if (!topic.summaryEn) errors.push("Missing summaryEn");
  if (!topic.difficulty) errors.push("Missing difficulty");
  if (!topic.articleType) errors.push("Missing articleType");
  if (!topic.tags?.length) errors.push("Missing or empty tags");
  if (topic.priority < 1 || topic.priority > 3)
    errors.push("Priority must be 1-3");
  if (topic.slug !== topic.slug.toLowerCase())
    errors.push("Slug must be lowercase");
  if (topic.slug.includes(" ")) errors.push("Slug must not contain spaces");

  return { valid: errors.length === 0, errors };
}
