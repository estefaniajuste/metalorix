# Metalorix — Registro de Desarrollo

> Documento actualizado: 13 de marzo de 2026

---

## 1. Estado Inicial (Punto de partida)

El proyecto comenzó como una **web estática de una sola página** (`index.html`, ~1388 líneas) desplegada en Firebase Hosting:

- HTML + CSS + JS todo en un único archivo
- Datos de precios **simulados** (mock) generados algorítmicamente
- Gráfico con Chart.js cargado por CDN
- Tema oscuro/claro con persistencia en localStorage
- Sin framework, sin build step, sin base de datos, sin backend
- CI/CD básico con GitHub Actions para Firebase Hosting
- Dominio `metalorix.com` configurado en Google Cloud DNS apuntando a Firebase

---

## 2. Planificación del Producto

Se diseñó un plan completo para transformar Metalorix en una **plataforma profesional de inteligencia sobre metales preciosos** en español.

### Decisiones clave tomadas

| Aspecto | Decisión |
|---------|----------|
| **Presupuesto** | 50-150 EUR/mes (cubierto con créditos de Google Cloud) |
| **Hosting** | Google Cloud Run (VPS en la nube) |
| **Timeline** | Plataforma completa, sin prisa, bien hecha |
| **Idioma** | Español (menor competencia SEO, nicho desatendido) |
| **IA** | Gemini API (incluido en créditos GCP) |
| **Precios** | Twelve Data API (800 req/día gratis) + Gold API (fallback gratuito) |

### Arquitectura definida

```
Usuario → Next.js (Cloud Run) → PostgreSQL (Cloud SQL)
                                → Twelve Data API (precios)
                                → Gold API (fallback)
Cloud Scheduler → Cron jobs → Scraping precios cada 15 min
                             → Scraping noticias cada 2h
                             → Generación contenido IA 3x/día
                             → Motor de alertas cada 15 min
```

---

## 3. Lo que se ha Construido (FASE 1 — Completada)

### 3.1 Migración a Next.js 14

Se migró toda la web de un `index.html` estático a una aplicación **Next.js 14 con App Router y TypeScript**.

**Archivos de configuración creados:**

| Archivo | Propósito |
|---------|-----------|
| `package.json` | Dependencias y scripts (dev, build, db:generate, db:push, etc.) |
| `tsconfig.json` | TypeScript strict mode, paths `@/*` → `./src/*` |
| `next.config.mjs` | Output standalone para Docker |
| `tailwind.config.ts` | Design tokens de Metalorix (colores brand, temas, animaciones) |
| `postcss.config.mjs` | Tailwind + Autoprefixer |
| `drizzle.config.ts` | Configuración de Drizzle ORM para PostgreSQL |
| `.env.local.example` | Variables de entorno necesarias |

### 3.2 Componentes React (migrados del HTML original)

**Layout (`src/components/layout/`):**

| Componente | Descripción |
|-----------|-------------|
| `Nav.tsx` | Navegación sticky con logo, enlaces, toggle de tema, menú móvil hamburguesa |
| `Footer.tsx` | Footer con copyright y enlaces |
| `Logo.tsx` | Logo SVG con degradado dorado animado |
| `ThemeProvider.tsx` | Contexto de tema dark/light con persistencia en localStorage |

**Dashboard (`src/components/dashboard/`):**

| Componente | Descripción |
|-----------|-------------|
| `Hero.tsx` | Sección hero con titular, badges de estado, CTAs |
| `Dashboard.tsx` | Panel principal: fetch de precios/historial, tarjetas de metal, gráfico, tabla |
| `MetalCard.tsx` | Tarjeta de metal con precio spot, cambio 24h, estado de selección |
| `PriceChart.tsx` | Gráfico profesional con `lightweight-charts` (TradingView) — area series, tema adaptativo |
| `DataTable.tsx` | Tabla de precios recientes con hora, precio y cambio |
| `RangeSelector.tsx` | Selector de rango temporal: 1D, 1W, 1M, 1Y |

### 3.3 Páginas de la aplicación (`src/app/`)

