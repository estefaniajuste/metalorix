# Metalorix — Instrucciones para agentes de IA

## Atribución de fuentes y descargo de responsabilidad legal

**OBLIGATORIO en todo el proyecto.** Cualquier dato, precio, análisis o información que se publique en la web DEBE referenciar de dónde sale. Esto es un requisito legal para descargar de responsabilidad a Metalorix.

### Reglas:

1. **Todo artículo generado por IA** (diarios, semanales, eventos) DEBE incluir una sección `## Fuentes` al final con enlaces a las noticias originales utilizadas. Mínimo 2 fuentes por artículo.

2. **Los precios de metales** provienen de Yahoo Finance (`GC=F`, `SI=F`, `PL=F`, `PA=F`, `HG=F`), Gold API y Twelve Data. Si se cambia el proveedor de datos, actualizar esta referencia.

3. **Las noticias se generan con IA** (Gemini) a partir de fuentes RSS reales (Reuters, Kitco, CNBC, Investing.com, FT, Mining.com, BullionVault, World Gold Council). El contenido es un análisis generado por IA, NO contenido original editorial. Cada artículo debe dejar esto claro.

4. **Disclaimer de IA** obligatorio en cada artículo de noticias. Ya existe en la página de artículo (`article.aiDisclaimer`). NO eliminarlo nunca.

5. **Nunca publicar datos como propios.** Si un dato viene de Reuters, citar Reuters. Si es de Kitco, citar Kitco. La sección de fuentes al final de cada artículo es el mecanismo para esto.

6. **Al añadir nuevas fuentes de datos o feeds RSS**, documentar aquí de dónde provienen y bajo qué condiciones se usan.

### Archivos clave:

- `src/lib/ai/content-generator.ts` — Generación de artículos con Gemini. Los prompts deben pedir siempre el campo `fuentes` con título y URL.
- `src/lib/scraper/rss.ts` — Feeds RSS de donde se obtienen las noticias. Incluye la URL original de cada noticia.
- `src/app/[locale]/noticias/[slug]/page.tsx` — Renderizado de artículos. Incluye el disclaimer de IA y renderiza la sección de fuentes con enlaces externos.
- `src/app/api/cron/scrape-prices/route.ts` — Scraping de precios desde Yahoo Finance, Gold API, Twelve Data.

### Fuentes de datos actuales:

| Tipo | Fuentes | Uso |
|------|---------|-----|
| Precios spot | Yahoo Finance, Gold API, Twelve Data | Precios en tiempo real y gráficos |
| Noticias RSS | Reuters, Kitco, CNBC, Investing.com, FT, Mining.com, BullionVault, World Gold Council | Contexto para artículos IA |
| Tipo de cambio | Twelve Data (EURUSD) | Conversión USD/EUR |
| Contenido educativo | Generado por IA (Gemini) | Glosario y artículos learn |

---

## Verificación obligatoria en producción

**NUNCA afirmar que algo funciona basándose solo en leer el código.** Si el usuario pregunta si algo funciona, verificar el estado real en producción con curl/WebFetch.

### Checks obligatorios si el usuario pregunta por SEO o indexación:

```bash
curl -s -o /dev/null -w "%{http_code}" https://metalorix.com/api/sitemap  # debe ser 200
curl -s https://metalorix.com/robots.txt  # debe contener Sitemap
curl -s -o /dev/null -w "%{http_code}" https://metalorix.com/  # debe ser 200
```

Si cualquiera falla, **alertar al usuario inmediatamente**.

### Restricción de sitemap:

**NUNCA crear `src/app/sitemap.ts`** (convención Next.js). No funciona con `output: "standalone"` + `next-intl` en Cloud Run. El sitemap se sirve desde `src/app/api/sitemap/route.ts`. Ver `.cursor/rules/seo-disabled.mdc` para detalles completos.
