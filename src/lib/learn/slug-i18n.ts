import type { Locale } from "@/i18n/config";
import { getDb } from "@/lib/db";
import { learnArticles, learnArticleLocalizations } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";

/* ==========================================================
   Cluster slug translations — static, 16 clusters × 5 locales
   ========================================================== */

const CLUSTER_SLUG_I18N: Record<string, Record<string, string>> = {
  es: {
    fundamentals: "fundamentos",
    history: "historia",
    "markets-trading": "mercados-trading",
    investment: "inversion",
    "physical-metals": "metales-fisicos",
    "price-factors": "factores-precio",
    "production-industry": "produccion-industria",
    "geology-science": "geologia-ciencia",
    "regulation-tax": "regulacion-impuestos",
    "security-authenticity": "seguridad-autenticidad",
    "ratios-analytics": "ratios-analitica",
    macroeconomics: "macroeconomia",
    guides: "guias",
    "faq-mistakes": "preguntas-errores",
    comparisons: "comparativas",
    glossary: "glosario",
  },
  de: {
    fundamentals: "grundlagen",
    history: "geschichte",
    "markets-trading": "maerkte-handel",
    investment: "investition",
    "physical-metals": "physische-metalle",
    "price-factors": "preisfaktoren",
    "production-industry": "produktion-industrie",
    "geology-science": "geologie-wissenschaft",
    "regulation-tax": "regulierung-steuern",
    "security-authenticity": "sicherheit-echtheit",
    "ratios-analytics": "kennzahlen-analyse",
    macroeconomics: "makrooekonomie",
    guides: "leitfaeden",
    "faq-mistakes": "faq-fehler",
    comparisons: "vergleiche",
    glossary: "glossar",
  },
  zh: {
    fundamentals: "jichu",
    history: "lishi",
    "markets-trading": "shichang-jiaoyi",
    investment: "touzi",
    "physical-metals": "shiwu-jinshu",
    "price-factors": "jiage-yinsu",
    "production-industry": "shengchan-gongye",
    "geology-science": "dizhi-kexue",
    "regulation-tax": "fagui-shuiwu",
    "security-authenticity": "anquan-zhenwei",
    "ratios-analytics": "bilv-fenxi",
    macroeconomics: "hongguan-jingji",
    guides: "zhinan",
    "faq-mistakes": "changjian-wenti",
    comparisons: "bijiao",
    glossary: "shuyu",
  },
  ar: {
    fundamentals: "asasiyat",
    history: "tarikh",
    "markets-trading": "aswaq-tadawul",
    investment: "istithmar",
    "physical-metals": "maadin-madiyah",
    "price-factors": "awamil-asiar",
    "production-industry": "intaj-sinai",
    "geology-science": "jiyulujiya-ulum",
    "regulation-tax": "tanzim-daraib",
    "security-authenticity": "aman-asalah",
    "ratios-analytics": "nisab-tahlilat",
    macroeconomics: "iqtisad-kulli",
    guides: "adillah",
    "faq-mistakes": "asilah-akhta",
    comparisons: "muqaranat",
    glossary: "mustalahat",
  },
  tr: {
    fundamentals: "temeller",
    history: "tarih",
    "markets-trading": "piyasalar-ticaret",
    investment: "yatirim",
    "physical-metals": "fiziksel-metaller",
    "price-factors": "fiyat-faktorleri",
    "production-industry": "uretim-endustri",
    "geology-science": "jeoloji-bilim",
    "regulation-tax": "duzenleme-vergi",
    "security-authenticity": "guvenlik-orijinallik",
    "ratios-analytics": "oranlar-analitik",
    macroeconomics: "makroekonomi",
    guides: "rehberler",
    "faq-mistakes": "sss-hatalar",
    comparisons: "karsilastirmalar",
    glossary: "sozluk",
  },
};

// Pre-compute reverse maps for fast base slug lookups
const CLUSTER_REVERSE_MAP: Record<string, Record<string, string>> = {};
for (const [locale, mapping] of Object.entries(CLUSTER_SLUG_I18N)) {
  CLUSTER_REVERSE_MAP[locale] = {};
  for (const [base, localized] of Object.entries(mapping)) {
    CLUSTER_REVERSE_MAP[locale][localized] = base;
  }
}

/**
 * Get the localized cluster slug for a given locale.
 * Returns the base (English) slug if no translation exists.
 */
