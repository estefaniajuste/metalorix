-- Metalorix Learn System: Educational Content at Scale
-- Migration: 0001_learn_system

-- Clusters (top-level categories)
CREATE TABLE IF NOT EXISTS "learn_clusters" (
  "id" serial PRIMARY KEY,
  "slug" varchar(120) NOT NULL UNIQUE,
  "position" integer NOT NULL DEFAULT 0,
  "article_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Cluster localizations
CREATE TABLE IF NOT EXISTS "learn_cluster_localizations" (
  "id" serial PRIMARY KEY,
  "cluster_id" integer NOT NULL REFERENCES "learn_clusters"("id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "seo_title" varchar(120),
  "meta_description" varchar(160)
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_cluster_loc_unique" ON "learn_cluster_localizations" ("cluster_id", "locale");

-- Subclusters (second-level categories)
CREATE TABLE IF NOT EXISTS "learn_subclusters" (
  "id" serial PRIMARY KEY,
  "cluster_id" integer NOT NULL REFERENCES "learn_clusters"("id") ON DELETE CASCADE,
  "slug" varchar(150) NOT NULL,
  "position" integer NOT NULL DEFAULT 0,
  "article_count" integer NOT NULL DEFAULT 0,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_subcluster_slug_unique" ON "learn_subclusters" ("slug");
CREATE INDEX IF NOT EXISTS "learn_subcluster_cluster_idx" ON "learn_subclusters" ("cluster_id");

-- Subcluster localizations
CREATE TABLE IF NOT EXISTS "learn_subcluster_localizations" (
  "id" serial PRIMARY KEY,
  "subcluster_id" integer NOT NULL REFERENCES "learn_subclusters"("id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "name" varchar(255) NOT NULL,
  "description" text,
  "seo_title" varchar(120),
  "meta_description" varchar(160)
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_subcluster_loc_unique" ON "learn_subcluster_localizations" ("subcluster_id", "locale");

-- Tags
CREATE TABLE IF NOT EXISTS "learn_tags" (
  "id" serial PRIMARY KEY,
  "slug" varchar(100) NOT NULL UNIQUE
);

-- Tag localizations
CREATE TABLE IF NOT EXISTS "learn_tag_localizations" (
  "id" serial PRIMARY KEY,
  "tag_id" integer NOT NULL REFERENCES "learn_tags"("id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "name" varchar(150) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_tag_loc_unique" ON "learn_tag_localizations" ("tag_id", "locale");

-- Articles (metadata)
CREATE TABLE IF NOT EXISTS "learn_articles" (
  "id" serial PRIMARY KEY,
  "slug" varchar(255) NOT NULL,
  "cluster_id" integer NOT NULL REFERENCES "learn_clusters"("id"),
  "subcluster_id" integer REFERENCES "learn_subclusters"("id"),
  "difficulty" varchar(20) NOT NULL,
  "article_type" varchar(30) NOT NULL,
  "is_pillar" boolean NOT NULL DEFAULT false,
  "metals" varchar(10)[],
  "position" integer NOT NULL DEFAULT 0,
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "quality_score" integer,
  "published_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_articles_slug_idx" ON "learn_articles" ("slug");
CREATE INDEX IF NOT EXISTS "learn_articles_cluster_idx" ON "learn_articles" ("cluster_id");
CREATE INDEX IF NOT EXISTS "learn_articles_subcluster_idx" ON "learn_articles" ("subcluster_id");
CREATE INDEX IF NOT EXISTS "learn_articles_status_idx" ON "learn_articles" ("status");
CREATE INDEX IF NOT EXISTS "learn_articles_difficulty_idx" ON "learn_articles" ("difficulty");
CREATE INDEX IF NOT EXISTS "learn_articles_type_idx" ON "learn_articles" ("article_type");
CREATE INDEX IF NOT EXISTS "learn_articles_pillar_idx" ON "learn_articles" ("is_pillar");

-- Article localizations (translated content)
CREATE TABLE IF NOT EXISTS "learn_article_localizations" (
  "id" serial PRIMARY KEY,
  "article_id" integer NOT NULL REFERENCES "learn_articles"("id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "title" varchar(300) NOT NULL,
  "seo_title" varchar(120),
  "meta_description" varchar(160),
  "summary" text NOT NULL,
  "key_idea" text NOT NULL,
  "content" text NOT NULL,
  "key_takeaways" text,
  "faq" text,
  "translation_status" varchar(20) NOT NULL DEFAULT 'pending',
  "translated_at" timestamp with time zone,
  "reviewed_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_article_loc_unique" ON "learn_article_localizations" ("article_id", "locale");
CREATE INDEX IF NOT EXISTS "learn_article_loc_locale_idx" ON "learn_article_localizations" ("locale");
CREATE INDEX IF NOT EXISTS "learn_article_loc_trans_idx" ON "learn_article_localizations" ("translation_status");

-- Article <-> Tag junction
CREATE TABLE IF NOT EXISTS "learn_article_tags" (
  "article_id" integer NOT NULL REFERENCES "learn_articles"("id") ON DELETE CASCADE,
  "tag_id" integer NOT NULL REFERENCES "learn_tags"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_article_tags_pk" ON "learn_article_tags" ("article_id", "tag_id");

-- Glossary terms
CREATE TABLE IF NOT EXISTS "learn_glossary_terms" (
  "id" serial PRIMARY KEY,
  "slug" varchar(120) NOT NULL UNIQUE,
  "linked_article_id" integer REFERENCES "learn_articles"("id"),
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "learn_glossary_article_idx" ON "learn_glossary_terms" ("linked_article_id");

-- Glossary term localizations
CREATE TABLE IF NOT EXISTS "learn_glossary_term_localizations" (
  "id" serial PRIMARY KEY,
  "term_id" integer NOT NULL REFERENCES "learn_glossary_terms"("id") ON DELETE CASCADE,
  "locale" varchar(10) NOT NULL,
  "term" varchar(200) NOT NULL,
  "definition" text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_glossary_loc_unique" ON "learn_glossary_term_localizations" ("term_id", "locale");
CREATE INDEX IF NOT EXISTS "learn_glossary_loc_locale_idx" ON "learn_glossary_term_localizations" ("locale");

-- Article <-> Glossary junction
CREATE TABLE IF NOT EXISTS "learn_article_glossary" (
  "article_id" integer NOT NULL REFERENCES "learn_articles"("id") ON DELETE CASCADE,
  "term_id" integer NOT NULL REFERENCES "learn_glossary_terms"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "learn_article_glossary_pk" ON "learn_article_glossary" ("article_id", "term_id");

-- Internal links between articles
CREATE TABLE IF NOT EXISTS "learn_internal_links" (
  "id" serial PRIMARY KEY,
  "source_article_id" integer NOT NULL REFERENCES "learn_articles"("id") ON DELETE CASCADE,
  "target_article_id" integer NOT NULL REFERENCES "learn_articles"("id") ON DELETE CASCADE,
  "link_type" varchar(30) NOT NULL,
  "relevance_score" integer NOT NULL DEFAULT 50,
  "anchor" varchar(200)
);
CREATE INDEX IF NOT EXISTS "learn_link_source_idx" ON "learn_internal_links" ("source_article_id");
CREATE INDEX IF NOT EXISTS "learn_link_target_idx" ON "learn_internal_links" ("target_article_id");
CREATE UNIQUE INDEX IF NOT EXISTS "learn_link_unique" ON "learn_internal_links" ("source_article_id", "target_article_id");

-- Content generation/translation job tracking
CREATE TABLE IF NOT EXISTS "learn_content_jobs" (
  "id" serial PRIMARY KEY,
  "job_type" varchar(30) NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "target_locale" varchar(10),
  "batch_id" varchar(50),
  "articles_processed" integer NOT NULL DEFAULT 0,
  "articles_total" integer NOT NULL DEFAULT 0,
  "error_log" text,
  "started_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "learn_jobs_status_idx" ON "learn_content_jobs" ("status");
CREATE INDEX IF NOT EXISTS "learn_jobs_batch_idx" ON "learn_content_jobs" ("batch_id");
