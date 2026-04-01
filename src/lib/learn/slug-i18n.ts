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
  hi: {
    fundamentals: "mool-tattva",
    history: "itihas",
    "markets-trading": "bazaar-vyapar",
    investment: "nivesh",
    "physical-metals": "bhaute-dhatu",
    "price-factors": "mulya-karak",
    "production-industry": "uttpadan-udyog",
    "geology-science": "bhugol-vigyan",
    "regulation-tax": "niyaman-kar",
    "security-authenticity": "suraksha-pramaan",
    "ratios-analytics": "anupat-vishleshan",
    macroeconomics: "makro-arthvyavastha",
    guides: "margdarshika",
    "faq-mistakes": "puchhe-jane-wale-sawal",
    comparisons: "tulna",
    glossary: "shabdavali",
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
 * Checks the given locale first, then falls back to checking all locales.
 * This handles cases where a URL contains slugs from a different locale
 * (e.g. after switching language via the LanguageSwitcher).
 */
export function getBaseClusterSlug(
  localizedSlug: string,
  locale: Locale
): string {
  if (locale !== "en") {
    const result = CLUSTER_REVERSE_MAP[locale]?.[localizedSlug];
    if (result) return result;
  }

  for (const mapping of Object.values(CLUSTER_REVERSE_MAP)) {
    if (mapping[localizedSlug]) return mapping[localizedSlug];
  }

  return localizedSlug;
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
 * Checks the specific locale first, then base slugs, then all locales
 * as fallback (handles cross-locale navigation from LanguageSwitcher).
 */
export async function getBaseArticleSlug(
  localizedSlug: string,
  locale: Locale
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;

  try {
    if (locale !== "en") {
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
    }

    const [byBase] = await db
      .select({ slug: learnArticles.slug })
      .from(learnArticles)
      .where(eq(learnArticles.slug, localizedSlug))
      .limit(1);

    if (byBase) return byBase.slug;

    const [anyLocale] = await db
      .select({ baseSlug: learnArticles.slug })
      .from(learnArticleLocalizations)
      .innerJoin(
        learnArticles,
        eq(learnArticles.id, learnArticleLocalizations.articleId)
      )
      .where(eq(learnArticleLocalizations.slug, localizedSlug))
      .limit(1);

    return anyLocale?.baseSlug ?? null;
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

/**
 * Get the localized article slug for a base slug across ALL locales.
 * Returns Map<locale, localizedSlug>. English always maps to baseSlug.
 */
export async function getArticleSlugsForAllLocales(
  baseSlug: string
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const allLocales = ["es", "en", "zh", "ar", "tr", "de", "hi"];
  result.set("en", baseSlug);

  const db = getDb();
  if (!db) {
    for (const loc of allLocales) result.set(loc, baseSlug);
    return result;
  }

  try {
    const rows = await db
      .select({
        locale: learnArticleLocalizations.locale,
        slug: learnArticleLocalizations.slug,
      })
      .from(learnArticles)
      .innerJoin(
        learnArticleLocalizations,
        eq(learnArticleLocalizations.articleId, learnArticles.id)
      )
      .where(eq(learnArticles.slug, baseSlug));

    for (const row of rows) {
      if (row.slug) result.set(row.locale, row.slug);
    }
  } catch {
    // DB error — fallback to base slug
  }

  for (const loc of allLocales) {
    if (!result.has(loc)) result.set(loc, baseSlug);
  }

  return result;
}