export function getLocalizedClusterSlug(
  baseSlug: string,
  locale: Locale
): string {
  if (locale === "en") return baseSlug;
  return CLUSTER_SLUG_I18N[locale]?.[baseSlug] ?? baseSlug;
}

/**
 * Resolve a localized cluster slug back to the base (English) slug.
 * Returns the input slug if no mapping is found (handles English slugs too).
 */
export function getBaseClusterSlug(
  localizedSlug: string,
  locale: Locale
): string {
  if (locale === "en") return localizedSlug;
  return CLUSTER_REVERSE_MAP[locale]?.[localizedSlug] ?? localizedSlug;
}

/**
 * Get all localized cluster slugs for a given locale.
 * Returns a Map<baseSlug, localizedSlug>.
 */
export function getAllLocalizedClusterSlugs(
  locale: Locale
): Map<string, string> {
  const result = new Map<string, string>();
  const mapping = CLUSTER_SLUG_I18N[locale];
  if (!mapping) return result;
  for (const [base, localized] of Object.entries(mapping)) {
    result.set(base, localized);
  }
  return result;
}

/* ==========================================================
   Article slug translations — DB-backed
   ========================================================== */

/**
 * Get the localized article slug for a given base slug and locale.
 * Falls back to the base slug if no translation exists in DB.
 */
export async function getLocalizedArticleSlug(
  baseSlug: string,
  locale: Locale
): Promise<string> {
  if (locale === "en") return baseSlug;

  const db = getDb();
  if (!db) return baseSlug;

  try {
    const [result] = await db
      .select({ localizedSlug: learnArticleLocalizations.slug })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        eq(learnArticleLocalizations.articleId, learnArticles.id)
      )
      .where(
        and(
          eq(learnArticles.slug, baseSlug),
          eq(learnArticleLocalizations.locale, locale)
        )
      )
      .limit(1);

    return result?.localizedSlug || baseSlug;
  } catch {
    return baseSlug;
  }
}

/**
 * Resolve a localized article slug back to the base slug.
 * Checks both localized slugs in DB and base slugs in the articles table.
 */
export async function getBaseArticleSlug(
  localizedSlug: string,
  locale: Locale
): Promise<string | null> {
  if (locale === "en") return localizedSlug;

  const db = getDb();
  if (!db) return null;

  try {
    // First try to find by localized slug in the localizations table
    const [byLocalized] = await db
      .select({ baseSlug: learnArticles.slug })
      .from(learnArticleLocalizations)
      .innerJoin(
        learnArticles,
        eq(learnArticles.id, learnArticleLocalizations.articleId)
      )
      .where(
        and(
          eq(learnArticleLocalizations.slug, localizedSlug),
          eq(learnArticleLocalizations.locale, locale)
        )
      )
      .limit(1);

    if (byLocalized) return byLocalized.baseSlug;

    // Fallback: check if it's already a base slug
    const [byBase] = await db
      .select({ slug: learnArticles.slug })
      .from(learnArticles)
      .where(eq(learnArticles.slug, localizedSlug))
      .limit(1);

    return byBase?.slug ?? null;
  } catch {
    return null;
  }
}

/**
 * Batch-load localized article slugs for a set of base slugs.
 * Returns Map<baseSlug, localizedSlug>.
 */
export async function getLocalizedArticleSlugs(
  baseSlugs: string[],
  locale: Locale
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (baseSlugs.length === 0) return result;

  // For English, base slugs are the localized slugs
  if (locale === "en") {
    for (const s of baseSlugs) result.set(s, s);
    return result;
  }

  const db = getDb();
  if (!db) {
    for (const s of baseSlugs) result.set(s, s);
    return result;
  }

  try {
    const rows = await db
      .select({
        baseSlug: learnArticles.slug,
        localizedSlug: learnArticleLocalizations.slug,
      })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        eq(learnArticleLocalizations.articleId, learnArticles.id)
      )
      .where(
        and(
          inArray(learnArticles.slug, baseSlugs),
          eq(learnArticleLocalizations.locale, locale)
        )
      );

    for (const row of rows) {
      result.set(row.baseSlug, row.localizedSlug || row.baseSlug);
    }
  } catch {
    // DB unavailable — fallback below fills with base slugs
  }

  // Fill missing entries with base slugs
  for (const s of baseSlugs) {
    if (!result.has(s)) result.set(s, s);
  }

  return result;
}
