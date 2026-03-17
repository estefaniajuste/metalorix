# Analytics sin cookies

Datos que puedes obtener **sin depender de Google Analytics ni cookies**:

## 1. Suscripciones (base de datos)

Usuarios, alertas y newsletter provienen de tu propia base de datos.

**Obtener los datos:**

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://metalorix.com/api/analytics/stats
```

Respuesta JSON con:
- `users.total` — Total de suscriptores (alertas + newsletter)
- `users.byProvider` — Por proveedor (google, email)
- `users.newLast30Days` / `newLast7Days` — Nuevos suscriptores
- `alerts.total` / `active` — Alertas configuradas
- `alerts.triggersLast30Days` — Alertas disparadas

## 2. Logs del servidor (Google Cloud)

IPs, user agents y requests HTTP en Cloud Run.

**Requisitos:** `gcloud` instalado y autenticado.

```bash
# Configurar proyecto
gcloud config set project metalorix

# Ejecutar script (último día por defecto)
chmod +x scripts/fetch-cloud-logs.sh
./scripts/fetch-cloud-logs.sh 1

# Últimos 7 días
./scripts/fetch-cloud-logs.sh 7
```

O desde [Google Cloud Console](https://console.cloud.google.com/logs) → Logging → filtrar por `resource.type=cloud_run_revision`.

## 3. Core Web Vitals

Se envían a `/api/vitals` y se registran en los logs de Cloud Run.

**Ver en logs:**

```bash
gcloud logging read 'resource.type=cloud_run_revision jsonPayload.type="web-vital"' \
  --project=metalorix --limit=50 --format="table(timestamp, jsonPayload.name, jsonPayload.value, jsonPayload.path)"
```

O en Cloud Console → Logging → filtrar `jsonPayload.type="web-vital"`.
