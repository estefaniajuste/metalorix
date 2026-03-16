import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  boolean,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ==========================================================
   Metal Prices — Latest spot price per metal
   ========================================================== */

export const metalPrices = pgTable(
  "metal_prices",
  {
    id: serial("id").primaryKey(),
    symbol: varchar("symbol", { length: 10 }).notNull(), // XAU, XAG, XPT
    name: varchar("name", { length: 50 }).notNull(),
    priceUsd: decimal("price_usd", { precision: 12, scale: 4 }).notNull(),
    change24h: decimal("change_24h", { precision: 12, scale: 4 }),
    changePct24h: decimal("change_pct_24h", { precision: 8, scale: 4 }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    symbolIdx: uniqueIndex("metal_prices_symbol_idx").on(table.symbol),
  })
);

/* ==========================================================
   Price History — Time series for charting
   ========================================================== */

export const priceHistory = pgTable(
  "price_history",
  {
    id: serial("id").primaryKey(),
    symbol: varchar("symbol", { length: 10 }).notNull(),
    priceUsd: decimal("price_usd", { precision: 12, scale: 4 }).notNull(),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  },
  (table) => ({
    symbolTimestampIdx: index("price_history_symbol_ts_idx").on(
      table.symbol,
      table.timestamp
    ),
  })
);

/* ==========================================================
   Articles — AI-generated and editorial content
   ========================================================== */

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    category: varchar("category", { length: 50 }).notNull(), // daily, weekly, event, educational
    metals: varchar("metals", { length: 50 }).array(), // ['XAU', 'XAG']
    imageUrl: varchar("image_url", { length: 500 }),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("articles_slug_idx").on(table.slug),
    publishedIdx: index("articles_published_idx").on(table.published),
    categoryIdx: index("articles_category_idx").on(table.category),
  })
);

/* ==========================================================
   Article Translations — Localized versions of articles
   ========================================================== */

export const articleTranslations = pgTable(
  "article_translations",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    articleLocaleIdx: uniqueIndex("article_translations_article_locale_idx").on(
      table.articleId,
      table.locale
    ),
    localeIdx: index("article_translations_locale_idx").on(table.locale),
  })
);

/* ==========================================================
   Glossary Terms — Educational content for /aprende
   ========================================================== */

export const glossaryTerms = pgTable(
  "glossary_terms",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    term: varchar("term", { length: 255 }).notNull(),
    locale: varchar("locale", { length: 10 }).notNull().default("es"),
    definition: text("definition").notNull(),
    content: text("content"),
    category: varchar("category", { length: 100 }),
    relatedSlugs: varchar("related_slugs", { length: 50 }).array(),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugLocaleIdx: uniqueIndex("glossary_slug_locale_idx").on(
      table.slug,
      table.locale
    ),
    categoryIdx: index("glossary_category_idx").on(table.category),
    publishedIdx: index("glossary_published_idx").on(table.published),
  })
);

/* ==========================================================
   News Sources — Scraped news for AI content generation
   ========================================================== */

export const newsSources = pgTable(
  "news_sources",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 1000 }).notNull(),
    title: varchar("title", { length: 500 }).notNull(),
    source: varchar("source", { length: 100 }).notNull(), // reuters, kitco, etc.
    summary: text("summary"),
    metals: varchar("metals", { length: 50 }).array(),
    sentiment: varchar("sentiment", { length: 20 }), // positive, negative, neutral
    scrapedAt: timestamp("scraped_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    urlIdx: uniqueIndex("news_sources_url_idx").on(table.url),
    scrapedAtIdx: index("news_sources_scraped_idx").on(table.scrapedAt),
  })
);

/* ==========================================================
   Users
   ========================================================== */

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  provider: varchar("provider", { length: 50 }), // google, email
  tier: varchar("tier", { length: 20 }).notNull().default("free"), // free, premium
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* ==========================================================
   Alerts — User-configured price alerts
   ========================================================== */

export const alerts = pgTable(
  "alerts",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    symbol: varchar("symbol", { length: 10 }).notNull(),
    alertType: varchar("alert_type", { length: 50 }).notNull(), // price_above, price_below, pct_change, ratio
    threshold: decimal("threshold", { precision: 12, scale: 4 }).notNull(),
    active: boolean("active").notNull().default(true),
    lastTriggered: timestamp("last_triggered", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdx: index("alerts_user_idx").on(table.userId),
    activeIdx: index("alerts_active_idx").on(table.active),
  })
);

/* ==========================================================
   Alert History
   ========================================================== */

export const alertHistory = pgTable(
  "alert_history",
  {
    id: serial("id").primaryKey(),
    alertId: integer("alert_id").references(() => alerts.id),
    userId: integer("user_id").references(() => users.id),
    message: text("message").notNull(),
    priceAtTrigger: decimal("price_at_trigger", {
      precision: 12,
      scale: 4,
    }).notNull(),
    triggeredAt: timestamp("triggered_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userTriggeredIdx: index("alert_history_user_idx").on(
      table.userId,
      table.triggeredAt
    ),
  })
);

