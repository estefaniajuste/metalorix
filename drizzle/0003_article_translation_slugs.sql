ALTER TABLE "article_translations" ADD COLUMN "slug" varchar(255);
CREATE INDEX "article_translations_slug_idx" ON "article_translations" ("slug");
