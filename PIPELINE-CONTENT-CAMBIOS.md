# Cambios en pipeline de generación diaria

## Salvaguardas para lanzamiento (no publicar contenido inaceptable)

1. **Artículo mínimo rechazado**: Si Gemini falla y se usa `buildMinimalDailyArticle`, el cron **NO publica**. Devuelve 503. El workflow de GitHub falla y se puede reintentar.
2. **Traducciones con retry**: Si `translateArticle` devuelve 0, se reintenta una vez.
3. **Workflow falla en 4xx/5xx**: El step "Generate content" ahora hace `exit 1` si el endpoint devuelve 400+.

## Cómo retraducir un artículo existente

Ejecutar manualmente el workflow con `job=content` y `content_type=translate`. Eso traduce los 5 artículos más recientes que no tengan traducciones.

---

## Contexto del problema (histórico)
- Job manual `generate-content` con `type=daily` devolvió HTTP 200 pero `generated: []`
- Objetivo: que el sistema **nunca** termine con `generated: []`

## Cambios ya implementados (en este repo)

### 1. `src/lib/ai/gemini.ts`
- **Reintento automático**: si `generateText()` devuelve `null`, reintenta una vez
- Nuevo parámetro `retryOnEmpty = true` (por defecto)
- Log cuando la API devuelve 200 pero sin texto

### 2. `src/lib/ai/content-generator.ts`
- **`getPricesWithFallback()`**: cadena de fallback para precios:
  1. DB (`metal_prices`)
  2. Yahoo Finance (sin API key)
  3. Valores base de `METALS` (último recurso)
- **`generateDailySummary()`** ya no devuelve `null`:
  - Si Gemini no configurado → `buildMinimalDailyArticle`
  - Si Gemini devuelve vacío → `buildMinimalDailyArticle`
  - Siempre hay precios (fallback)
- **Logs** en cada etapa: `prices`, `news`, tamaño prompt, longitud respuesta Gemini, parseo JSON

### 3. `src/app/api/cron/generate-content/route.ts`
- Logs más claros cuando falla `saveArticle` o `generateDailySummary`
- Eliminado el bloque que rellenaba `dailyDebug` con prices/news cuando article era null (ya no debería ocurrir)

## Pendiente (no implementado)
- Nada crítico.

## Reintento de saveArticle (implementado)

Si `saveArticle` falla, se reintenta una vez para daily, evening, weekly y event. Reduce `generated: []` por fallos transitorios de DB.

## Workflow de contenido

El job `prepare-content` en `scheduled-crons.yml` ejecuta **scrape-news** y **scrape-prices** *antes* de `generate-content`. `generate-content` tiene `needs: [prepare-content]`, por lo que siempre dispone de noticias y precios frescos cuando corre (incluyendo trigger manual con `job=content`).

## Flujo actual
```
getPricesWithFallback() → siempre tiene precios
getRecentNews(24) → puede estar vacío
generateText(prompt) → reintenta 1x si null
  → si null: buildMinimalDailyArticle
  → si raw: parseStructuredResponse
    → si parsed: artículo con SEO
    → si no: fallback con raw.trim()
saveArticle() → si falla, se loguea pero generated sigue vacío
```

## Posibles causas de `generated: []` antes de estos cambios
1. `metal_prices` vacío + Gemini null → `generateDailySummary` devolvía null
2. `saveArticle` fallaba (DB) → no se añadía a `generated`
3. Job `content` sin ejecutar antes `news`/`prices` → sin datos para el prompt
