#!/bin/bash

echo "=================================================="
echo "FV Auto Importaciones - Diagnóstico CORS"
echo "=================================================="
echo ""

echo "1. Verificando estado de contenedores..."
docker-compose ps
echo ""

echo "2. Test CORS (localhost:4245)..."
curl -s -I -X OPTIONS -H 'Origin: http://localhost:4245' -H 'Access-Control-Request-Method: POST' http://localhost:4246/api/products 2>&1 | grep -E "HTTP|Access-Control-Allow"
echo ""

echo "3. Test CORS (127.0.0.1:4245)..."
curl -s -I -X OPTIONS -H 'Origin: http://127.0.0.1:4245' -H 'Access-Control-Request-Method: POST' http://localhost:4246/api/products 2>&1 | grep -E "HTTP|Access-Control-Allow"
echo ""

echo "4. Test API básico..."
curl -s http://localhost:4246/api/categories 2>&1 | head -50
echo ""

echo "5. Verificando configuración CORS en el backend..."
docker-compose exec fv-backend cat /var/www/html/config/cors.php | grep -A 2 "allowed_origins"
echo ""

echo "6. Verificando variables de entorno..."
docker-compose exec fv-backend env | grep -E "APP_DEBUG|SANCTUM|CORS" | sort
echo ""

echo "=================================================="
echo "Diagnóstico completo"
echo "=================================================="
echo ""
echo "Si CORS funciona correctamente, verás:"
echo "  ✅ Access-Control-Allow-Origin en los tests 2 y 3"
echo "  ✅ {\"data\":[]} en el test 4"
echo "  ✅ 'allowed_origins' => ['*'] en el test 5"
echo ""
echo "Si aún tienes problemas:"
echo "  1. Ejecuta: docker-compose logs fv-backend -f"
echo "  2. En el navegador, recarga con Ctrl+Shift+R"
echo "  3. Intenta crear un producto"
echo "  4. Mira los logs en tiempo real"
echo ""
