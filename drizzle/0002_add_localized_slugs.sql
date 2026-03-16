-- Add localized slug column to learn_article_localizations
ALTER TABLE "learn_article_localizations"
  ADD COLUMN "slug" varchar(300);

-- Index for efficient slug lookups by locale
CREATE INDEX "learn_article_loc_slug_idx"
  ON "learn_article_localizations" ("slug", "locale");

-- Populate slugs from titles for existing rows using a simplified slugify
-- (replaces spaces/special chars with hyphens, lowercases, trims)
UPDATE "learn_article_localizations"
SET "slug" = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        TRANSLATE(
          LOWER("title"),
          'áàâãäåéèêëíìîïóòôõöúùûüñçşğıüöçş',
          'aaaaaaeeeeiiiioooooouuuuncsgiuocs'
        ),
        '[^a-z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    ),
    '^-+|-+$', '', 'g'
  )
)
WHERE "slug" IS NULL;