| Ruta | Archivo | Estado |
|------|---------|--------|
| `/` | `page.tsx` | **Funcional** — Hero + Dashboard con precios reales |
| `/precio/[metal]` | `precio/[metal]/page.tsx` | Placeholder (Fase 2) |
| `/noticias` | `noticias/page.tsx` | Placeholder (Fase 2) |
| `/noticias/[slug]` | `noticias/[slug]/page.tsx` | Placeholder (Fase 2) |
| `/alertas` | `alertas/page.tsx` | Placeholder (Fase 3) |
| `/herramientas` | `herramientas/page.tsx` | Placeholder (Fase 4) |
| `layout.tsx` | Layout raíz con Inter font, metadata, ThemeProvider, Nav, Footer |

### 3.4 API Routes (`src/app/api/`)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/prices` | GET | Precios spot actuales — cascada: BD → Gold API → Twelve Data → mock |
| `/api/prices/history` | GET | Historial de precios — params: `symbol`, `range` (1D/1W/1M/1Y) |
| `/api/cron/scrape-prices` | POST | Cron job para scraping de precios y almacenamiento en BD (protegido con `CRON_SECRET`) |

### 3.5 Proveedores de datos (`src/lib/providers/`)

| Proveedor | Archivo | Descripción |
|-----------|---------|-------------|
| Gold API | `gold-api.ts` | Cliente para Gold API (gratis, sin API key) — solo precios spot |
| Twelve Data | `twelve-data.ts` | Cliente para Twelve Data (con API key) — precios spot + series temporales |
| Mock | `metals.ts` | Proveedor mock con datos simulados realistas como fallback |

### 3.6 Base de datos (Drizzle ORM + PostgreSQL)

**Schema definido en `src/lib/db/schema.ts` — 7 tablas:**

| Tabla | Propósito |
|-------|-----------|
| `metal_prices` | Último precio spot por metal (XAU, XAG, XPT) |
| `price_history` | Series temporales para gráficos |
| `articles` | Artículos generados por IA y editoriales |
| `news_sources` | Noticias scrapeadas de fuentes externas |
| `users` | Usuarios registrados (email, nombre, tier) |
| `alerts` | Alertas de precio configuradas por usuarios |
| `alert_history` | Historial de alertas disparadas |

**Conexión:** `src/lib/db/index.ts` — cliente Drizzle que devuelve `null` si `DATABASE_URL` no está configurada (graceful fallback a mock).

### 3.7 Estilos (`src/styles/globals.css`)

- Tailwind base con capas personalizadas
- Variables CSS para temas dark/light
- Scrollbar personalizado
- Ajustes responsive

### 3.8 Docker y desarrollo local

| Archivo | Propósito |
|---------|-----------|
| `Dockerfile` | Build multi-stage (deps → build → production) con Node 20 Alpine, standalone Next.js, puerto 8080 |
| `docker-compose.yml` | PostgreSQL 16 Alpine en puerto 5432 para desarrollo local |
| `.dockerignore` | Excluye node_modules, .next, .git, .env* |

### 3.9 CI/CD y Despliegue

| Componente | Detalle |
|-----------|---------|
| **GitHub Actions** | `.github/workflows/deploy-cloud-run.yml` — deploy automático al hacer push a `main` |
| **Región** | `europe-west1` (Bélgica) — soporta domain mapping |
| **Artifact Registry** | `europe-west1-docker.pkg.dev` — almacena imágenes Docker |
| **Cloud Run** | Servicio `metalorix` — 512Mi RAM, 1 CPU, 0-3 instancias, escala a 0 |
| **Trigger** | Push a `main` + `workflow_dispatch` (manual) |

### 3.10 Migración de dominio

Se migró `metalorix.com` de Firebase Hosting a Cloud Run:

1. Creado Artifact Registry en `europe-west1`
2. Desplegado servicio en Cloud Run (`europe-west1`)
3. Creado domain mapping para `metalorix.com`
4. Actualizados registros DNS en Google Cloud DNS:
   - Registro A: `metalorix.com` → IPs de Google (`216.239.32/34/36/38.21`)
   - CNAME: `www.metalorix.com` → `ghs.googlehosted.com`
5. Certificado SSL auto-provisionado por Google
6. Eliminado `firebase.json` del repo — Firebase Hosting ya no se usa. La única URL de producción es `metalorix.com` (Cloud Run). Se debe deshabilitar Firebase Hosting desde la consola de Firebase para que `metalorix.web.app` y `metalorix.firebaseapp.com` dejen de servir contenido

---

## 4. Historial de Commits

