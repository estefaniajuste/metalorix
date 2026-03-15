import type { TopicDefinition } from "./types";
import { TOPICS_PART1 } from "./topics-part1";
import { TOPICS_PART2 } from "./topics-part2";
import { TOPICS_PART3 } from "./topics-part3";
import { TOPICS_PART4 } from "./topics-part4";

export const ALL_TOPICS: TopicDefinition[] = [
  ...TOPICS_PART1,
  ...TOPICS_PART2,
  ...TOPICS_PART3,
  ...TOPICS_PART4,
];

export function getTopicBySlug(slug: string): TopicDefinition | undefined {
  return ALL_TOPICS.find((t) => t.slug === slug);
}

export function getTopicsByCluster(clusterSlug: string): TopicDefinition[] {
  return ALL_TOPICS.filter((t) => t.clusterSlug === clusterSlug);
}

export function getTopicsBySubcluster(
  subclusterSlug: string
): TopicDefinition[] {
  return ALL_TOPICS.filter((t) => t.subclusterSlug === subclusterSlug);
}

export function getPillarTopics(): TopicDefinition[] {
  return ALL_TOPICS.filter((t) => t.isPillar);
}

export function getTopicsByDifficulty(
  difficulty: TopicDefinition["difficulty"]
): TopicDefinition[] {
  return ALL_TOPICS.filter((t) => t.difficulty === difficulty);
}

export function getTopicsByType(
  articleType: TopicDefinition["articleType"]
): TopicDefinition[] {
  return ALL_TOPICS.filter((t) => t.articleType === articleType);
}

export function getTopicsByTag(tag: string): TopicDefinition[] {
  return ALL_TOPICS.filter((t) => t.tags.includes(tag));
}

export function getRelatedTopics(slug: string): TopicDefinition[] {
  const topic = getTopicBySlug(slug);
  if (!topic?.relatedSlugs) return [];
  return topic.relatedSlugs
    .map((s) => getTopicBySlug(s))
    .filter(Boolean) as TopicDefinition[];
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const t of ALL_TOPICS) {
    for (const tag of t.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export function getTopicStats() {
  const byCluster: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};
  const byType: Record<string, number> = {};

  for (const t of ALL_TOPICS) {
    byCluster[t.clusterSlug] = (byCluster[t.clusterSlug] || 0) + 1;
    byDifficulty[t.difficulty] = (byDifficulty[t.difficulty] || 0) + 1;
    byType[t.articleType] = (byType[t.articleType] || 0) + 1;
  }

  return {
    total: ALL_TOPICS.length,
    pillar: ALL_TOPICS.filter((t) => t.isPillar).length,
    byCluster,
    byDifficulty,
    byType,
  };
}
