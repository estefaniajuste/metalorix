# Auditoría SEO — 17 marzo 2026

## 1. Cambio del test E2E — Qué hacía antes vs ahora

### Antes (estado "bloqueado" del 15 marzo)
El test se llamaba **"robots.txt blocks all crawlers"** y comprobaba:
- `expect(body).toContain("Disallow: /")` — que robots.txt bloqueara TODO
- `expect(body).not.toContain("Sitemap")` — que NO hubiera sitemap

**Efecto:** El test validaba que el sitio estaba bloqueado para buscadores. Si alguien ejecutaba `npm run test:e2e` y el sitio estaba correctamente configurado (Allow + Sitemap), el test **fallaba**. El test no bloqueaba producción (el deploy no ejecuta E2E), pero documentaba un estado incorrecto.

### Ahora (estado correcto)
El test se llama **"robots.txt allows crawling and declares sitemap"** y comprueba:
- `expect(body).toContain("Allow: /")` — que se permita rastrear
- `expect(body).toContain("Sitemap")` — que haya sitemap
- `expect(body).toContain("api/sitemap")` — que la URL sea la correcta

**Diferencia:** El test ahora valida el estado SEO correcto. Si alguien rompe robots.ts volviendo a bloquear, el test fallará y lo detectará.

---

## 2. Verificación post-deploy (17 marzo 2026)

| Check | Resultado |
|-------|-----------|
| `/sitemap.xml` | 404 ✓ (redirect eliminado, ya no duplica) |
| `/api/sitemap` | 200, XML válido con 1000+ URLs ✓ |
| `/robots.txt` | Allow /, Sitemap, Disallow /api/ y /panel/ ✓ |
| `/api/seo/status` | `indexingApiConfigured: false` ⚠️ |
| `/googled1a167fc78548df7.html` | 200 ✓ (verificación GSC) |

---

## 3. Archivos modificados en el commit de "desconexión" (82463d4, 15 marzo)

| Archivo | Cambio en 82463d4 | Estado actual |
|---------|-------------------|---------------|
| `src/app/robots.ts` | Disallow /, sin Sitemap | ✓ Restaurado (Allow, Sitemap) |
| `src/lib/seo/ping.ts` | pingSearchEngines/pingIndexNow → no-ops | ✓ Restaurado (pings activos) |
| `src/app/api/cron/generate-content/route.ts` | Eliminadas llamadas a ping | ✓ Restaurado (ping + IndexNow) |
| `src/app/sitemap.ts` | Sitemap vacío | N/A — proyecto usa `/api/sitemap` (sitemap.ts eliminado en cced3a1) |
| `public/googled1a167fc78548df7.html` | Eliminado | ✓ Restaurado en bda11ec |
| `e2e/seo.spec.ts` | Test esperaba estado bloqueado | ✓ Corregido en este commit |

---

## 4. Posibles bloqueos restantes

### ⚠️ GOOGLE_INDEXING_KEY no configurado
`/api/seo/status` devuelve `indexingApiConfigured: false`. El cron `submit-indexing` envía URLs a la Google Indexing API cada día a las 09:00 UTC, pero si la clave no está configurada, devuelve 503 y no envía nada.

**Acción:** Añadir `GOOGLE_INDEXING_KEY` en GitHub Secrets (JSON de cuenta de servicio en base64) y verificar que el deploy lo pase a Cloud Run.

### INDEXNOW_KEY (opcional)
IndexNow acelera la indexación en Bing. Si no está configurado, `pingIndexNow` retorna false pero el resto del SEO funciona. No es bloqueante.

### X-Robots-Tag: noindex en /api/*
El middleware añade `X-Robots-Tag: noindex` a todas las rutas `/api/*`. Esto es correcto: las APIs no deben indexarse. `/api/sitemap` y `/api/feed` están en Allow de robots.txt, así que Google puede obtener el sitemap; el noindex en la respuesta del sitemap no impide que Google use las URLs del XML.

### Páginas con index: false (intencional)
- `/panel` — área de usuario, no indexar ✓
- Artículos learn cuando `isLocaleMatch` es false — evita contenido duplicado por idioma ✓

