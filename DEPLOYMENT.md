# 🚀 FV Auto Importaciones - Deployment Guide

## Production Deployment with Docker

This guide will help you deploy the FV Auto Importaciones application to your VPS using Docker.

### Prerequisites

- Docker installed on your VPS
- Docker Compose installed
- Git installed

### Ports Used

- **4245**: Frontend (Next.js)
- **4246**: Backend API (Laravel)
- **3309**: MySQL Database (internal, optional external access)

These ports are configured to avoid conflicts with existing applications on your VPS.

---

## Quick Start Deployment

### 1. Clone the repository

```bash
git clone <your-repo-url> /root/fvimport
cd /root/fvimport
```

### 2. Configure environment variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your production settings
nano .env
```

**Important environment variables to update:**

```env
# Database Configuration
DB_DATABASE=fv_import_db
DB_USERNAME=fv_user
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DB_ROOT_PASSWORD=YOUR_SECURE_ROOT_PASSWORD_HERE

# Application URLs (replace with your domain)
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
SESSION_DOMAIN=.yourdomain.com

# Frontend URLs
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_IMAGE_BASE_URL=https://api.yourdomain.com
```

### 3. Build and start the application

```bash
# Build all Docker images
docker-compose build

# Start all services in detached mode
docker-compose up -d
```

That's it! Your application should now be running.

---

## Verify Deployment

Check if all containers are running:

```bash
docker-compose ps
```

You should see:
- `fv-db` (healthy)
- `fv-backend` (healthy)
- `fv-frontend` (healthy)

Check logs:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f fv-backend
docker-compose logs -f fv-frontend
```

---

## Access the Application

- **Frontend**: http://your-vps-ip:4245
- **Backend API**: http://your-vps-ip:4246/api
- **Health Check**: http://your-vps-ip:4246/api/categories

### Default Admin User

The system automatically creates an administrator user on first deployment:

- **Email**: `frank@fvautoimports.com.pe`
- **Password**: `Fr@nk2026`

You can use these credentials to login at: `http://your-vps-ip:4245/login`

---

## Setting Up Reverse Proxy (Optional)

If you want to use your existing Nginx gateway (port 80/443), add these configurations:

### Backend API (api.yourdomain.com)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4246;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

### Frontend (yourdomain.com)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:4245;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then run:
```bash
nginx -t
systemctl reload nginx
```

---

## Common Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart fv-backend
docker-compose restart fv-frontend
```

### View Logs

```bash
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f fv-backend

# Frontend only
docker-compose logs -f fv-frontend

# Database only
docker-compose logs -f fv-db
```

### Database Operations

```bash
# Access MySQL
docker-compose exec fv-db mysql -u fv_user -p fv_import_db

# Run migrations manually (if needed)
docker-compose exec fv-backend php artisan migrate

# Create database backup
docker-compose exec fv-db mysqldump -u root -p fv_import_db > backup.sql

# Restore database
docker-compose exec -T fv-db mysql -u root -p fv_import_db < backup.sql
```

### Laravel Commands

```bash
# Access Laravel container
docker-compose exec fv-backend sh

# Run artisan commands
docker-compose exec fv-backend php artisan cache:clear
docker-compose exec fv-backend php artisan config:cache
docker-compose exec fv-backend php artisan route:cache
docker-compose exec fv-backend php artisan storage:link
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose build
docker-compose up -d
```

---

## Troubleshooting

### Container fails to start

```bash
# Check logs
docker-compose logs fv-backend
docker-compose logs fv-frontend

# Check container status
docker-compose ps
```

### Database connection issues

```bash
# Verify database is healthy
docker-compose ps fv-db

# Check database logs
docker-compose logs fv-db

# Test database connection
docker-compose exec fv-backend php artisan db:show
```

### Storage/Upload issues

```bash
# Recreate storage link
docker-compose exec fv-backend php artisan storage:link

# Fix permissions
docker-compose exec fv-backend chown -R www-data:www-data /var/www/html/storage
docker-compose exec fv-backend chmod -R 775 /var/www/html/storage
```

### Port conflicts

If ports 4245 or 4246 are already in use, edit `docker-compose.yml`:

```yaml
# Change this:
ports:
  - "4245:3000"

# To this (example):
ports:
  - "4250:3000"
```

Then rebuild:
```bash
docker-compose up -d --force-recreate
```

---

## Production Checklist

- [ ] Update `.env` with production values
- [ ] Set strong database passwords
- [ ] Configure correct domain URLs
- [ ] Set `APP_DEBUG=false` in backend
- [ ] Run migrations: `docker-compose exec fv-backend php artisan migrate`
- [ ] Create storage link: `docker-compose exec fv-backend php artisan storage:link`
- [ ] Set up SSL certificates (Let's Encrypt recommended)
- [ ] Configure reverse proxy if needed
- [ ] Set up automated backups for database
- [ ] Configure monitoring and alerts

---

## Security Recommendations

1. **Use strong passwords** for database
2. **Enable firewall** and only expose necessary ports
3. **Use SSL/TLS** for production (Let's Encrypt)
4. **Regular backups** of database and uploaded files
5. **Keep Docker images updated**
6. **Monitor logs** for suspicious activity

---

## Support

For issues or questions, check:
- Application logs: `docker-compose logs -f`
- CLAUDE.md for development guidance
- Laravel documentation: https://laravel.com/docs
- Next.js documentation: https://nextjs.org/docs
