# Test de Subida de Imágenes

## Comportamiento Esperado

### 1. Compresión Automática

El sistema comprime automáticamente imágenes **mayores a 1.5MB** antes de subirlas:

**Archivos que SE comprimen:**
- Imágenes > 1.5MB
- Se comprimen a máximo 1.8MB
- Se redimensionan a máximo 1600px
- Se convierten a JPG (mejor compresión)

**Archivos que NO se comprimen:**
- Imágenes < 1.5MB (ya son pequeñas)
- Se suben tal cual

### 2. Logs Esperados en la Consola

Cuando subes un producto con imágenes, deberías ver:

```
🎯 handleAdditionalImagesChange called
📁 New files selected: 4
  File 1: "imagen1.png" 2474580 bytes
  ...
📸 Compressing image field: images[] (imagen1.png)
⚙️ Compressing image: imagen1.png (2.36MB)
✓ Compression complete:
  Original: 2.36MB
  Compressed: 1.45MB
  Saved: 38.56%
✓ Image is small (0.53MB), skipping compression
...
✅ FormData processed: 4 additional images ready
```

### 3. Verificación

#### En el Frontend:

Abre la consola del navegador (F12) y busca:
- ✅ `📸 Compressing image field:` - Indica que se está comprimiendo
- ✅ `⚙️ Compressing image:` - Proceso de compresión iniciado
- ✅ `✓ Compression complete:` - Compresión exitosa
- ✅ `✓ Image is small, skipping compression` - Imágenes pequeñas sin comprimir

#### En el Backend:

```bash
# Ver logs del backend
docker-compose logs fv-backend -f

# Buscar errores de validación
docker-compose logs fv-backend | grep -i "validation\|error\|413\|422"
```

### 4. Solución de Problemas

#### Si no ves logs de compresión:

1. **Recarga la página con cache limpio:**
   - Chrome/Edge: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5

2. **Verifica que la librería esté instalada:**
   ```bash
   cd fv-frontend
   npm install browser-image-compression
   ```

3. **Reconstruye el frontend:**
   ```bash
   docker-compose build fv-frontend
   docker-compose up -d fv-frontend
   ```

#### Si recibes error 422 (Validation Error):

El backend rechaza imágenes > 2MB. Esto significa que:
- La compresión automática NO funcionó
- Necesitas reconstruir el frontend con la librería de compresión

```bash
cd fv-frontend
npm install
docker-compose build fv-frontend
docker-compose up -d
```

#### Si recibes error 413 (Payload Too Large):

El servidor web (nginx) tiene un límite más bajo. Edita:

```bash
# En docker/nginx/default.conf
client_max_body_size 10M;  # Ya está configurado
```

### 5. Test Manual

Crea un archivo HTML simple para probar la compresión:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Compresión</title>
    <script src="https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js"></script>
</head>
<body>
    <h1>Test de Compresión de Imágenes</h1>
    <input type="file" id="fileInput" accept="image/*" multiple>
    <div id="results"></div>

    <script>
        document.getElementById('fileInput').addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            const results = document.getElementById('results');
            results.innerHTML = '';

            for (const file of files) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(2);
                results.innerHTML += `<p>Original: ${file.name} - ${sizeMB}MB</p>`;

                if (file.size / 1024 / 1024 > 1.5) {
                    try {
                        const compressed = await imageCompression(file, {
                            maxSizeMB: 1.8,
                            maxWidthOrHeight: 1600,
                            fileType: 'image/jpeg'
                        });
                        const compressedSizeMB = (compressed.size / 1024 / 1024).toFixed(2);
                        results.innerHTML += `<p style="color: green;">✓ Comprimido: ${compressedSizeMB}MB (${((1 - compressed.size / file.size) * 100).toFixed(2)}% ahorro)</p>`;
                    } catch (error) {
                        results.innerHTML += `<p style="color: red;">✗ Error: ${error.message}</p>`;
                    }
                } else {
                    results.innerHTML += `<p style="color: blue;">✓ Imagen pequeña, no requiere compresión</p>`;
                }
            }
        });
    </script>
</body>
</html>
```

### 6. Límites Configurados

**Frontend:**
- Compresión automática para imágenes > 1.5MB
- Compresión a máximo 1.8MB
- Redimensión a máximo 1600px

**Backend:**
- Máximo 2MB por imagen (configurado en Request classes)
- Formatos: JPG, PNG, WEBP, SVG

**Para aumentar límites en producción:**
1. Edita `api_fvimport/app/Http/Requests/ProductRequest.php`
2. Cambia `max:2048` a `max:8192` (8MB) si tu hosting lo permite
3. Reconstruye: `docker-compose build fv-backend && docker-compose up -d`
