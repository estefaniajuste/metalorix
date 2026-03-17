#!/bin/bash
# Obtener logs de Cloud Run (requests, IPs, user agents)
# Requiere: gcloud configurado y proyecto seleccionado
# Uso: ./scripts/fetch-cloud-logs.sh [días]

DAYS=${1:-1}
PROJECT=${GCP_PROJECT_ID:-metalorix}
SERVICE="metalorix"

echo "=== Logs de Cloud Run (últimos $DAYS días) ==="
echo "Proyecto: $PROJECT"
echo ""

# Requests HTTP (status, path, IP aproximada)
gcloud logging read "
  resource.type=cloud_run_revision
  resource.labels.service_name=\"$SERVICE\"
  httpRequest.requestUrl!=\"\"
  timestamp>=\"$(date -u -v-${DAYS}d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -d \"$DAYS days ago\" +%Y-%m-%dT%H:%M:%SZ)\"
" \
  --project="$PROJECT" \
  --format="table(timestamp, httpRequest.status, httpRequest.requestUrl, httpRequest.remoteIp, httpRequest.userAgent)" \
  --limit=100 \
  2>/dev/null || echo "Ejecuta: gcloud auth login && gcloud config set project $PROJECT"

echo ""
echo "=== Web Vitals (si existen) ==="
gcloud logging read "
  resource.type=cloud_run_revision
  resource.labels.service_name=\"$SERVICE\"
  jsonPayload.type=\"web-vital\"
  timestamp>=\"$(date -u -v-${DAYS}d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -d \"$DAYS days ago\" +%Y-%m-%dT%H:%M:%SZ)\"
" \
  --project="$PROJECT" \
  --format="table(timestamp, jsonPayload.name, jsonPayload.value, jsonPayload.rating, jsonPayload.path)" \
  --limit=50 \
  2>/dev/null || true
