# Claves y seguridad — Metalorix

> **Cuando algo falla:** ver `CLAVES-Y-FALLOS.md` — checklist rápido de qué revisar.

## ¿Es urgente rotar?

**No.** Si no ves indicios de abuso (emails raros, cuotas agotadas, crons disparándose solos), puedes esperar y rotar cuando te venga bien.

| Clave | Urgencia | Motivo |
|-------|----------|--------|
| GOOGLE_INDEXING_KEY | Baja | La única que sabemos compartida. Riesgo limitado: alguien podría consumir cuota de la Indexing API, pero no hay acceso a datos sensibles |
| CRON_SECRET | Baja | Solo urgente si alguien está llamando a tus crons (verías alertas o generación de contenido extraña) |
| GEMINI, RESEND, DB, GCP | Baja | Solo si tienes indicios de que se compartieron o de abuso |

**Cuándo SÍ sería urgente:** emails enviados que no reconoces, cuota de Gemini/Resend agotada sin motivo, cambios raros en la base de datos o en Cloud Run.

**Recomendación:** Rotar GOOGLE_INDEXING_KEY cuando puedas (es la que sabemos compartida), pero no es urgente. El resto, solo si sospechas que se filtraron o ves abuso.

---

## Claves que DEBES rotar si se han compartido

Según `PENDIENTES.md`, estas claves pueden estar expuestas:

### 1. GOOGLE_INDEXING_KEY (prioridad alta)
- **Qué es:** JSON de cuenta de servicio para la Google Indexing API
- **Riesgo:** Si se compartió en conversaciones, alguien podría usarla para enviar URLs a Google
- **Rotar:** Google Cloud → IAM → Cuentas de servicio → metalorix-indexing → Claves → Crear nueva → Eliminar antigua
- **Actualizar:** Codificar el nuevo JSON en base64 y actualizar el secreto en GitHub → Settings → Secrets → GOOGLE_INDEXING_KEY
- **Deploy:** Hacer push a main para que Cloud Run reciba la nueva clave

### 2. CRON_SECRET (prioridad alta)
- **Qué es:** Token para autenticar los cron jobs (scrape-prices, generate-content, etc.)
- **Riesgo:** Si está expuesto, cualquiera podría llamar a tus endpoints de cron
- **Rotar:** Generar uno nuevo: `openssl rand -hex 32`
- **Actualizar:** GitHub → Secrets → CRON_SECRET
- **Deploy:** Push a main

### 3. GEMINI_API_KEY (prioridad alta)
- **Qué es:** Clave de la API de Google Gemini para generar contenido
- **Riesgo:** Uso no autorizado, consumo de cuota
- **Rotar:** Google AI Studio → API Keys → Create new → Revoke old
- **Actualizar:** GitHub Secrets + Cloud Run env vars

### 4. RESEND_API_KEY (prioridad alta)
- **Qué es:** Clave de Resend para enviar emails (alertas, magic link, newsletter)
- **Riesgo:** Envío de emails en tu nombre
- **Rotar:** Resend Dashboard → API Keys → Create → Revoke old
- **Actualizar:** GitHub Secrets

### 5. DB_PASSWORD, GCP_SA_KEY, etc.
- Si alguna se compartió, rotarla en su servicio correspondiente y actualizar GitHub Secrets

---

## Claves opcionales (no bloquean, pero pueden ralentizar)

### TWELVE_DATA_API_KEY
- **Función:** Fallback para precios (histórico, time series). Sin ella se usa Yahoo/Gold API
- **¿Ralentiza?** No crítico. El scrape de precios tiene cadena de fallback. Twelve Data da más cobertura (cobre, paladio) y datos históricos
- **Configurar:** https://twelvedata.com/account/api-keys (tier gratuito: 800 req/día)
- **Dónde:** GitHub Secrets, deploy ya lo pasa a Cloud Run

### INDEXNOW_KEY
- **Función:** Acelera indexación en Bing (IndexNow)
- **¿Ralentiza?** No. Solo afecta a Bing. Google usa sitemap + Indexing API
- **Estado actual:** Ya se pasa en el deploy. Añade el secreto en GitHub → Secrets → INDEXNOW_KEY (por ejemplo un UUID) y el archivo `/{key}.txt` se sirve automáticamente vía rewrite
- **Opcional:** Solo si quieres priorizar Bing

---

## Claves "públicas por diseño" (no son secretos)

### G-9K1MTS78FF (Google Analytics)
- **Dónde:** `AnalyticsLoader.tsx` — hardcodeado
- **Riesgo:** Bajo. El Measurement ID de GA está pensado para ir en el cliente. Cualquiera puede verlo en el HTML/JS
- **Opcional:** Mover a `NEXT_PUBLIC_GA_ID` en env si prefieres no tenerlo en código, pero no es un secreto

### GOOGLE_CLIENT_ID
- **Función:** OAuth "Continuar con Google"
- **Público:** Sí, va en el cliente. El Client Secret SÍ es secreto y nunca debe exponerse

---

## Checklist de rotación

1. [ ] GOOGLE_INDEXING_KEY — si se compartió
2. [ ] CRON_SECRET — si se compartió o cambiaste y no actualizaste
3. [ ] GEMINI_API_KEY — si se compartió
4. [ ] RESEND_API_KEY — si se compartió
5. [ ] DB_PASSWORD — si se compartió
6. [ ] GCP_SA_KEY — si se compartió (cuenta de servicio para deploy)

Tras rotar cada una: actualizar en GitHub Secrets y hacer deploy (push a main).