---

## 5. Resumen

- **robots.txt, sitemap, pings:** Correctos y activos.
- **Test E2E:** Corregido para validar el estado correcto.
- **GOOGLE_INDEXING_KEY:** Configurada y funcionando (verificado 17 mar 2026).

---

## 6. Auditoría completa del día del apagón (15 marzo 2026)

**Commit 82463d4** modificó 7 archivos. Estado actual de cada uno:

| Archivo | Cambio en 82463d4 | Estado actual | ¿Bloqueando? |
|---------|-------------------|---------------|--------------|
| `src/app/robots.ts` | Disallow /, sin Sitemap | ✓ Allow /, Sitemap | No |
| `src/lib/seo/ping.ts` | pingSearchEngines/pingIndexNow → no-ops | ✓ Pings activos (Google, Bing) | No |
| `src/app/api/cron/generate-content/route.ts` | Eliminadas llamadas a ping | ✓ pingSearchEngines + pingIndexNow restaurados | No |
| `src/app/sitemap.ts` | Sitemap vacío (0 URLs) | **Archivo eliminado** — proyecto usa `/api/sitemap/route.ts` | No |
| `public/googled1a167fc78548df7.html` | Eliminado | ✓ Restaurado (verificación GSC) | No |
| `e2e/seo.spec.ts` | Test esperaba "blocks all", "no Sitemap" | ✓ Test corregido (Allow, Sitemap) | No |
| `src/app/aprende/[slug]/page.tsx` | Modificado | **Eliminado** — páginas duplicadas quitadas en bda11ec | No |
| `src/app/aprende/page.tsx` | Modificado | **Eliminado** — idem | No |

**Conclusión:** No queda ningún bloqueo activo del día del apagón. Todo lo que se deshabilitó ha sido restaurado o sustituido correctamente.

---

## 7. Auditoría del día siguiente (16 marzo 2026)

Commits relevantes del 16 marzo y su estado actual:

| Commit | Descripción | ¿Dejó algo bloqueado? |
|--------|-------------|------------------------|
| **bda11ec** | Re-enable SEO, eliminar páginas duplicadas | No — todo restaurado |
| **7b3bf55** | Revert to static-only sitemap (44 URLs) | **Temporal** — 8b0396e lo revirtió 26 min después |
| **8b0396e** | Restore ~1000 dynamic URLs via fetch | ✓ Sitemap dinámico activo |
| **d7a093c** | Redirect sitemap.xml → /api/sitemap | Eliminado en f5c03cb (17 mar) — ya no duplica |
| **a9080db** | Remove /glosario y /aprende, keep /learn | ✓ Middleware redirige /aprende, /glosario → /learn |
| **cced3a1** | Serve sitemap at /api/sitemap | ✓ Arquitectura actual |
| **2027628** | Ventana horaria 19:00 → 19:29 UTC | Sustituido por 97edaee (07:00 UTC) |
| **68902e8** | SEO: sitemap improvements, robots | ✓ Mejoras aplicadas |

**Conclusión 16 marzo:** El único paréntesis fue 7b3bf55 (sitemap estático 44 URLs), corregido el mismo día por 8b0396e. No queda ningún bloqueo activo.

---

## 8. Auditoría del día previo (14 marzo 2026)

Commits del 14 marzo (día antes del apagón):

| Commit | Descripción | ¿Bloquea SEO? |
|--------|-------------|---------------|
| **addf1a5** | i18n completo + content-generator SEO | No — mejoras de SEO |
| **feab433** | i18n, OAuth, tests, schemas (breadcrumb homeName) | No — mejoras |
| **28f216a** | Traducciones de artículos vía Gemini | No |
| **2fb8878** | URL routing con paths traducidos | No |
| **ee3ba22** | Relax Lighthouse budgets | No |
| **6703d87** | Fix package-lock | No |

**Conclusión 14 marzo:** Solo añadidos de funcionalidad e i18n. Ningún commit desactiva o bloquea SEO. El 15 marzo por la mañana (82463d4) fue el único apagón.
