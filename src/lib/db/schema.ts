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
    alertId: integer("alert_id")
      .notNull()
      .references(() => alerts.id),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
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
   Type exports
   ========================================================== */

export type MetalPrice = typeof metalPrices.$inferSelect;
export type NewMetalPrice = typeof metalPrices.$inferInsert;
export type PriceHistoryRow = typeof priceHistory.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type User = typeof users.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
