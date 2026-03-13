CREATE TABLE IF NOT EXISTS "alert_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"alert_id" integer,
	"user_id" integer,
	"message" text NOT NULL,
	"price_at_trigger" numeric(12, 4) NOT NULL,
	"triggered_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"alert_type" varchar(50) NOT NULL,
	"threshold" numeric(12, 4) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"last_triggered" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"metals" varchar(50)[],
	"image_url" varchar(500),
	"published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "metal_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"name" varchar(50) NOT NULL,
	"price_usd" numeric(12, 4) NOT NULL,
	"change_24h" numeric(12, 4),
	"change_pct_24h" numeric(8, 4),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "news_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" varchar(1000) NOT NULL,
	"title" varchar(500) NOT NULL,
	"source" varchar(100) NOT NULL,
	"summary" text,
	"metals" varchar(50)[],
	"sentiment" varchar(20),
	"scraped_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"price_usd" numeric(12, 4) NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatar_url" varchar(500),
	"provider" varchar(50),
	"tier" varchar(20) DEFAULT 'free' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_alert_id_alerts_id_fk" FOREIGN KEY ("alert_id") REFERENCES "public"."alerts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alert_history" ADD CONSTRAINT "alert_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "alert_history_user_idx" ON "alert_history" USING btree ("user_id","triggered_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "alerts_user_idx" ON "alerts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "alerts_active_idx" ON "alerts" USING btree ("active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_published_idx" ON "articles" USING btree ("published");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_category_idx" ON "articles" USING btree ("category");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "metal_prices_symbol_idx" ON "metal_prices" USING btree ("symbol");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "news_sources_url_idx" ON "news_sources" USING btree ("url");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "news_sources_scraped_idx" ON "news_sources" USING btree ("scraped_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_history_symbol_ts_idx" ON "price_history" USING btree ("symbol","timestamp");