| Commit | Mensaje |
|--------|---------|
| `3b9a109` | Fix next-intl build, merge configs, and fix all E2E tests |
| `4fc4b59` | Add real logo/favicon, investment guide, ETF table and Google Analytics |
| `84f82da` | Add Playwright E2E tests with CI integration |
| `0aebd34` | Add multi-language support (ES/EN/PT) with next-intl |
| `f572ee2` | Add rate limiting, cache headers, and structured error tracking |
| `16bcd08` | Add user panel with magic link authentication |
| `fd8ba0f` | Add RSI, MACD, and Bollinger Bands technical indicators |
| `04dbd43` | Add Web Vitals monitoring, CI test gate, and security headers |
| `71500ba` | Extend charts with long-term historical data (3M to 5Y) |
| `0b7b73f` | Add component tests: Sparkline, ShareButton, CookieConsent, ScrollToTop |
| `f50c09a` | Add economic calendar for precious metals traders |
| `c8b4f89` | Add historical metals comparator with interactive chart |
| `5242cf3` | Add legal pages: aviso legal and terms of service |
| `b47ee62` | Add Firebase Hosting config and GitHub Actions CI/CD for auto-deploy |
| `4440f5f` | Migrate to Next.js 14 with real-time precious metals data |
| `9503c7e` | Add workflow_dispatch trigger for manual deployments |
| `25b8139` | Move Cloud Run to europe-west1 for custom domain support |

---

## 5. Tech Stack Actual

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript 5.5 |
| **UI** | React 18 |
| **Estilos** | Tailwind CSS 3.4 |
| **Gráficos** | TradingView Lightweight Charts 4.2 |
| **ORM** | Drizzle ORM |
| **Base de datos** | PostgreSQL 16 |
| **Deploy** | Google Cloud Run (Docker) |
| **CI/CD** | GitHub Actions |
| **Región** | europe-west1 (Bélgica) |

---

## 6. Variables de Entorno Necesarias

```env
DATABASE_URL=postgresql://user:pass@host:5432/metalorix
TWELVE_DATA_API_KEY=tu_api_key
CRON_SECRET=secreto_para_proteger_cron_jobs
GEMINI_API_KEY=tu_gemini_key        # Para Fase 2
RESEND_API_KEY=tu_resend_key        # Para Fase 3
```

---

## 7. Estructura Actual del Proyecto

```
metalorix/
├── .github/workflows/
│   └── deploy-cloud-run.yml        # CI/CD → Cloud Run
├── assets/
│   └── favicon.svg
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz
│   │   ├── page.tsx                # Home (Hero + Dashboard)
│   │   ├── alertas/page.tsx        # Placeholder
│   │   ├── herramientas/page.tsx   # Placeholder
│   │   ├── noticias/
│   │   │   ├── page.tsx            # Placeholder
│   │   │   └── [slug]/page.tsx     # Placeholder
│   │   ├── precio/
│   │   │   └── [metal]/page.tsx    # Placeholder
│   │   └── api/
│   │       ├── prices/
│   │       │   ├── route.ts        # GET precios spot
│   │       │   └── history/
│   │       │       └── route.ts    # GET historial
│   │       └── cron/
│   │           └── scrape-prices/
│   │               └── route.ts    # POST scraping cron
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── MetalCard.tsx
│   │   │   ├── PriceChart.tsx
│   │   │   └── RangeSelector.tsx
│   │   └── layout/
│   │       ├── Footer.tsx
│   │       ├── Logo.tsx
│   │       ├── Nav.tsx
│   │       └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts            # Cliente Drizzle
│   │   │   └── schema.ts           # 7 tablas definidas
│   │   └── providers/
│   │       ├── gold-api.ts         # Gold API (gratis)
│   │       ├── metals.ts           # Mock provider + tipos
│   │       └── twelve-data.ts      # Twelve Data API
│   └── styles/
│       └── globals.css
├── .dockerignore
├── .env.local.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── drizzle.config.ts
├── next.config.mjs
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── DEVELOPMENT.md                  # Este documento
```

---

## 8. Estado de las Fases

### FASE 2 — Motor de Contenido e IA — COMPLETADA

