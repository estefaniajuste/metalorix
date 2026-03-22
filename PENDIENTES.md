# Pendientes y recordatorios — Metalorix

## Seguridad: cambiar claves expuestas

Se han compartido varias claves en conversaciones. Hay que rotarlas:

1. **Clave de cuenta de servicio (Google Indexing API)**
   - Google Cloud → IAM → Cuentas de servicio → metalorix-indexing → Claves
   - Eliminar la clave actual → Crear nueva → Descargar JSON
   - Codificar en base64 y actualizar GOOGLE_INDEXING_KEY en GitHub Secrets
   - Hacer deploy para que Cloud Run use la nueva

2. **Otras claves** que se hayan compartido (revisar conversaciones)

---

## Dar de baja Google Indexing API (cuando ya no haga falta)

**Cuando:** Sitio bien indexado y con tráfico orgánico estable (2-3 meses).

**Pasos:**
1. Eliminar job submit-indexing en scheduled-crons.yml
2. Eliminar route y indexing-api.ts
3. Eliminar GOOGLE_INDEXING_KEY de GitHub y deploy
4. Quitar cuenta de servicio de Search Console
5. Opcional: eliminar cuenta de servicio en Google Cloud

---

## Otras tareas pendientes

- IndexNow: añadir INDEXNOW_KEY en GitHub Secrets (UUID recomendado) y el deploy ya lo pasa. El archivo /{key}.txt se sirve por rewrite
- Redirects: revisar cobertura para URLs antiguas si cambias rutas
- Metadata social: OpenGraph ya en páginas clave (layout, noticias, learn, productos)

---
Última actualización: marzo 2026
