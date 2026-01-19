# 🚀 FV Auto Importaciones - Docker Deployment

## ✅ Tu aplicación está lista para producción

Todo ha sido dockerizado y probado exitosamente. Solo necesitas 2 comandos para desplegar en tu VPS.

---

## Puertos Configurados

- **Frontend (Next.js)**: `http://localhost:4245`
- **Backend API (Laravel)**: `http://localhost:4246/api`
- **MySQL Database**: Puerto interno `3306`, expuesto en `3309` (opcional)

**Estos puertos NO interfieren con tus aplicaciones existentes en la VPS.**

---

## 🎯 Deployment en VPS (2 comandos)

### 1. Clonar el repositorio en tu VPS

```bash
# Conéctate a tu VPS
ssh root@sv-eh0yYqf7jJFHElDkVxdm

# Clona o sube tu código
git clone <tu-repo> /root/fvimport
# O usa scp/rsync para subir los archivos

cd /root/fvimport
```

### 2. Configurar variables de entorno (opcional)

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita si necesitas cambiar algo (opcional)
nano .env
```

**Por defecto funciona sin cambios**, pero puedes personalizar:
- Contraseñas de base de datos
- URLs de producción
- Dominio personalizado

### 3. ¡Lanzar la aplicación!

```bash
# Construir las imágenes
docker-compose build

# Iniciar todos los servicios
docker-compose up -d
```

**¡Listo!** Tu aplicación estará corriendo en:
- Frontend: `http://TU_IP_VPS:4245`
- Backend API: `http://TU_IP_VPS:4246/api`

### 4. Usuario administrador predeterminado

**El sistema crea automáticamente un usuario administrador:**

- **Email**: `frank@fvautoimports.com.pe`
- **Contraseña**: `Fr@nk2026`

Puedes usar estas credenciales para acceder al panel de administración en `/login`.

---

## 📋 Verificar que todo funciona

```bash
# Ver estado de los contenedores
docker-compose ps

# Deberías ver 3 contenedores "healthy":
# - fv-db (MySQL)
# - fv-backend (Laravel API)
# - fv-frontend (Next.js)
```

Ver logs en tiempo real:
```bash
docker-compose logs -f
```

---

## 🌐 Configurar dominio (opcional)

Si quieres usar tu dominio (ej: `fvautoimportaciones.com`), agrega estas configuraciones a tu Nginx gateway existente:

### Backend API (api.tudominio.com)

```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:4246;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

### Frontend (tudominio.com)

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:4245;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Luego recarga nginx:
```bash
nginx -t && systemctl reload nginx
```

---

## 🔧 Comandos Útiles

```bash
# Detener la aplicación
docker-compose down

# Reiniciar todo
docker-compose restart

# Ver logs del backend
docker-compose logs -f fv-backend

# Ver logs del frontend
docker-compose logs -f fv-frontend

# Acceder a la base de datos
docker-compose exec fv-db mysql -u fv_user -p fv_import_db
# Contraseña: fv_password_secure_2024 (o la que configuraste en .env)

# Ejecutar comandos de Laravel
docker-compose exec fv-backend php artisan migrate
docker-compose exec fv-backend php artisan cache:clear

# Actualizar la aplicación
git pull
docker-compose build
docker-compose up -d
```

---

## 📊 Backup de Base de Datos

```bash
# Crear backup
docker-compose exec fv-db mysqldump -u root -p fv_import_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker-compose exec -T fv-db mysql -u root -p fv_import_db < backup_20260118.sql
```

---

## 🆘 Troubleshooting

### Los contenedores no inician

```bash
# Ver logs de error
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Error de base de datos

```bash
# Verificar que MySQL está healthy
docker-compose ps fv-db

# Ver logs de MySQL
docker-compose logs fv-db
```

### Frontend no carga

```bash
# Verificar logs
docker-compose logs fv-frontend

# Reconstruir frontend
docker-compose build fv-frontend
docker-compose up -d fv-frontend
```

### Backend devuelve error 500

```bash
# Ver logs detallados
docker-compose logs fv-backend

# Limpiar caché de Laravel
docker-compose exec fv-backend php artisan cache:clear
docker-compose exec fv-backend php artisan config:cache
```

---

## 🔐 Seguridad en Producción

**Antes de usar en producción, actualiza el `.env`:**

```bash
nano .env
```

Cambia estas variables:
```env
# Contraseñas seguras
DB_PASSWORD=TU_CONTRASEÑA_SUPER_SEGURA_AQUI
DB_ROOT_PASSWORD=TU_ROOT_PASSWORD_SUPER_SEGURA_AQUI

# URLs de producción (si tienes dominio)
APP_URL=https://api.tudominio.com
FRONTEND_URL=https://tudominio.com
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.tudominio.com
```

Luego reconstruye:
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📚 Más Información

- Deployment detallado: Ver `DEPLOYMENT.md`
- Arquitectura del código: Ver `CLAUDE.md`
- Configuración de hosting: Ver `api_fvimport/CONFIGURACION_HOSTING.md`

---

## ✅ Status Actual

✅ Docker images construidas
✅ Contenedores iniciados
✅ Backend API funcionando (http://localhost:4246/api)
✅ Frontend funcionando (http://localhost:4245)
✅ Base de datos inicializada
✅ Migraciones ejecutadas
✅ Listo para producción

**¡Tu aplicación está lista para desplegarse en tu VPS!** 🎉
