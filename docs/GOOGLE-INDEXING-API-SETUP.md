# Configurar Google Indexing API (GOOGLE_INDEXING_KEY)

## ¿Qué es?

La **Google Indexing API** permite notificar a Google cuando creas o actualizas páginas, para que las indexe más rápido. Sin ella, Google descubre las URLs por el sitemap y el rastreo normal, que puede tardar días o semanas.

Metalorix tiene un cron (`submit-indexing`) que cada día a las 09:00 UTC envía hasta 190 URLs prioritarias a Google. Si `GOOGLE_INDEXING_KEY` no está configurada, el cron devuelve 503 y no hace nada.

---

## Pasos para configurarla

### 1. Crear cuenta de servicio en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona el proyecto de Metalorix (o créalo si no existe)
3. **IAM y administración** → **Cuentas de servicio**
4. **Crear cuenta de servicio**
   - Nombre: `metalorix-indexing` (o similar)
   - ID: se genera automáticamente
5. **Crear y continuar**
6. En "Conceder acceso a este proyecto", añade el rol **Indexing API User**
   - Si no aparece, busca "Indexing" en el selector de roles
7. **Continuar** → **Listo**

### 2. Crear y descargar la clave JSON

1. En la lista de cuentas de servicio, haz clic en la que acabas de crear
2. Pestaña **Claves**
3. **Añadir clave** → **Crear clave nueva**
4. Tipo: **JSON**
5. **Crear** — se descargará un archivo `.json`

Guarda ese archivo en un lugar seguro. **No lo subas a GitHub ni lo compartas.**

### 3. Verificar la propiedad en Google Search Console

La Indexing API solo funciona para sitios que **tú** controlas. Debes tener el sitio verificado en [Google Search Console](https://search.google.com/search-console):

1. Añade la propiedad `https://metalorix.com` si no está
2. Verifica con el archivo HTML (ya tienes `googled1a167fc78548df7.html`)
3. Añade la cuenta de servicio como **usuario** con permiso de "Propietario" o "Usuario":
   - Search Console → Configuración (engranaje) → Usuarios y permisos
   - Añadir usuario → email de la cuenta de servicio (ej. `metalorix-indexing@tu-proyecto.iam.gserviceaccount.com`)
   - Permiso: **Propietario** o **Usuario completo**

### 4. Codificar la clave en base64

En la terminal (con el JSON descargado en tu máquina):

```bash
base64 -i ruta/al/archivo-descargado.json | tr -d '\n'
```

Copia toda la salida (es una cadena larga).

**Alternativa:** El código de Metalorix también acepta el JSON en texto plano. Puedes pegar el contenido completo del archivo JSON como valor del secreto (sin base64), pero base64 es más seguro para caracteres especiales.

### 5. Añadir el secreto en GitHub

1. Ve a tu repo: `https://github.com/estefaniajuste/metalorix`
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**
4. Nombre: `GOOGLE_INDEXING_KEY`
5. Valor: pega la cadena base64 (o el JSON completo)
6. **Add secret**

### 6. Redesplegar

El deploy ya pasa `GOOGLE_INDEXING_KEY` a Cloud Run. Solo necesitas que se ejecute un nuevo deploy:

- Opción A: Haz un push a `main` (aunque sea un commit vacío)
- Opción B: **Actions** → **Deploy to Cloud Run** → **Run workflow**

### 7. Verificar

Tras el deploy:

```bash
curl -s https://metalorix.com/api/seo/status
```

Debería devolver: `{"indexingApiConfigured":true,"indexNowConfigured":false}`

Para probar el envío manualmente, ejecuta el workflow de crons con `job=indexing` desde GitHub Actions.

---

## Límites

- Google permite **200 solicitudes/día** para la Indexing API
- Metalorix envía hasta 190 URLs/día para dejar margen
- El cron solo corre una vez al día (09:00 UTC)

---

## Seguridad

- **Nunca** subas el JSON al repositorio
- Si la clave se ha expuesto, rótala: crea una nueva en Google Cloud, actualiza el secreto en GitHub y haz redeploy
- Ver `PENDIENTES.md` para la rotación de claves
