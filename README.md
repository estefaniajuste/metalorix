# Metalorix

Plataforma de seguimiento de metales preciosos en tiempo real — Oro (XAU), Plata (XAG) y Platino (XPT).

Precios spot actualizados, gráficos interactivos con TradingView, herramientas de análisis y contenido educativo. Todo en español.

**[metalorix.com](https://metalorix.com)**

## Funcionalidades

### Precios en tiempo real
- Dashboard con precios spot de oro, plata y platino
- Mini sparklines de tendencia en cada tarjeta
- Gráficos históricos interactivos (1D, 1W, 1M, 1Y) con TradingView Lightweight Charts
- Tabla de datos con máximos, mínimos y variación del periodo
- Fallback multicapa: Base de datos → Gold API → Twelve Data → Mock

### Páginas dedicadas por metal
- `/precio/oro` — Precio del oro hoy con gráfico, estadísticas y datos clave
- `/precio/plata` — Precio de la plata hoy
- `/precio/platino` — Precio del platino hoy
- Contenido educativo específico por metal
- Schema markup JSON-LD (FinancialProduct + BreadcrumbList)

### Herramientas
- **Ratio Oro/Plata** — Cálculo en tiempo real con barra visual, zonas de interpretación y referencias históricas
- **Conversor de unidades** — Onzas troy ↔ Gramos ↔ Kilogramos con precio en tiempo real
- **Comparador histórico** — Gráfico multi-metal normalizado para comparar rendimiento
- **Conversor multi-divisa** — Precios en USD, EUR, GBP, CHF, JPY

### SEO
- Sitemap XML dinámico (`/sitemap.xml`)
- robots.txt (`/robots.txt`)
- JSON-LD: Organization, WebSite (con SearchAction), FinancialProduct, BreadcrumbList
- Meta tags OpenGraph y Twitter Cards
- URLs canónicas en todas las páginas
- Keywords optimizadas para SEO en español

### PWA
- manifest.json para instalación en móvil
- Iconos 192x192 y 512x512
- Tema de color dorado (#D6B35A)

### UX/Accesibilidad
- Modo oscuro/claro con detección de preferencia del sistema
- Skip-to-content link para navegación por teclado
- Botón scroll-to-top
- Navegación con dropdown de metales
- Diseño responsive completo

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript 5.5 |
| **UI** | React 18 |
| **Estilos** | Tailwind CSS 3.4 |
| **Gráficos** | TradingView Lightweight Charts 4.2 |
| **ORM** | Drizzle ORM |
| **Base de datos** | PostgreSQL 16 (Cloud SQL) |
| **Deploy** | Google Cloud Run (Docker) |
| **CI/CD** | GitHub Actions |
| **Región** | europe-west1 (Bélgica) |
| **Dominio** | metalorix.com (Google Cloud DNS) |

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Levantar PostgreSQL local
docker-compose up -d

# Aplicar schema a la BD
npm run db:push

# Arrancar servidor de desarrollo
npm run dev
```

La app estará en [http://localhost:3000](http://localhost:3000).

Sin base de datos la app funciona igualmente: usa Gold API / Twelve Data como fuente de precios y mock data como último fallback.

## Variables de entorno

Copia `.env.local.example` a `.env.local` y configura:

```env
DATABASE_URL=postgresql://metalorix:metalorix@localhost:5432/metalorix
TWELVE_DATA_API_KEY=tu_api_key
CRON_SECRET=tu_secreto
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:push` | Aplicar schema a la BD |
| `npm run db:studio` | Interfaz visual de la BD (Drizzle Studio) |
| `npm run db:generate` | Generar migraciones SQL |

## Base de datos

7 tablas definidas con Drizzle ORM:

| Tabla | Propósito |
|-------|-----------|
| `metal_prices` | Último precio spot por metal |
| `price_history` | Series temporales para gráficos |
| `articles` | Artículos generados con IA |
| `news_sources` | Noticias scrapeadas de fuentes externas |
| `users` | Usuarios registrados |
| `alerts` | Alertas de precio configuradas |
| `alert_history` | Historial de alertas disparadas |

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz (Inter, metadata, PWA, a11y)
│   ├── page.tsx                # Home (Hero + Dashboard + JSON-LD)
│   ├── not-found.tsx           # 404 personalizada
│   ├── sitemap.ts              # Sitemap XML dinámico
│   ├── robots.ts               # robots.txt
│   ├── precio/[metal]/         # Páginas dedicadas por metal (SSG)
│   ├── herramientas/           # Herramientas de análisis
│   ├── noticias/               # Noticias (próximamente)
│   ├── alertas/                # Alertas (próximamente)
│   └── api/
│       ├── prices/             # GET precios spot
│       ├── prices/history/     # GET historial
│       ├── exchange-rates/     # GET tipos de cambio
│       └── cron/scrape-prices/ # POST cron de scraping
├── components/
│   ├── dashboard/              # Hero, Dashboard, MetalCard, PriceChart, Sparkline...
│   ├── layout/                 # Nav, Footer, Logo, ThemeProvider, ScrollToTop
│   └── tools/                  # GoldSilverRatio, UnitConverter, MetalComparison, CurrencyConverter
├── lib/
│   ├── db/                     # Drizzle ORM (schema + conexión)
│   ├── providers/              # Gold API, Twelve Data, Mock
│   └── seo/                    # Contenido SEO por metal
└── styles/
    └── globals.css             # Tailwind + temas dark/light
```

## Deploy

El deploy es automático al hacer push a `main`. GitHub Actions construye la imagen Docker, la sube a Artifact Registry y la despliega en Cloud Run (europe-west1).

El servicio en Cloud Run se conecta a Cloud SQL (PostgreSQL) via Unix socket.

## Licencia

MIT
