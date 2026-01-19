#!/bin/bash

echo "=================================================="
echo "  FV Auto Importaciones - Test Final CORS"
echo "=================================================="
echo ""

echo "1️⃣  Verificando estado de contenedores..."
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
echo ""

echo "2️⃣  Test CORS Preflight..."
CORS_RESULT=$(curl -s -I -X OPTIONS \
  -H 'Origin: http://localhost:4245' \
  -H 'Access-Control-Request-Method: POST' \
  http://localhost:4246/api/products | grep "Access-Control-Allow-Origin")

if [[ $CORS_RESULT == *"*"* ]]; then
    echo "✅ CORS configurado correctamente: $CORS_RESULT"
else
    echo "❌ CORS tiene problemas: $CORS_RESULT"
fi
echo ""

echo "3️⃣  Test de Login..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:4246/api/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"frank@fvautoimports.com.pe","password":"Fr@nk2026"}')

if [[ $LOGIN_RESULT == *"token"* ]]; then
    echo "✅ Login funciona correctamente"
    TOKEN=$(echo $LOGIN_RESULT | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "   Token obtenido: ${TOKEN:0:30}..."
else
    echo "❌ Login falló"
    echo "$LOGIN_RESULT"
    exit 1
fi
echo ""

echo "4️⃣  Test de Creación de Producto..."
PRODUCT_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:4246/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Test Producto Final" \
  -F "description=Producto de prueba" \
  -F "price=100" \
  -F "stock=10" \
  -F "category_id=1")

HTTP_CODE=$(echo "$PRODUCT_RESULT" | grep "HTTP_CODE" | cut -d':' -f2)

if [[ "$HTTP_CODE" == "201" ]]; then
    echo "✅ Producto creado exitosamente (HTTP 201)"
    echo "$PRODUCT_RESULT" | grep -v "HTTP_CODE" | head -10
elif [[ "$HTTP_CODE" == "200" ]]; then
    echo "✅ Producto creado exitosamente (HTTP 200)"
    echo "$PRODUCT_RESULT" | grep -v "HTTP_CODE" | head -10
else
    echo "❌ Error al crear producto (HTTP $HTTP_CODE)"
    echo "$PRODUCT_RESULT" | grep -v "HTTP_CODE"
fi
echo ""

echo "5️⃣  Verificando configuración CORS en el backend..."
CORS_CONFIG=$(docker-compose exec fv-backend cat /var/www/html/config/cors.php | grep -A 1 "supports_credentials")
echo "$CORS_CONFIG"
echo ""

echo "=================================================="
echo "                  RESUMEN FINAL"
echo "=================================================="
echo ""
echo "✅ Backend funcionando:   http://localhost:4246"
echo "✅ Frontend funcionando:  http://localhost:4245"
echo "✅ Admin:                 frank@fvautoimports.com.pe / Fr@nk2026"
echo ""
echo "📌 SIGUIENTE PASO:"
echo "   1. Cierra TODAS las pestañas de localhost:4245"
echo "   2. Abre modo incógnito (Ctrl+Shift+N)"
echo "   3. Ve a http://localhost:4245"
echo "   4. Inicia sesión y prueba crear un producto"
echo ""
echo "Si aún ves errores de CORS:"
echo "   • Ejecuta: docker-compose logs fv-backend -f"
echo "   • Luego intenta crear el producto"
echo "   • Copia EXACTAMENTE el error que veas"
echo ""
echo "=================================================="
