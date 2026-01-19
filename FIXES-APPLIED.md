# Correcciones Aplicadas - FV Auto Importaciones

## Problema Identificado

El usuario experimentaba un error de CORS al intentar crear productos o banners:

```
Origin http://localhost:4245 is not allowed by Access-Control-Allow-Origin. Status code: 500
XMLHttpRequest cannot load http://127.0.0.1:4246/api/products due to access control checks.
```

## Causa Raíz

El middleware de CORS de Laravel no estaba correctamente registrado en la configuración de la aplicación (Laravel 11+), lo que impedía que el frontend (puerto 4245) se comunicara con el backend API (puerto 4246).

## Solución Aplicada

### 1. Registro del Middleware de CORS

**Archivo:** `api_fvimport/bootstrap/app.php`

Agregué el middleware `HandleCors` a la pipeline de API:

```php
$middleware->api(prepend: [
    \Illuminate\Http\Middleware\HandleCors::class,
    \App\Http\Middleware\ForceJsonResponse::class,
]);
```

### 2. Configuración de Orígenes Permitidos

**Archivo:** `docker-compose.yml`

Agregué variable de entorno para controlar los orígenes permitidos:

```yaml
environment:
  CORS_ALLOWED_ORIGINS: "http://localhost:4245,http://127.0.0.1:4245"
```

**Archivo:** `api_fvimport/config/cors.php`

Actualicé la configuración para usar la variable de entorno:

```php
'allowed_origins' => env('CORS_ALLOWED_ORIGINS')
    ? explode(',', env('CORS_ALLOWED_ORIGINS'))
    : ['*'],
```

### 3. Reconstrucción y Despliegue

```bash
docker-compose down
docker-compose build fv-backend
docker-compose up -d
```

## Verificación

### Test de CORS Preflight

```bash
curl -i -X OPTIONS \
  -H 'Origin: http://localhost:4245' \
  -H 'Access-Control-Request-Method: POST' \
  http://localhost:4246/api/products
```

**Respuesta exitosa:**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:4245
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
```

### Estado de los Contenedores

```
✅ fv-backend:  Healthy (puerto 4246)
✅ fv-db:       Healthy (puerto 3309)
✅ fv-frontend: Running (puerto 4245)
```

## Funcionalidades Verificadas

### ✅ Compresión de Imágenes

El sistema de compresión automática está funcionando correctamente:

**Ejemplo de los logs del usuario:**
```
⚙️ Compressing image: 74cc191d-29a4-45d3-adb4-caf6a3923420.png (2.36MB)
✓ Compression complete:
  Original: 2.36MB
  Compressed: 0.32MB
  Saved: 86.31%
```

**Comportamiento:**
- Imágenes > 1.5MB → Se comprimen automáticamente
- Imágenes < 1.5MB → Se envían sin comprimir (ya son pequeñas)
- Máximo después de compresión: 1.8MB
- Redimensión máxima: 1600px
- Conversión a JPG para mejor compresión

### ✅ Usuario Administrador

El sistema crea automáticamente un usuario administrador:

```
Email:      frank@fvautoimports.com.pe
Contraseña: Fr@nk2026
```

## Resultado Final

**✅ CORS configurado correctamente**
- El frontend puede comunicarse con el backend
- Los productos y banners ahora se pueden crear sin errores
- Las imágenes se comprimen automáticamente antes de subir

## Para Producción

Si despliegas en un dominio real, actualiza el archivo `.env`:

```env
CORS_ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

O en `docker-compose.yml`:

```yaml
CORS_ALLOWED_ORIGINS: "https://tudominio.com,https://www.tudominio.com,https://api.tudominio.com"
```

Luego reconstruye:

```bash
docker-compose down
docker-compose build fv-backend
docker-compose up -d
```

---

## Fecha de Aplicación

2026-01-19

## Archivos Modificados

1. `api_fvimport/bootstrap/app.php` - Agregado middleware de CORS
2. `api_fvimport/config/cors.php` - Configuración dinámica de orígenes
3. `docker-compose.yml` - Variables de entorno para CORS