/* ==========================================================
   LEARN SYSTEM — Educational content at scale
   ========================================================== */

export const learnClusters = pgTable("learn_clusters", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  position: integer("position").notNull().default(0),
  articleCount: integer("article_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const learnClusterLocalizations = pgTable(
  "learn_cluster_localizations",
  {
    id: serial("id").primaryKey(),
    clusterId: integer("cluster_id")
      .notNull()
      .references(() => learnClusters.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    seoTitle: varchar("seo_title", { length: 120 }),
    metaDescription: varchar("meta_description", { length: 160 }),
  },
  (table) => ({
    uniqueLocale: uniqueIndex("learn_cluster_loc_unique").on(
      table.clusterId,
      table.locale
    ),
  })
);

export const learnSubclusters = pgTable(
  "learn_subclusters",
  {
    id: serial("id").primaryKey(),
    clusterId: integer("cluster_id")
      .notNull()
      .references(() => learnClusters.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 150 }).notNull(),
    position: integer("position").notNull().default(0),
    articleCount: integer("article_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueSlug: uniqueIndex("learn_subcluster_slug_unique").on(table.slug),
    clusterIdx: index("learn_subcluster_cluster_idx").on(table.clusterId),
  })
);

export const learnSubclusterLocalizations = pgTable(
  "learn_subcluster_localizations",
  {
    id: serial("id").primaryKey(),
    subclusterId: integer("subcluster_id")
      .notNull()
      .references(() => learnSubclusters.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    seoTitle: varchar("seo_title", { length: 120 }),
    metaDescription: varchar("meta_description", { length: 160 }),
  },
  (table) => ({
    uniqueLocale: uniqueIndex("learn_subcluster_loc_unique").on(
      table.subclusterId,
      table.locale
    ),
  })
);

export const learnTags = pgTable("learn_tags", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
});

export const learnTagLocalizations = pgTable(
  "learn_tag_localizations",
  {
    id: serial("id").primaryKey(),
    tagId: integer("tag_id")
      .notNull()
      .references(() => learnTags.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    name: varchar("name", { length: 150 }).notNull(),
  },
  (table) => ({
    uniqueLocale: uniqueIndex("learn_tag_loc_unique").on(
      table.tagId,
      table.locale
    ),
  })
);

export const learnArticles = pgTable(
  "learn_articles",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    clusterId: integer("cluster_id")
      .notNull()
      .references(() => learnClusters.id),
    subclusterId: integer("subcluster_id").references(
      () => learnSubclusters.id
    ),
    difficulty: varchar("difficulty", { length: 20 }).notNull(), // beginner, intermediate, advanced
    articleType: varchar("article_type", { length: 30 }).notNull(), // glossary, explainer, guide, comparison, faq, historical, practical, macro, investment, industry
    isPillar: boolean("is_pillar").notNull().default(false),
    metals: varchar("metals", { length: 10 }).array(), // XAU, XAG, XPT, XPD, XRH
    position: integer("position").notNull().default(0),
    status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, review, published, archived
    qualityScore: integer("quality_score"), // 0-100
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("learn_articles_slug_idx").on(table.slug),
    clusterIdx: index("learn_articles_cluster_idx").on(table.clusterId),
    subclusterIdx: index("learn_articles_subcluster_idx").on(
      table.subclusterId
    ),
    statusIdx: index("learn_articles_status_idx").on(table.status),
    difficultyIdx: index("learn_articles_difficulty_idx").on(table.difficulty),
    typeIdx: index("learn_articles_type_idx").on(table.articleType),
    pillarIdx: index("learn_articles_pillar_idx").on(table.isPillar),
  })
);

export const learnArticleLocalizations = pgTable(
  "learn_article_localizations",
  {
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => learnArticles.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    seoTitle: varchar("seo_title", { length: 120 }),
    metaDescription: varchar("meta_description", { length: 160 }),
    summary: text("summary").notNull(),
    keyIdea: text("key_idea").notNull(),
    content: text("content").notNull(),
    keyTakeaways: text("key_takeaways"),
    faq: text("faq"), // JSON string: [{q, a}]
    translationStatus: varchar("translation_status", { length: 20 })
      .notNull()
      .default("pending"), // pending, in_progress, done, reviewed
    translatedAt: timestamp("translated_at", { withTimezone: true }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    uniqueLocale: uniqueIndex("learn_article_loc_unique").on(
      table.articleId,
      table.locale
    ),
    localeIdx: index("learn_article_loc_locale_idx").on(table.locale),
    translationStatusIdx: index("learn_article_loc_trans_idx").on(
      table.translationStatus
    ),
  })
);

export const learnArticleTags = pgTable(
  "learn_article_tags",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => learnArticles.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => learnTags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: uniqueIndex("learn_article_tags_pk").on(table.articleId, table.tagId),
  })
);

export const learnGlossaryTerms = pgTable(
  "learn_glossary_terms",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    linkedArticleId: integer("linked_article_id").references(
      () => learnArticles.id
    ),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    linkedArticleIdx: index("learn_glossary_article_idx").on(
      table.linkedArticleId
    ),
  })
);

