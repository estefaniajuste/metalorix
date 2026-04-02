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
| Precios spot metales | Yahoo Finance, Gold API, Twelve Data | Precios en tiempo real y gráficos |
| Precio BTC | CoinGecko (primary), Binance (fallback) | Dashboard Gold vs Bitcoin, `/api/btc-price` |
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
- ~~**Borrar `src/app/api/cron/migrate/route.ts`**~~ — eliminado en marzo 2026.

---

## Ideas futuras — pendientes de valorar

### Tablón de anuncios / marketplace usuario a usuario

**Idea:** Permitir que usuarios publiquen anuncios para comprar o vender metales preciosos físicos entre particulares (monedas, lingotes, joyas).

**Estado:** Descartado por ahora. Retomar cuando el directorio de dealers esté asentado.

**Por qué se descartó (marzo 2026):**
- **Riesgo legal alto:** intermediar en transacciones entre particulares implica responsabilidad legal (fraude, lavado de dinero, regulación financiera según país). Requiere asesoría legal antes de implementar.
- **Complejidad técnica:** sistema de usuarios vendedores, moderación de anuncios, gestión de disputas, pagos o escrow.
- **Alternativa más segura implementada:** directorio de dealers verificados por país (`/donde-comprar`), que ofrece valor similar (conectar compradores con vendedores) sin los riesgos del marketplace.

**Cuando se retome, considerar:**
- Empezar solo como tablón informativo (sin pagos en la plataforma): el usuario publica su anuncio con contacto externo
- Limitar a países con regulación más laxa o donde Metalorix tenga base legal clara
- Añadir disclaimer legal muy visible en cada anuncio
- Moderación manual de anuncios antes de publicar

---

## CTR Optimization — Tareas pendientes (abril 2026)

> Acciones para mejorar el Click-Through Rate (CTR) en Google. CTR actual: ~0.19% con 131K+ impresiones.

### Implementado (abril 2026)
- **H1 = seoTitle en learn articles**: El `<h1>` ahora usa `seoTitle` (optimizado para SEO) en vez de `title` (genérico). Evita que Google reescriba el título SERP.
- **Breadcrumb JSON-LD corregido**: Las URLs en el schema BreadcrumbList ahora usan rutas localizadas (`/de/lernen-investition/` en vez de `/de/learn/`).
- **FAQ schema en fear-greed**: Añadido `FAQPage` JSON-LD (la UI de FAQ ya existía pero faltaba el structured data).
- **Meta descriptions truncadas a 155 chars**: Añadido truncado en `guia-inversion` y `fear-greed` para evitar que Google corte la descripción.
- **Redirects 301 para bare paths**: `middleware.ts` ahora convierte paths sin prefijo locale en 301 (antes eran 307 de next-intl).
- **Redirect single-hop para learn paths**: Eliminada cadena de redirects en rutas `/learn/` con cluster slugs extranjeros.

### Pendiente — Acciones de código (agente puede hacer)

