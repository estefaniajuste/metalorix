/**
 * URL slugs that must resolve to the canonical `TOPICS[].slug`.
 * Keep in sync with `LEARN_SLUG_REDIRECTS` / sitemap `SLUG_REDIRECTS` targets.
 */
export const LEARN_ARTICLE_SLUG_ALIASES: Record<string, string> = {
  "gold-purity-karat-system": "karat-system-for-gold",
  "the-karat-system-for-gold-from-9k-to-24k": "karat-system-for-gold",
  "the-troy-ounce-explained": "troy-ounce-explained",
  "precious-metals-vs-base-metals": "precious-vs-base-metals",
  "ppi-and-gold": "ppi-and-gold-correlation",
  "physical-gold-vs-gold-etf-the-complete-comparison": "physical-gold-vs-gold-etf",
};

export function resolveCanonicalArticleSlug(slug: string): string {
  return LEARN_ARTICLE_SLUG_ALIASES[slug] ?? slug;
}
