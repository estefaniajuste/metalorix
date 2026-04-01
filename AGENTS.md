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

1. **Solicitar re-indexación en GSC de URLs con redirects corregidos**
   - Las URLs con bare paths (`/learn/...`, `/news/...`) ahora tienen 301 correctos
   - Ir a GSC → Inspección de URLs → solicitar indexación para que Google actualice los redirects
   - Prioridad: las URLs que aparecían en GSC con más impresiones

2. **Revisar títulos SERP reales en GSC**
   - Ir a GSC → Rendimiento → Páginas → ver si el título mostrado coincide con el `<title>` tag
   - Si Google sigue reescribiendo títulos en learn articles, puede ser por el `title` field antiguo en DB
   - El fix de H1=seoTitle debería resolver esto tras el próximo crawl

3. **Monitorizar CTR por página tras los cambios**
   - Esperar 2-4 semanas para que Google procese los cambios
   - Comparar CTR antes/después en las top-20 páginas por impresiones
   - Si CTR no mejora en learn articles, considerar reescribir seoTitles en DB

4. **Enviar sitemap actualizado a GSC**
   - Ir a GSC → Sitemaps → solicitar re-envío de `https://metalorix.com/api/sitemap`
   - Esto acelera el re-crawl de las páginas con cambios

5. **Considerar títulos más "clickbait" (sin perder precisión)**
   - Páginas como "What Is Gold?" podrían beneficiarse de títulos tipo "What Is Gold? Uses, Value & Why Investors Buy It"
   - Esto requiere editar `seoTitle` en las localizaciones de la DB

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
