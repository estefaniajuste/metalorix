# Claves y fallos — Guía rápida Metalorix

Referencia para saber qué clave hace qué, dónde actualizarla y qué revisar cuando algo falla.

---

## Tabla rápida de claves

| Clave | ¿Qué hace? | ¿Qué falla si está mal? | ¿Dónde actualizar? |
|-------|------------|-------------------------|--------------------|
| **CRON_SECRET** | Autentica los crons (precios, noticias, artículos, alertas) | Todo: precios no se actualizan, no hay artículos nuevos, no hay alertas | Solo GitHub Secrets → luego push a main |
| **GEMINI_API_KEY** | Genera artículos y glosario con IA | No se generan artículos ni términos del glosario | GitHub Secrets (el deploy lo pasa a Cloud Run) |
| **RESEND_API_KEY** | Envía emails (magic link, alertas, newsletter) | No llegan emails de login ni alertas | GitHub Secrets |
| **DB_PASSWORD** | Conexión a la base de datos | La web no carga, todo falla | GitHub Secrets + Cloud SQL |
| **GOOGLE_INDEXING_KEY** | Pide a Google que indexe URLs rápido | Google sigue indexando por sitemap, pero más lento | GitHub Secrets (base64 del JSON) |
| **GCP_SA_KEY** | Deploy a Cloud Run | No puedes hacer deploy | GitHub Secrets |
| **GOOGLE_CLIENT_ID / SECRET** | Login con Google | No funciona "Continuar con Google" | GitHub Secrets |
| **TWELVE_DATA_API_KEY** | Fallback para precios (opcional) | Usa Yahoo/Gold API en su lugar | GitHub Secrets |
| **G-9K1MTS78FF** | Google Analytics (estadísticas) | No se registran visitas en GA | No es secreto, va en código |

---

## Cuando algo falla — Checklist

### 1. ¿No hay artículos nuevos por la mañana?
- **Causa probable:** CRON_SECRET desincronizado o GEMINI_API_KEY mal
- **Revisar:** GitHub Actions → Scheduled Cron Jobs → ver si el último run falló
- **Si falla con 401:** CRON_SECRET. Actualizar en GitHub Secrets y hacer push a main
- **Si falla con 503:** GEMINI_API_KEY o cuota de Gemini agotada

### 2. ¿Los precios no se actualizan?
- **Causa probable:** CRON_SECRET desincronizado
- **Revisar:** Igual que arriba — crons fallando con 401

### 3. ¿No llegan emails (login, alertas)?
- **Causa probable:** RESEND_API_KEY mal o cuota agotada
- **Revisar:** Resend Dashboard → ver logs y uso

### 4. ¿La web no carga / error 500?
- **Causa probable:** DB_PASSWORD o base de datos caída
- **Revisar:** Cloud Run logs, Cloud SQL estado

### 5. ¿Los crons fallan con 401?
- **Causa:** CRON_SECRET distinto en GitHub vs Cloud Run
- **Solución:** 
  1. Generar nuevo: `openssl rand -hex 32`
  2. GitHub → Settings → Secrets → CRON_SECRET → pegar (sin espacios ni saltos de línea)
  3. Push a main para que el deploy actualice Cloud Run

---

## Regla de oro al rotar claves

**Si cambias una clave en GitHub Secrets y esa clave se pasa a Cloud Run en el deploy:**

→ **Tienes que hacer push a main** para que el deploy actualice Cloud Run.

Claves que van a Cloud Run (necesitan deploy tras rotar):
- CRON_SECRET
- GEMINI_API_KEY
- RESEND_API_KEY
- DB_PASSWORD
- GOOGLE_INDEXING_KEY
- GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
- TWELVE_DATA_API_KEY

---

## Cómo saber si los crons funcionan

1. **GitHub** → **Actions** → **Scheduled Cron Jobs**
2. El último run debería estar en verde (success)
3. Si está en rojo (failure), haz clic y mira el log — dirá si es 401, 503, etc.

**Tip:** Activa notificaciones de GitHub para que te avise por email cuando un workflow falle:
- GitHub → Settings → Notifications → marca "Actions"

---

## Más detalles

Para rotación de claves y seguridad: ver `CLAVES-SEGURIDAD.md`
