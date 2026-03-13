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
| `.dockerignore` | Excluye node_modules, .next, .git, .env*, legacy |

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

---

## 4. Historial de Commits

| Commit | Mensaje |
|--------|---------|
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
├── legacy/
│   └── index.html                  # Web original (preservada)
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
├── firebase.json                   # Legacy
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

## 8. Siguientes Pasos

### FASE 2 — Motor de Contenido e IA (Próxima)

1. ~~**Configurar Cloud SQL (PostgreSQL)**~~ — COMPLETADO
2. **Scraper de noticias** — Implementar recolección de RSS/web cada 2h desde Reuters, Kitco, Investing.com, BullionVault, World Gold Council. Guardar en tabla `news_sources` con deduplicación
3. **Generador de contenido con Gemini** — Conectar Gemini API para generar:
   - Resumen diario del mercado (automatizado a las 20:00 CET)
   - Análisis semanal (domingos)
   - Artículos por evento (movimientos >2% diario)
   - Contenido educativo (1x semana)
4. **Página `/noticias`** — Feed paginado con filtros por metal y categoría
5. **Páginas `/noticias/[slug]`** — Artículos individuales con SSR completo
6. **SEO técnico** — Schema markup (NewsArticle, FinancialProduct), sitemap XML dinámico, meta tags OG, Twitter Cards

### FASE 3 — Alertas Inteligentes

7. **Sistema de usuarios** — NextAuth.js con Google + magic link email
8. **Motor de alertas** — Detectar:
   - Mínimos/máximos anuales (52 semanas)
   - Mínimos/máximos históricos
   - Cambios bruscos (>3% en 4h)
   - Niveles de precio personalizados
   - Ratio oro/plata en extremos
   - Cruces de medias móviles
9. **Envío de alertas por email** — Resend (100/día gratis)
10. **Panel de usuario** — Gestionar alertas, ver historial

### FASE 4 — Herramientas de Trading

11. **Calculadora ratio oro/plata** — Gráfico histórico con zonas marcadas
12. **Indicadores técnicos** — RSI, MACD, Bollinger sobre gráficos de precio
13. **Calendario económico** — FOMC, NFP, IPC, BCE scrapeados automáticamente
14. **Conversor multi-divisa** — Precio en EUR, GBP, CHF, JPY
15. **Calculadora DCA** — Simulación de inversión periódica con gráfico de rendimiento
16. **Comparador histórico** — Oro vs Plata vs Platino a lo largo del tiempo

### Completado en Sesión 3 (13 marzo 2026 — tarde)

- [x] **Cloud SQL PostgreSQL** creado en europe-west1 (db-f1-micro)
- [x] **Base de datos `metalorix`** con 7 tablas creadas via `db:push`
- [x] **Cloud Run conectado a Cloud SQL** via Auth Proxy (Unix socket)
- [x] **Yahoo Finance** como proveedor principal (cubre XAU, XAG, XPT sin límites)
- [x] **Cloud Scheduler** configurado: scraping cada 15 min (Europe/Madrid)
- [x] **3 metales con datos reales** en producción: Oro $5,044, Plata $80.61, Platino $2,044
- [x] **HTTPS funcionando** en metalorix.com con SSL auto-provisionado
- [x] **README.md** actualizado para el proyecto Next.js
- [x] **GitHub Secrets** configurados: DB_PASSWORD, CRON_SECRET

---

## 9. Costes Estimados Mensuales

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

## 10. Comandos Útiles

```bash
# Desarrollo local
npm run dev                    # Arranca Next.js en localhost:3000
docker-compose up -d           # Arranca PostgreSQL local

# Base de datos
npm run db:push                # Aplica schema a la BD
npm run db:studio              # Abre Drizzle Studio (interfaz visual BD)
npm run db:generate            # Genera migraciones SQL

# Build y deploy
npm run build                  # Build de producción
docker build -t metalorix .    # Build imagen Docker
git push origin main           # Trigger automático de deploy a Cloud Run
```
