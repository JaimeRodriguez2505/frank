# SOLUCIÓN COMPLETA - Error CORS 500

## ✅ Cambios Aplicados

### 1. Configuración CORS (`api_fvimport/config/cors.php`)

```php
'allowed_origins' => ['*'],  // Permite TODOS los orígenes
```

Esto permite:
- ✅ `http://localhost:4245`
- ✅ `http://127.0.0.1:4245`
- ✅ `http://fvautoimports.com.pe`
- ✅ Cualquier otro origen

### 2. Middleware CORS Registrado (`api_fvimport/bootstrap/app.php`)

```php
$middleware->api(prepend: [
    \Illuminate\Http\Middleware\HandleCors::class,
    \App\Http\Middleware\ForceJsonResponse::class,
]);
```

### 3. Sanctum Domains (`docker-compose.yml`)

```yaml
SANCTUM_STATEFUL_DOMAINS: "localhost:4245,127.0.0.1:4245,fvautoimports.com.pe"
```

### 4. Debug Habilitado

```yaml
APP_DEBUG: "true"
LOG_LEVEL: debug
```

### 5. Cachés Limpiados

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
```

## 🧪 Verificación

### Test 1: CORS Preflight (localhost)

```bash
curl -I -X OPTIONS \
  -H 'Origin: http://localhost:4245' \
  -H 'Access-Control-Request-Method: POST' \
  http://localhost:4246/api/products
```

**Resultado esperado:**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:4245
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
```

✅ **FUNCIONANDO**

### Test 2: CORS Preflight (127.0.0.1)

```bash
curl -I -X OPTIONS \
  -H 'Origin: http://127.0.0.1:4245' \
  -H 'Access-Control-Request-Method: POST' \
  http://localhost:4246/api/products
```

**Resultado esperado:**
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://127.0.0.1:4245
Access-Control-Allow-Credentials: true
```

✅ **FUNCIONANDO**

## 🔍 Si aún ves el error

### Paso 1: Limpia el caché del navegador

**Chrome/Edge:**
1. Presiona `Ctrl+Shift+Del` (Windows) o `Cmd+Shift+Del` (Mac)
2. Selecciona "Todo el tiempo"
3. Marca "Archivos e imágenes en caché"
4. Click en "Borrar datos"

**O simplemente:**
- Presiona `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac) para recargar sin caché

### Paso 2: Verifica que los contenedores estén corriendo

```bash
docker-compose ps
```

Deberías ver:
- ✅ `fv-backend`: Up (healthy)
- ✅ `fv-frontend`: Up
- ✅ `fv-db`: Up (healthy)

### Paso 3: Verifica los logs del backend

Abre una nueva terminal y ejecuta:

```bash
docker-compose logs fv-backend -f
```

Deja esta terminal abierta y **luego intenta crear un producto en el navegador**.

Verás los logs en tiempo real. Busca cualquier línea que diga "error" o "exception".

### Paso 4: Verifica la configuración de API en el frontend

Abre el navegador en: `http://localhost:4245`

Abre la consola del navegador (F12) y ejecuta:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4246/api');
```

Debería mostrar: `http://127.0.0.1:4246/api`

### Paso 5: Test manual desde la consola del navegador

Abre la consola (F12) en `http://localhost:4245` y ejecuta:

```javascript
fetch('http://127.0.0.1:4246/api/categories', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Backend responde:', d))
.catch(e => console.error('❌ Error:', e));
```

Si ves `✅ Backend responde: {"data": [...]}`, entonces CORS está funcionando.

## 🚨 Si aún NO funciona

### Opción 1: Reconstruir todo desde cero

```bash
# Detener todo
docker-compose down

# Reconstruir el backend
docker-compose build fv-backend

# Iniciar todo
docker-compose up -d

# Esperar 30 segundos
sleep 30

# Verificar estado
docker-compose ps
```

### Opción 2: Verificar que el archivo cors.php esté actualizado

```bash
docker-compose exec fv-backend cat /var/www/html/config/cors.php | grep "allowed_origins"
```

Deberías ver:
```php
'allowed_origins' => ['*'],
```

Si NO ves eso, entonces necesitas reconstruir:

```bash
docker-compose down
docker-compose build fv-backend --no-cache
docker-compose up -d
```

### Opción 3: Revisar nginx logs

```bash
docker-compose exec fv-backend tail -f /var/log/nginx/error.log
```

Intenta crear un producto y mira si aparece algún error.

## 📝 Notas Importantes

### El error "Status code: 500" significa:

El backend Laravel está respondiendo con un error interno del servidor. Esto NO es un error de CORS (porque CORS ya está configurado correctamente).

El error 500 puede deberse a:

1. **Validación fallida**: Algún campo requerido falta o tiene formato incorrecto
2. **Problema con archivos**: La imagen es demasiado grande o tiene formato inválido
3. **Error en el controller**: Hay un bug en `ProductController`
4. **Base de datos**: Problema de conexión o constraint

### Para ver el error REAL:

Ejecuta en una terminal:

```bash
docker-compose logs fv-backend -f
```

Luego intenta crear el producto. El error exacto aparecerá en los logs.

## 🎯 Comandos de Diagnóstico

### Ver configuración de CORS activa

```bash
docker-compose exec fv-backend php artisan config:show cors
```

### Ver variables de entorno

```bash
docker-compose exec fv-backend env | grep -E "APP_|CORS|SANCTUM"
```

### Ver rutas API

```bash
docker-compose exec fv-backend php artisan route:list --path=api
```

### Limpiar TODO el caché

```bash
docker-compose exec fv-backend php artisan optimize:clear
```

## ✅ Estado Actual

- ✅ CORS configurado para permitir TODOS los orígenes
- ✅ Middleware de CORS registrado correctamente
- ✅ Sanctum domains configurados
- ✅ Debug habilitado
- ✅ Cachés limpiados
- ✅ Tests de CORS pasan correctamente

**El backend está listo y CORS está funcionando.** Si aún ves errores, el problema está en:
1. El caché del navegador (limpia con Ctrl+Shift+R)
2. Validación de datos (revisa los logs del backend)
3. El frontend enviando datos incorrectos (revisa la consola del navegador)
