# Metalorix

Plataforma de inteligencia sobre metales preciosos — Oro (XAU), Plata (XAG) y Platino (XPT).

Precios en tiempo real, gráficos interactivos, alertas inteligentes y noticias generadas por IA. Todo en español.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: React 18 + Tailwind CSS
- **Gráficos**: TradingView Lightweight Charts
- **Base de datos**: PostgreSQL (Drizzle ORM)
- **Deploy**: Google Cloud Run (Docker)
- **CI/CD**: GitHub Actions

## Desarrollo Local

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

## Variables de Entorno

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
| `npm run db:studio` | Interfaz visual de la BD |
| `npm run db:generate` | Generar migraciones SQL |

## Deploy

El deploy es automático al hacer push a `main`. GitHub Actions construye la imagen Docker y la despliega en Google Cloud Run (europe-west1).

## Licencia

MIT
