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

---

## URLs/slugs SIEMPRE en el idioma del contenido

**CRÍTICO para SEO y UX.** Toda URL con slug dinámico DEBE tener el slug en el mismo idioma que el contenido de la página. Un slug en español en una página en inglés es un bug grave.

### Cómo funciona:

| Sección | Fuente del slug localizado | Archivo clave |
|---------|---------------------------|---------------|
| Noticias | `article_translations.slug` | `src/lib/ai/content-generator.ts` (`translateArticle`) |
| Productos | `PRODUCT_SLUGS_I18N` (estático) | `src/lib/data/product-slugs.ts` |
| Learn articles | `learn_article_localizations.slug` | `src/lib/learn/slug-i18n.ts` |
| Learn clusters | `CLUSTER_SLUG_I18N` (estático) | `src/lib/learn/slug-i18n.ts` |

### Al añadir nuevo contenido dinámico traducido:

1. La traducción DEBE incluir un slug en el idioma destino
2. La página de detalle DEBE resolver slugs localizados al contenido base
3. La lista DEBE usar el slug localizado en los links
4. El sitemap DEBE usar slugs localizados en los `<xhtml:link>` alternates
5. `generateStaticParams` DEBE incluir todos los slugs (base + localizados)

Ver `.cursor/rules/i18n-slugs.mdc` para detalles y ejemplos de código.

---

## Deploy a producción — Recordatorio obligatorio

**Cuando un agente hace cambios que deben ir a producción**, al terminar DEBE:

1. **Recordar al usuario** que haga commit y push si quiere que los cambios lleguen a metalorix.com
2. Si el usuario lo pide, ejecutar `git add`, `git commit` y `git push origin main`
3. Tras el push, verificar que el deploy se completó con éxito (`gh run list` + curl a producción)

No asumir que los cambios están en producción solo porque el código está listo. Sin commit + push, la web no se actualiza.

---

## Backlog de funcionalidades pendientes

> Estado a marzo 2026. Actualizar cuando se implementen.

### Alertas técnicas (`technicalCross`)
- **Estado**: marcadas como "Próximamente" en `/alertas` (badge + opacidad reducida en UI)
- **Qué son**: alertas cuando un indicador técnico cruza un umbral (medias móviles, RSI…)
- **Complejidad**: alta — requiere calcular indicadores sobre `price_history`
- **Archivos a tocar**: `src/lib/alerts/engine.ts`, `src/app/[locale]/alertas/page.tsx`, `src/components/alerts/SubscribeForm.tsx`

### Marketplace P2P (tablón de anuncios)
- **Estado**: pospuesto hasta tener masa crítica de usuarios
- **Modelo decidido**: tablón sin intermediación de pagos; Metalorix nunca toca dinero
- **Contacto**: directo entre usuarios (email o WhatsApp)
- **Requisito legal**: términos que eximen de responsabilidad a Metalorix
- **Dependencia**: se desarrolla junto al perfil de usuario mejorado

### Perfil de usuario mejorado
- **Estado**: pendiente, va unido al marketplace
- **Panel actual** (`/panel`): solo muestra alertas activas e historial de disparos
- **Mejoras acordadas**: historial de operaciones (cuando haya marketplace), preferencias de notificación

### Limpieza técnica
- **Borrar `src/app/api/cron/migrate/route.ts`**: endpoint temporal para aplicar la migración `users.unsubscribed`. La migración ya está en producción; el archivo puede eliminarse.

---

## Tareas manuales pendientes del usuario

> Estas tareas NO puede hacerlas el agente. Son acciones que requiere acceso humano a Google Search Console. Cuando el usuario las complete, eliminar el bloque correspondiente de este archivo.

### Google Search Console — Indexación directorio de dealers

El directorio de dealers (`/donde-comprar`) fue implementado en marzo 2026 con ~200+ URLs nuevas. El usuario debe solicitar indexación manualmente en GSC (Inspección de URLs → Solicitar indexación).

**Orden de prioridad:**

1. **Página "Mejores dealers"** (alta intención de backlinks):
   - `https://metalorix.com/en/where-to-buy/best`
   - `https://metalorix.com/es/donde-comprar/mejores`
   - (y las versiones en de, zh, ar, tr, hi)

2. **Países nuevos** añadidos en marzo 2026 (Japón, Holanda, Brasil, Bélgica, Corea del Sur, Polonia):
   - `https://metalorix.com/en/where-to-buy/japan`
   - `https://metalorix.com/en/where-to-buy/netherlands`
   - `https://metalorix.com/en/where-to-buy/brazil`
   - `https://metalorix.com/en/where-to-buy/belgium`
   - `https://metalorix.com/en/where-to-buy/south-korea`
   - `https://metalorix.com/en/where-to-buy/poland`

3. **Páginas de ciudad en inglés** (alta intención local, poca competencia):
   - `/en/where-to-buy/united-kingdom/london`
   - `/en/where-to-buy/germany/frankfurt`
   - `/en/where-to-buy/germany/munich`
   - `/en/where-to-buy/spain/madrid`
   - `/en/where-to-buy/france/paris`
   - `/en/where-to-buy/japan/tokyo`
   - `/en/where-to-buy/australia/perth`
   - `/en/where-to-buy/australia/sydney`
   - `/en/where-to-buy/canada/ottawa`
   - `/en/where-to-buy/turkey/istanbul`
   - `/en/where-to-buy/india/new-delhi`
   - `/en/where-to-buy/uae/dubai`
   - `/en/where-to-buy/poland/warsaw`
   - `/en/where-to-buy/south-korea/seoul`
   - `/en/where-to-buy/brazil/sao-paulo`
   - `/en/where-to-buy/italy/arezzo`
   - `/en/where-to-buy/italy/rome`
   - `/en/where-to-buy/portugal/lisbon`
   - `/en/where-to-buy/austria/vienna`
   - `/en/where-to-buy/netherlands/amsterdam`
