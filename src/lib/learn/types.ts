import type { Locale } from "@/i18n/config";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type ArticleType =
  | "glossary"
  | "explainer"
  | "guide"
  | "comparison"
  | "faq"
  | "historical"
  | "practical"
  | "macro"
  | "investment"
  | "industry"
  | "pillar";

export type EditorialStatus = "draft" | "review" | "published" | "archived";
export type TranslationStatus = "pending" | "in_progress" | "done" | "reviewed";
export type LinkType =
  | "related"
  | "prerequisite"
  | "deeper_dive"
  | "comparison"
  | "see_also";

export interface TopicDefinition {
  slug: string;
  clusterSlug: string;
  subclusterSlug: string;
  difficulty: Difficulty;
  articleType: ArticleType;
  isPillar?: boolean;
  metals?: string[];
  titleEn: string;
  summaryEn: string;
  tags: string[];
  relatedSlugs?: string[];
  glossaryTermSlugs?: string[];
  priority: number; // 1 = highest priority
}

export interface ClusterDefinition {
  slug: string;
  position: number;
  nameEn: string;
  descriptionEn: string;
  subclusters: SubclusterDefinition[];
}

export interface SubclusterDefinition {
  slug: string;
  position: number;
  nameEn: string;
  descriptionEn: string;
}

export interface ArticleContent {
  title: string;
  seoTitle: string;
  metaDescription: string;
  summary: string;
  keyIdea: string;
  sections: ArticleSection[];
  keyTakeaways: string[];
  faq?: { question: string; answer: string }[];
}

export interface ArticleSection {
  heading: string;
  level: 2 | 3;
  content: string;
}

export interface QualityCheckResult {
  score: number;
  checks: {
    name: string;
    passed: boolean;
    message: string;
    weight: number;
  }[];
}

export interface GenerationPromptContext {
  topic: TopicDefinition;
  clusterName: string;
  subclusterName: string;
  relatedTopicTitles: string[];
  glossaryTerms: string[];
  locale: Locale;
}

export interface InternalLinkSuggestion {
  sourceSlug: string;
  targetSlug: string;
  linkType: LinkType;
  relevanceScore: number;
  suggestedAnchor: string;
}

export interface BatchJobConfig {
  batchId: string;
  slugs?: string[];
  clusterSlug?: string;
  difficulty?: Difficulty;
  locale: Locale;
  dryRun?: boolean;
}
