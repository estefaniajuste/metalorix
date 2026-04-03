CREATE TABLE IF NOT EXISTS "user_portfolios" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "symbol" varchar(10) NOT NULL,
  "quantity" numeric(14, 6) NOT NULL,
  "unit" varchar(5) NOT NULL DEFAULT 'oz',
  "purchase_price" numeric(12, 4) NOT NULL,
  "purchase_date" varchar(10) NOT NULL,
  "notes" varchar(500) DEFAULT '',
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "user_portfolios_user_idx" ON "user_portfolios" ("user_id");
CREATE INDEX IF NOT EXISTS "user_portfolios_user_symbol_idx" ON "user_portfolios" ("user_id", "symbol");