1. ~~**Configurar Cloud SQL (PostgreSQL)**~~ — COMPLETADO
2. ~~**Scraper de noticias**~~ — COMPLETADO (`src/lib/scraper/rss.ts`) — 5 feeds: Reuters, Kitco, Investing.com, BullionVault, World Gold Council. Detección automática de metales y sentimiento. API: `POST /api/cron/scrape-news`
3. ~~**Generador de contenido con Gemini**~~ — COMPLETADO (`src/lib/ai/content-generator.ts` + `src/lib/ai/gemini.ts`) — Resumen diario, análisis semanal, artículos por evento (>2% movimiento). API: `POST /api/cron/generate-content?type=daily|weekly|event|auto`
4. ~~**Página `/noticias`**~~ — COMPLETADO — Feed con artículos de BD, tipos de contenido, fuentes
5. ~~**Páginas `/noticias/[slug]`**~~ — COMPLETADO — SSR completo con JSON-LD NewsArticle, breadcrumbs, metadata OG
6. ~~**SEO técnico**~~ — COMPLETADO — `sitemap.ts` (17+ rutas estáticas + artículos dinámicos), `robots.ts`, OG images para home/herramientas/precios, JSON-LD Organization + WebSite en homepage

### FASE 3 — Alertas Inteligentes — COMPLETADA

7. ~~**Sistema de usuarios**~~ — COMPLETADO — Magic link email (`src/lib/auth/magic-link.ts`), rutas API: login, verify, logout, me
8. ~~**Motor de alertas**~~ — COMPLETADO (`src/lib/alerts/engine.ts`) — Alertas personalizadas (price_above, price_below) + alertas inteligentes automáticas (movimientos >2%), cooldown de 4h, rate limiting
9. ~~**Envío de alertas por email**~~ — COMPLETADO — Resend (`src/lib/email/resend.ts`), templates HTML profesionales para alertas de precio, alertas inteligentes, bienvenida y newsletter semanal
10. ~~**Panel de usuario**~~ — COMPLETADO (`src/app/panel/page.tsx`) — Gestión de alertas activas

### FASE 4 — Herramientas de Trading — COMPLETADA

11. ~~**Ratio oro/plata**~~ — COMPLETADO (`/ratio-oro-plata`) — Página dedicada con contenido y gráfico
12. ~~**Indicadores técnicos**~~ — COMPLETADO (`TechnicalIndicators.tsx`) — RSI, MACD, Bollinger Bands
13. ~~**Calendario económico**~~ — COMPLETADO (`/calendario-economico`) — Eventos FOMC, NFP, IPC, BCE
14. ~~**Conversor multi-divisa**~~ — COMPLETADO (`/conversor-divisas`) — EUR, GBP, CHF, JPY
15. ~~**Calculadora DCA**~~ — COMPLETADO — Simulación de inversión periódica con rendimiento
16. ~~**Comparador histórico**~~ — COMPLETADO (`/comparador`) — Oro vs Plata vs Platino

### Funcionalidades Adicionales (no planificadas originalmente)

- [x] **Multi-idioma** — ES/EN/PT con `next-intl` (selector de idioma en nav)
- [x] **Catálogo de productos** — Krugerrands, Maple Leafs, Eagles, Filarmónicas, lingotes (`/productos`)
- [x] **Guía de inversión** — Métodos de inversión, tabla ETFs, FAQ (`/guia-inversion`)
- [x] **Glosario** — Términos del sector metales preciosos (`/glosario`)
- [x] **Precio del gramo** — Página SEO para "precio gramo oro" (`/precio-gramo-oro`)
- [x] **Precio oro hoy** — Página SEO para "precio oro hoy" (`/precio-oro-hoy`)
- [x] **Rate limiting** — Protección en endpoints API
- [x] **Error tracking** — Reporte estructurado de errores cliente (`/api/errors`)
- [x] **Web Vitals** — Monitorización LCP, FID, CLS (`/api/vitals`)
- [x] **Cookie consent** — Banner RGPD
- [x] **Scroll to top** — Botón de vuelta arriba
- [x] **Google Analytics** — GA4 integrado
- [x] **Newsletter semanal** — Generada con IA y enviada a suscriptores
- [x] **Tests unitarios** — 56 tests Jest (componentes, API, providers)
- [x] **Tests E2E** — 29 tests Playwright (páginas, API, SEO, accesibilidad)
- [x] **CI/CD con tests** — GitHub Actions: Jest + Playwright + deploy a Cloud Run

### Completado en Sesión 3 (13 marzo 2026 — tarde)

