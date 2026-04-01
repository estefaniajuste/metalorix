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

### TOP 3 features a construir (por impacto)

#### 1. Portfolio Tracker (PRIORIDAD MÁXIMA — crea hábito diario)

**Qué es:** Los usuarios registran sus tenencias de oro/plata/platino (gramos, monedas, lingotes) con precio de compra. La app calcula en tiempo real el valor total, P&L, y rendimiento.

**Por qué funciona:**
- goldprice.org tiene esto y recibe 4.1M visitas/mes — es EL feature que genera retención
- GoldFolio (app) cobra $1.99/año solo por esto
- Crea el hábito diario: "¿cuánto vale mi oro hoy?"
- Los datos persisten → el usuario VUELVE

**Implementación:**
- Fase 1: localStorage (sin cuenta) → input de holdings → valor en tiempo real + gráfico P&L
- Fase 2: sincronización con cuenta de usuario (ya tenemos auth)
- Fase 3: portfolio compartible (imagen/link) → viral loop
- Archivos a crear: `src/app/[locale]/portfolio/page.tsx`, `src/components/portfolio/`

**Monetización:** Premium features (exportar PDF fiscal, alertas de portfolio, análisis avanzado)

#### 2. Bitcoin + Crypto vs Gold Dashboard (captura mercado crypto)

**Qué es:** Dashboard en tiempo real comparando oro vs Bitcoin vs S&P 500. Correlación rolling, performance comparativa, indicador de divergencia.

**Por qué funciona:**
- "bitcoin price" = 3.6M búsquedas/mes
- "gold vs bitcoin" es una query creciente en 2026
- La página actual `/compare/gold-vs-bitcoin` es estática y no rankea
- AhaSignals tiene un "Gold-Bitcoin Divergence Index" que atrae tráfico
- El público crypto es ENORME y comparte mucho en redes

**Implementación:**
- Añadir precio de BTC a los proveedores de datos (Yahoo Finance: BTC-USD)
- Dashboard interactivo: correlación, ratio BTC/Gold, performance YTD
- Crear "Gold-Crypto Divergence Index" propio (branded, compartible)
- Alertas cuando correlación cambia de signo

**Monetización:** Afiliados a exchanges crypto (Binance, Coinbase), ads

#### 3. Embeddable Gold Price Widget (motor viral + backlinks)

**Qué es:** Widget HTML/iframe gratuito que cualquier web puede pegar para mostrar precio del oro en tiempo real. Logo "Powered by Metalorix" con link.

**Por qué funciona:**
- Cada embed = backlink gratuito (SEO boost enorme)
- goldprice.org creció así: miles de sites enlazan su widget
- Es marketing viral pasivo — una vez que el widget se pega, genera tráfico indefinidamente
- Los blogs de inversión, dealers y foros NECESITAN esto

**Implementación:**
- Crear `src/app/api/widget/route.ts` → HTML/JS embebible
- Landing page `src/app/[locale]/widget/page.tsx` con código de embed y personalización
- Variantes: mini (solo precio), medio (precio + cambio), completo (precio + gráfico)

**Monetización:** Widget premium (sin logo, personalizable) = $5/mes

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

### Errores técnicos encontrados (abril 2026)

1. **~50 URLs en GSC con 301 redirect** — Google indexó URLs con cluster slugs antiguos/extranjeros. Los 301 están correctos pero Google aún muestra las URLs viejas en SERPs.
2. **Posible canibalización**: `/en/learn/comparisons/liquidity-comparison-across-precious-metals` y `/en/learn/comparisons/liquidity-comparison-across-metals` sirven el mismo contenido con URLs diferentes. Consolidar con redirect.
3. **Herramientas sin visibilidad SEO**: ninguna herramienta aparece en GSC. Necesitan más internal links, FAQ schema, y contenido landing optimizado.

---

## Tareas manuales pendientes del usuario

> Estas tareas NO puede hacerlas el agente. Son acciones que requiere acceso humano a Google Search Console. Cuando el usuario las complete, eliminar el bloque correspondiente de este archivo.

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