1. **Añadir FAQ schema a más páginas de alto tráfico**
   - `precio-oro-hoy/page.tsx` — sin FAQ JSON-LD (necesita crear FAQs relevantes en messages/*.json)
   - `precio-gramo-oro/page.tsx` — sin FAQ JSON-LD
   - `ratio-oro-plata/page.tsx` — sin FAQ JSON-LD
   - `herramientas/page.tsx` — sin FAQ JSON-LD
   - `donde-comprar/page.tsx` — sin FAQ JSON-LD
   - **Referencia**: ver cómo `fear-greed/page.tsx` implementa FAQ schema con `faqSchema()` de `@/lib/seo/schemas`

2. **Revisar y acortar title tags en messages/*.json**
   - Muchos titles exceden 60 chars con el sufijo "— Metalorix" o "| Metalorix"
   - Priorizar: `precioOroHoy.title`, `fearGreedPage.metaTitle`, `guide.title` en ES y DE (son los más largos)
   - Los titles de noticias y learn vienen de DB (seoTitle) — revisar el prompt de Gemini para pedir ≤47 chars

3. **Añadir meta description truncada a las demás páginas estáticas**
   - `precio-oro-hoy`, `precio-gramo-oro`, `ratio-oro-plata`, `herramientas`, `donde-comprar`
   - Mismo patrón que `guia-inversion` y `fear-greed` (truncar a 155 chars en `generateMetadata`)

### Pendiente — Acciones manuales del usuario (no puede hacer el agente)

1. **URGENTE: Re-indexar URLs con 301 en GSC**
   - GSC muestra ~50+ URLs con cluster slugs antiguos que ahora dan 301 (ej: `/tr/ogren-yatirim/guides/...`, `/es/aprende-inversion/geology-science/...`)
   - Estas URLs tienen miles de impresiones pero 0 clicks porque Google aún muestra la URL antigua
   - Ir a GSC → Inspección de URLs → solicitar indexación de la URL DESTINO (la correcta) para cada una
   - Prioridad máxima: las URLs con más impresiones del CSV de GSC

2. **Re-enviar sitemap en GSC**
   - Ir a GSC → Sitemaps → solicitar re-envío de `https://metalorix.com/api/sitemap`
   - Acelera el re-crawl y actualización de URLs corregidas

3. **Monitorizar CTR por página (esperar 2-4 semanas)**
   - Comparar CTR antes/después en las top-20 páginas por impresiones
   - Si no mejora en learn articles, considerar reescribir seoTitles en DB

4. **Reescribir títulos de artículos learn de alto tráfico**
   - Páginas como "What Is Gold?" → "What Is Gold? Value, Uses & Why Investors Buy It in 2026"
   - Esto requiere editar `seoTitle` en las localizaciones de la DB

---

## Estrategia de producto y crecimiento (abril 2026)

> Diagnóstico profundo basado en datos GSC + análisis competitivo.

### Diagnóstico: Por qué el CTR es tan bajo

| Problema | Evidencia | Impacto |
|----------|-----------|---------|
| **Marca desconocida** | 0 búsquedas de "metalorix", solo 5 de "metalorex" (typo) | Usuarios eligen Kitco/PCGS/NGC sobre marca desconocida |
| **Sin producto "sticky"** | goldprice.org tiene portfolio tracker → 4.1M visitas/mes | Sin razón para volver cada día |
| **Contenido sin diferenciación** | Learn articles compiten con Wikipedia, PCGS, Investopedia | Mismo contenido, menos autoridad |
| **~50 URLs con 301 en Google** | Google muestra URLs antiguas → redirect → URL correcta | Experiencia degradada, posible penalización |
| **Sin presencia crypto** | "bitcoin price" = 3.6M búsquedas/mes; oro vs bitcoin no rankea | Mercado enorme ignorado |
| **Herramientas invisibles** | 0 impresiones en GSC para /tools, /roi-calculator, etc. | Las herramientas existen pero Google no las muestra |
| **Noticias genéricas** | Solo 22 impresiones en la mejor noticia de noticias | AI summaries no compiten con Reuters/Kitco |

### TOP 3 features (por impacto) — ESTADO

#### 1. ✅ Portfolio Tracker — IMPLEMENTADO (abril 2026)

**Estado:** En producción. Fase 1 completada.

**Lo que se construyó:**
- `src/app/[locale]/portfolio/page.tsx` — Landing page con metadata, BreadcrumbList + SoftwareApp + FAQPage JSON-LD
- `src/components/portfolio/PortfolioTracker.tsx` — Componente cliente: add/edit/delete holdings, valuación real-time, P&L, allocation visual
- Persistencia en `localStorage` (Fase 1), precios via `usePrices()` hook existente
- URLs localizadas: `/en/portfolio`, `/es/portfolio`, `/de/portfolio`, `/zh/zichan`, `/ar/mihfaza`, `/tr/portfoy`, `/hi/portfolio`
- Visible en: nav, footer, tools page, homepage CTA, mobile section nav
- i18n completo en 7 locales

**Fases pendientes:**
- **Fase 2**: sincronización con cuenta de usuario (ya tenemos auth) — guardar holdings en DB
- **Fase 3**: portfolio compartible (imagen/link para redes sociales) → viral loop
- **Fase premium**: exportar PDF fiscal, alertas de portfolio, análisis avanzado

#### 2. ✅ Bitcoin + Gold Dashboard — IMPLEMENTADO (abril 2026)

**Estado:** En producción. Dashboard interactivo en `/compare/gold-vs-bitcoin`.

**Lo que se construyó:**
- `src/app/api/btc-price/route.ts` — API con CoinGecko primary + Binance fallback, cache 60s in-memory
- `src/components/comparisons/GoldBtcDashboard.tsx` — Dashboard cliente: precios live Gold + BTC, market cap, ratio Gold/BTC, barra de dominancia animada, auto-refresh 60s
- FAQ schema (5 items) targeting "gold vs bitcoin" queries → rich results en SERPs
- Contenido editorial existente preservado debajo del dashboard
- i18n completo: dashboard + FAQ en 7 locales
- Fuentes de datos: `/api/prices` (oro, existente) + `/api/btc-price` (BTC, nuevo)

**Pendiente para v2:**
- Gráfico histórico Gold vs BTC (normalizado a 100) con periodos 1M/3M/1Y/5Y — requiere historical BTC data (CoinGecko market_chart endpoint)
- Crear landing page dedicada `/bitcoin-price` para capturar tráfico directo ("bitcoin price" = 3.6M búsquedas/mes)
- "Gold-Crypto Divergence Index" propio (branded, compartible)
- Alertas cuando correlación Gold-BTC cambia de signo
- Afiliados a exchanges crypto (Binance, Coinbase)

#### 3. ✅ Embeddable Gold Price Widget — IMPLEMENTADO (abril 2026)

**Estado:** En producción.

**Lo que se construyó:**
- `src/app/api/widget/route.ts` — HTML autocontenido (~3 KB, inline CSS+JS) para iframe. Params: `?metals=gold,silver&theme=dark`
- `src/components/widget/WidgetConfigurator.tsx` — Configurador interactivo: seleccionar metales, tema, preview en vivo, copiar embed code
- `src/app/[locale]/widget/page.tsx` — Landing page con 4 schemas: BreadcrumbList + SoftwareApp + FAQPage + HowTo
- URLs SEO: `/en/gold-price-widget`, `/es/widget-precio-oro`, `/de/goldpreis-widget`, etc.
- Cada embed incluye "Powered by Metalorix" con backlink a metalorix.com
- Auto-refresh de precios cada 60s, fetch desde `/api/prices` (same-origin en iframe)
- i18n completo en 7 locales

**Pendiente para v2:**
- Variantes: mini (solo precio, 1 línea), ticker (horizontal scrolling)
- Script loader (`embed.js`) que auto-dimensiona el iframe via `postMessage`
- Widget premium (sin logo, personalizable, colores custom) = $5/mes
- Tracking de embeds (cuántos sites usan el widget, cuáles generan más tráfico)

### Monetización — Plan completo

| Método | Timing | Revenue estimado |
|--------|--------|-----------------|
| **Afiliados dealers** | Ahora (ya tenemos /donde-comprar) | $30-100/lead vía Regal Assets, Silver Gold Bull |
| **Display ads (AdSense)** | Cuando >5K visitas/día | $5-15 CPM en nicho finance |
| **Widget premium** | Tras lanzar widget | $5/mes × N sites |
| **Portfolio premium** | Tras lanzar portfolio | $2.99/mes (export fiscal, alertas portfolio) |
| **Afiliados crypto** | Tras dashboard crypto | $10-50/signup en exchanges |
| **Sponsored content** | Con tráfico establecido | $500-2000/artículo patrocinado |

**Prioridad de monetización:** Afiliados dealers (ya implementable) → Ads → Widget premium → Portfolio premium

### Viralidad — Cómo hacer que la gente comparta

1. **Portfolio snapshot compartible**: "Mi portfolio de metales +15% este año" → imagen para Twitter/WhatsApp
2. **"Gold Alert" social**: cuando el oro sube/baja >2%, notificación + imagen generada automáticamente
3. **Embeddable widget**: cada sitio que lo pega = publicidad permanente
4. **Fear & Greed Index embebible**: este tipo de indicadores se comparten mucho en Twitter/fintwit
5. **Comparativa viral**: "¿Cuánto oro podrías comprar con tu sueldo?" → herramienta interactiva por país
6. **Referral**: usuarios invitan amigos → desbloquean features premium

### Hábito diario — Crear necesidad de volver

| Feature | Frecuencia de check | Hook psicológico |
|---------|---------------------|-------------------|
| Portfolio tracker | Diaria | "¿Cuánto vale mi oro hoy?" |
| Fear & Greed Index | Diaria | "¿Es buen momento para comprar?" |
| Daily price alert (email) | Diaria | El usuario abre email → click a la web |
| Bitcoin vs Gold ratio | Diaria (crypto users) | "¿Debería rotar de BTC a oro?" |
| Price milestone alerts | Event-driven | "¡El oro superó $3000!" |

### Contenido: Qué escribir (lo que la masa busca)

Las queries con más volumen global (datos de Ahrefs/SimilarWeb):
- "gold price" → 725K/mes (EN)
- "gold price today" → 508K/mes
- "bitcoin price" → 3.6M/mes
- "precio del oro" → ~100K/mes (ES)
- "buy gold" → ~50K/mes
- "gold vs bitcoin" → creciente
- "how to invest in gold" → ~30K/mes

**El contenido learn actual rankea para queries long-tail** (coin grading, liquidity comparison) pero NO para las queries de alto volumen. Para rankear en "gold price" se necesita autoridad de dominio (backlinks) que el widget puede generar.

### Pendiente — Próximos pasos de desarrollo (abril 2026)

#### Alta prioridad (código — agente puede hacer)

1. **Landing page `/bitcoin-price`** — Página dedicada al precio de BTC en tiempo real. Captura "bitcoin price" (3.6M búsquedas/mes). Reutilizar `/api/btc-price` ya creado.

2. **Gráfico histórico Gold vs BTC** — Añadir chart normalizado a 100 en `/compare/gold-vs-bitcoin` con periodos 1M/3M/1Y/5Y. Fuente: CoinGecko `/coins/bitcoin/market_chart` endpoint (free, no key).

3. **Portfolio Fase 2: sync con DB** — Guardar holdings en tabla `user_portfolios` (userId, symbol, quantity, unit, purchasePrice, purchaseDate). Migración Drizzle. Requiere usuario logueado.

4. **Widget v2: variantes mini + ticker** — Mini (solo gold price, 1 línea, ~200x40px). Ticker (horizontal scroll de todos los metales, ~100%x40px). Script loader `embed.js` con auto-sizing.

5. **Portfolio compartible (Fase 3)** — Generar imagen OG con el resumen del portfolio ("Mi oro +15% este año") para compartir en redes. Endpoint `/api/portfolio-card` que genera imagen.

#### Media prioridad (SEO técnico — agente puede hacer)

6. **FAQ schema en páginas de alto tráfico** — Falta en: `precio-oro-hoy`, `precio-gramo-oro`, `ratio-oro-plata`, `herramientas`, `donde-comprar`. Referencia: `fear-greed/page.tsx`.

7. **Meta description truncada** en páginas estáticas restantes — `precio-oro-hoy`, `precio-gramo-oro`, `ratio-oro-plata`, `herramientas`, `donde-comprar`. Mismo patrón que `guia-inversion`.

8. **Revisar y acortar title tags** en `messages/*.json` — Muchos > 60 chars con sufijo "— Metalorix". Priorizar: `precioOroHoy.title`, `fearGreedPage.metaTitle`, `guide.title`.

9. **"Gold-Crypto Divergence Index"** — Indicador branded propio. Cálculo basado en correlación rolling 30d entre Gold y BTC. Compartible en redes (genera tráfico viral crypto).

#### Baja prioridad / requiere decisión de negocio

10. **Widget premium** (sin logo, colores custom) — $5/mes. Requiere sistema de pago.
11. **Portfolio premium** (export PDF fiscal, alertas portfolio) — $2.99/mes.
12. **Afiliados dealers** — Integrar links de afiliado en `/donde-comprar`. Ya tenemos la infraestructura.
13. **Display ads (AdSense)** — Esperar >5K visitas/día.
14. **Afiliados crypto** — Links a Binance/Coinbase desde dashboard BTC.

### Errores técnicos encontrados (abril 2026)

1. **~50 URLs en GSC con 301 redirect** — Google indexó URLs con cluster slugs antiguos/extranjeros. Los 301 están correctos pero Google aún muestra las URLs viejas en SERPs.
2. **Posible canibalización**: `/en/learn/comparisons/liquidity-comparison-across-precious-metals` y `/en/learn/comparisons/liquidity-comparison-across-metals` sirven el mismo contenido con URLs diferentes. Consolidar con redirect.
3. **Herramientas sin visibilidad SEO**: ninguna herramienta aparece en GSC. Necesitan más internal links, FAQ schema, y contenido landing optimizado.

---

## Tareas manuales pendientes del usuario

> Estas tareas NO puede hacerlas el agente. Son acciones que requieren acceso humano. Cuando el usuario las complete, eliminar el bloque correspondiente de este archivo.

### Outreach a dealers para backlinks

Contactar a los ~80 dealers del directorio `/donde-comprar` pidiéndoles que enlacen a Metalorix desde su web. Esto genera backlinks que mejoran la autoridad de dominio y el ranking en Google.

**Herramientas disponibles:**
- Script: `node scripts/dealer-outreach.mjs > outreach-list.tsv` — genera lista TSV con nombre, web, país, ciudad, URL de ficha
- Templates de email en EN y ES: el mismo script los imprime por stderr
- Página de press kit: `/en/press` (y `/es/prensa`) tiene badges HTML copiables para que los dealers pongan en su web

**Prioridad:** empezar por dealers `Featured` (los más grandes, su backlink vale más).

**Nota sobre Reddit:** el usuario fue bloqueado en subreddits de metales (r/Silverbugs, r/Gold) por autopromoción. No insistir ahí.

**Metalorix no tiene redes sociales** — `sameAs` en Organization schema está vacío deliberadamente.

### Google Search Console — Indexación directorio de dealers

El directorio de dealers (`/donde-comprar`) fue implementado en marzo 2026 con ~200+ URLs nuevas. El usuario debe solicitar indexación manualmente en GSC (Inspección de URLs → Solicitar indexación).

**Orden de prioridad:**

1. ~~**Página "Mejores dealers"** — INDEXADA (marzo 2026)~~ ✓

2. ~~**Páginas de país** — TODAS INDEXADAS (marzo 2026)~~ ✓

3. **Páginas de ciudad en inglés** (hacer después de los países):
   - `https://metalorix.com/en/where-to-buy/argentina/buenos-aires`
   - `https://metalorix.com/en/where-to-buy/australia/melbourne`
   - `https://metalorix.com/en/where-to-buy/australia/perth`
   - `https://metalorix.com/en/where-to-buy/australia/sidney`
   - `https://metalorix.com/en/where-to-buy/austria/viena`
   - `https://metalorix.com/en/where-to-buy/belgium/amberes`
   - `https://metalorix.com/en/where-to-buy/brazil/brasilia`
   - `https://metalorix.com/en/where-to-buy/brazil/sao-paulo`
   - `https://metalorix.com/en/where-to-buy/canada/montreal`
   - `https://metalorix.com/en/where-to-buy/canada/ottawa`
   - `https://metalorix.com/en/where-to-buy/china/pekin`
   - `https://metalorix.com/en/where-to-buy/colombia/bogota`
   - `https://metalorix.com/en/where-to-buy/colombia/medellin`
   - `https://metalorix.com/en/where-to-buy/france/lyon`
   - `https://metalorix.com/en/where-to-buy/france/paris`
   - `https://metalorix.com/en/where-to-buy/germany/frankfurt`
   - `https://metalorix.com/en/where-to-buy/germany/munchen`
   - `https://metalorix.com/en/where-to-buy/india/kozhikode`
   - `https://metalorix.com/en/where-to-buy/india/nueva-delhi`
   - `https://metalorix.com/en/where-to-buy/italy/arezzo`
   - `https://metalorix.com/en/where-to-buy/italy/milan`
   - `https://metalorix.com/en/where-to-buy/italy/roma`
   - `https://metalorix.com/en/where-to-buy/italy/turin`
   - `https://metalorix.com/en/where-to-buy/japan/tokio`
   - `https://metalorix.com/en/where-to-buy/mexico/ciudad-de-mexico`
   - `https://metalorix.com/en/where-to-buy/netherlands/amsterdam`
   - `https://metalorix.com/en/where-to-buy/poland/varsovia`
   - `https://metalorix.com/en/where-to-buy/portugal/lisboa`
   - `https://metalorix.com/en/where-to-buy/saudi-arabia/riad`
   - `https://metalorix.com/en/where-to-buy/south-korea/seul`
   - `https://metalorix.com/en/where-to-buy/spain/madrid`
   - `https://metalorix.com/en/where-to-buy/spain/valencia`
   - `https://metalorix.com/en/where-to-buy/switzerland/mendrisio`
   - `https://metalorix.com/en/where-to-buy/turkey/istanbul`
   - `https://metalorix.com/en/where-to-buy/uae/dubai`
   - `https://metalorix.com/en/where-to-buy/united-kingdom/blackpool`
   - `https://metalorix.com/en/where-to-buy/united-kingdom/llantrisant`
