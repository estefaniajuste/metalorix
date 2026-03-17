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
- **Pendiente:** Configurar `GOOGLE_INDEXING_KEY` para que el cron de indexación funcione.
