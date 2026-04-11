CREATE TABLE IF NOT EXISTS "metal_outlooks" (
  "id" serial PRIMARY KEY NOT NULL,
  "symbol" varchar(10) NOT NULL,
  "timeframe" varchar(10) NOT NULL,
  "score" integer NOT NULL,
  "signal" varchar(20) NOT NULL,
  "confidence" varchar(10) NOT NULL,
  "factors_json" jsonb NOT NULL,
  "narrative" text,
  "narrative_es" text,
  "generated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "outlook_symbol_tf_idx" ON "metal_outlooks" ("symbol", "timeframe");
CREATE INDEX IF NOT EXISTS "outlook_generated_idx" ON "metal_outlooks" ("generated_at");
