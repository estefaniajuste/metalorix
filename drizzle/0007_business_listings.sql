CREATE TABLE IF NOT EXISTS "business_listings" (
  "id" serial PRIMARY KEY NOT NULL,
  "email" varchar(255) NOT NULL,
  "business_name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "country_code" varchar(5) NOT NULL,
  "city" varchar(255) NOT NULL,
  "address" varchar(500),
  "website" varchar(500),
  "phone" varchar(50),
  "whatsapp" varchar(50),
  "instagram" varchar(100),
  "type" varchar(20) NOT NULL DEFAULT 'physical',
  "metals" varchar(10)[] NOT NULL,
  "services" varchar(30)[] NOT NULL,
  "description" text,
  "locale" varchar(5) NOT NULL DEFAULT 'en',
  "status" varchar(20) NOT NULL DEFAULT 'pending',
  "featured" boolean NOT NULL DEFAULT false,
  "verified" boolean NOT NULL DEFAULT false,
  "verification_token" varchar(100),
  "email_verified" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "business_listings_status_idx" ON "business_listings" ("status");
CREATE INDEX IF NOT EXISTS "business_listings_country_idx" ON "business_listings" ("country_code");
CREATE INDEX IF NOT EXISTS "business_listings_slug_idx" ON "business_listings" ("slug");
CREATE INDEX IF NOT EXISTS "business_listings_email_idx" ON "business_listings" ("email");
