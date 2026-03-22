# SEO Priority Tasks — Checklist

Tareas ejecutadas y pendientes por orden de prioridad.

## Completadas

1. **Traducir seoTitle/metaDescription** — 4 artículos Learn (ppi-and-gold, coin-grading, hyperinflation, volatility) traducidos a es, zh, ar, tr, de
2. **Internal linking** — Enlaces cruzados entre ppi↔hyperinflation, volatility↔comparing-all; script `sync-internal-links.ts`
3. **Script reutilizable** — `update-learn-seo.ts` acepta JSON: `npx tsx scripts/update-learn-seo.ts docs/SEO-UPDATES-EXAMPLE.json`
4. **Schema markup** — FAQPage separado añadido en Learn (además de Article)
5. **Herramienta GSC** — `analyze-gsc-ctr.ts` analiza export CSV de GSC Pages y lista páginas con alto CTR potential
6. **Core Web Vitals** — Lighthouse CI en deploy; budgets en `lighthouse-budget.json`

## Verificación manual

- **Core Web Vitals**: GSC → Experiencia → Core Web Vitals (o PageSpeed Insights)
- **Reindexar**: GSC → Inspección de URLs → Solicitar indexación (para las 4 páginas Learn actualizadas)
- **GSC Pages export**: Performance → Páginas → Exportar → CSV → `npx tsx scripts/analyze-gsc-ctr.ts path/to/Páginas.csv`

## Scripts disponibles

| Script | Uso |
|--------|-----|
| `update-learn-seo.ts [file.json]` | Actualiza seoTitle/metaDescription (EN) desde JSON o built-in |
| `translate-learn-seo.ts` | Traduce seoTitle/metaDescription de 11 artículos Learn a es,zh,ar,tr,de |
| `fix-article-slugs.ts` | Corrige slugs de noticias en/de/tr que usan español (ej. /en/news/metales-preciosos-...) |
| `sync-internal-links.ts [slug...]` | Sincroniza relatedSlugs de topics → DB |
| `analyze-gsc-ctr.ts Páginas.csv` | Lista páginas Learn con alto CTR potential |