- [x] **Cloud SQL PostgreSQL** creado en europe-west1 (db-f1-micro)
- [x] **Base de datos `metalorix`** con 7 tablas creadas via `db:push`
- [x] **Cloud Run conectado a Cloud SQL** via Auth Proxy (Unix socket)
- [x] **Yahoo Finance** como proveedor principal (cubre XAU, XAG, XPT sin límites)
- [x] **Cloud Scheduler** configurado: scraping cada 15 min (Europe/Madrid)
- [x] **3 metales con datos reales** en producción
- [x] **HTTPS funcionando** en metalorix.com con SSL auto-provisionado
- [x] **GitHub Secrets** configurados: DB_PASSWORD, CRON_SECRET

### Completado en Sesión 4 (13 marzo 2026 — noche)

- [x] **Fix build next-intl** — Fusionados `next.config.mjs` + `next.config.ts` (conflicto de prioridad Next.js 14)
- [x] **Fix imports i18n** — Cambiado import dinámico a imports estáticos por locale (webpack)
- [x] **Fix themeColor** — Movido de `metadata` a `viewport` export
- [x] **Fix Jest config** — Excluido `e2e/` de testPathIgnorePatterns
- [x] **Fix Playwright config** — Comando `dev` en vez de `start`, reuseExistingServer
- [x] **Fix E2E tests** — 3 tests corregidos (nav, robots.txt, JSON-LD)
- [x] **85 tests pasando** — 56 unitarios + 29 E2E

---

## 9. Infraestructura (Estado)

Todas las fases de código e infraestructura están operativas:

| Tarea | Estado |
|-------|--------|
| **Cron scrape-prices** (`*/15 * * * *`) | COMPLETADO — cada 15 min, code=0 |
| **Cron scrape-news** (`0 */2 * * *`) | COMPLETADO — cada 2h, code=0 |
| **Cron generate-content** (`0 20 * * *`) | COMPLETADO — diario 20:00 CET, code=0 |
| **Cron check-alerts** (`*/15 * * * *`) | COMPLETADO — cada 15 min, code=0 |
| **GEMINI_API_KEY** | COMPLETADO — configurado en Cloud Run |
| **RESEND_API_KEY** | COMPLETADO — configurado en Cloud Run |
| **TWELVE_DATA_API_KEY** | COMPLETADO — configurado en Cloud Run |
| **CRON_SECRET** | COMPLETADO — configurado en Cloud Run |
| **Dominio email** | Pendiente — verificar `metalorix.com` en Resend para enviar desde `alertas@metalorix.com` |

### Verificación de datos en producción (13 marzo 2026, 21:00 CET)

| Dato | Estado |
|------|--------|
| Precios spot (XAU, XAG, XPT) | Actualizándose desde BD cada 15 min |
| Historial de precios | 27 puntos XAU, 22 puntos XAG (crecerá con el tiempo) |
| Artículos IA (Gemini) | 1 resumen diario generado con precios reales |
| Noticias RSS scrapeadas | Funcionando (alimenta al generador de contenido) |
| metalorix.com | HTTP 200, SSL activo |

---

## 10. Costes Estimados Mensuales

| Servicio | Coste estimado |
|----------|---------------|
| Cloud Run | ~5-15 EUR/mes |
| Cloud SQL (PostgreSQL) | ~7-15 EUR/mes |
| Cloud Scheduler | Gratis (3 jobs) |
| Cloud Storage | ~1 EUR/mes |
| Gemini API | ~5-10 EUR/mes |
| Twelve Data API | Gratis (800 req/día) |
| Resend (emails) | Gratis (100/día) |
| **Total** | **~20-45 EUR/mes** (cubierto con créditos GCP) |

---

## 11. Comandos Útiles

```bash
# Desarrollo local
npm run dev                    # Arranca Next.js en localhost:3000
docker-compose up -d           # Arranca PostgreSQL local

# Base de datos
npm run db:push                # Aplica schema a la BD
npm run db:studio              # Abre Drizzle Studio (interfaz visual BD)
npm run db:generate            # Genera migraciones SQL

# Tests
npm test                       # Tests unitarios (Jest, 56 tests)
npm run test:e2e               # Tests E2E (Playwright, 29 tests)
npm run test:e2e:ui            # Tests E2E con interfaz visual

# Build y deploy
npm run build                  # Build de producción
docker build -t metalorix .    # Build imagen Docker
git push origin main           # Trigger automático de deploy a Cloud Run
```