export const learnGlossaryTermLocalizations = pgTable(
  "learn_glossary_term_localizations",
  {
    id: serial("id").primaryKey(),
    termId: integer("term_id")
      .notNull()
      .references(() => learnGlossaryTerms.id, { onDelete: "cascade" }),
    locale: varchar("locale", { length: 10 }).notNull(),
    term: varchar("term", { length: 200 }).notNull(),
    definition: text("definition").notNull(),
  },
  (table) => ({
    uniqueLocale: uniqueIndex("learn_glossary_loc_unique").on(
      table.termId,
      table.locale
    ),
    localeIdx: index("learn_glossary_loc_locale_idx").on(table.locale),
  })
);

export const learnArticleGlossary = pgTable(
  "learn_article_glossary",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => learnArticles.id, { onDelete: "cascade" }),
    termId: integer("term_id")
      .notNull()
      .references(() => learnGlossaryTerms.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: uniqueIndex("learn_article_glossary_pk").on(
      table.articleId,
      table.termId
    ),
  })
);

export const learnInternalLinks = pgTable(
  "learn_internal_links",
  {
    id: serial("id").primaryKey(),
    sourceArticleId: integer("source_article_id")
      .notNull()
      .references(() => learnArticles.id, { onDelete: "cascade" }),
    targetArticleId: integer("target_article_id")
      .notNull()
      .references(() => learnArticles.id, { onDelete: "cascade" }),
    linkType: varchar("link_type", { length: 30 }).notNull(), // related, prerequisite, deeper_dive, comparison, see_also
    relevanceScore: integer("relevance_score").notNull().default(50), // 0-100
    anchor: varchar("anchor", { length: 200 }),
  },
  (table) => ({
    sourceIdx: index("learn_link_source_idx").on(table.sourceArticleId),
    targetIdx: index("learn_link_target_idx").on(table.targetArticleId),
    uniqueLink: uniqueIndex("learn_link_unique").on(
      table.sourceArticleId,
      table.targetArticleId
    ),
  })
);

export const learnContentJobs = pgTable(
  "learn_content_jobs",
  {
    id: serial("id").primaryKey(),
    jobType: varchar("job_type", { length: 30 }).notNull(), // generate, translate, validate, link
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, running, done, failed
    targetLocale: varchar("target_locale", { length: 10 }),
    batchId: varchar("batch_id", { length: 50 }),
    articlesProcessed: integer("articles_processed").notNull().default(0),
    articlesTotal: integer("articles_total").notNull().default(0),
    errorLog: text("error_log"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusIdx: index("learn_jobs_status_idx").on(table.status),
    batchIdx: index("learn_jobs_batch_idx").on(table.batchId),
  })
);

/* ==========================================================
   Error Logs — 404s and runtime errors tracked for monitoring
   ========================================================== */

export const errorLogs = pgTable(
  "error_logs",
  {
    id: serial("id").primaryKey(),
    statusCode: integer("status_code").notNull(),
    path: varchar("path", { length: 2000 }).notNull(),
    referer: varchar("referer", { length: 2000 }),
    userAgent: varchar("user_agent", { length: 1000 }),
    locale: varchar("locale", { length: 10 }),
    ip: varchar("ip", { length: 45 }),
    message: text("message"),
    count: integer("count").notNull().default(1),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusIdx: index("error_logs_status_idx").on(table.statusCode),
    pathIdx: index("error_logs_path_idx").on(table.path),
    lastSeenIdx: index("error_logs_last_seen_idx").on(table.lastSeenAt),
  })
);

/* ==========================================================
   Type exports
   ========================================================== */

export type MetalPrice = typeof metalPrices.$inferSelect;
export type NewMetalPrice = typeof metalPrices.$inferInsert;
export type PriceHistoryRow = typeof priceHistory.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type ArticleTranslation = typeof articleTranslations.$inferSelect;
export type NewArticleTranslation = typeof articleTranslations.$inferInsert;
export type GlossaryTerm = typeof glossaryTerms.$inferSelect;
export type NewGlossaryTerm = typeof glossaryTerms.$inferInsert;
export type User = typeof users.$inferSelect;
export type Alert = typeof alerts.$inferSelect;

export type LearnCluster = typeof learnClusters.$inferSelect;
export type LearnSubcluster = typeof learnSubclusters.$inferSelect;
export type LearnArticle = typeof learnArticles.$inferSelect;
export type LearnArticleLocalization =
  typeof learnArticleLocalizations.$inferSelect;
export type LearnTag = typeof learnTags.$inferSelect;
export type LearnGlossaryTerm = typeof learnGlossaryTerms.$inferSelect;
export type LearnInternalLink = typeof learnInternalLinks.$inferSelect;
export type LearnContentJob = typeof learnContentJobs.$inferSelect;
export type ErrorLog = typeof errorLogs.$inferSelect;
export type NewErrorLog = typeof errorLogs.$inferInsert;
