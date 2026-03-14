CREATE TABLE IF NOT EXISTS "article_translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"locale" varchar(10) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "glossary_terms" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"term" varchar(255) NOT NULL,
	"locale" varchar(10) DEFAULT 'es' NOT NULL,
	"definition" text NOT NULL,
	"content" text,
	"category" varchar(100),
	"related_slugs" varchar(50)[],
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "article_translations" ADD CONSTRAINT "article_translations_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "article_translations_article_locale_idx" ON "article_translations" USING btree ("article_id","locale");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "article_translations_locale_idx" ON "article_translations" USING btree ("locale");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "glossary_slug_locale_idx" ON "glossary_terms" USING btree ("slug","locale");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "glossary_category_idx" ON "glossary_terms" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "glossary_published_idx" ON "glossary_terms" USING btree ("published");