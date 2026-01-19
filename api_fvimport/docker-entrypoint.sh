#!/bin/sh
set -e

echo "🚀 Starting FV Auto Importaciones API..."

# Wait for database to be ready
echo "⏳ Waiting for database connection..."
until php artisan db:show 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Generate application key if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

# Ensure APP_KEY exists in .env (Laravel needs the variable present to write the key)
if ! grep -q "^APP_KEY=" .env; then
    echo "APP_KEY=" >> .env
fi

# Check if APP_KEY is not set
if ! grep -q "APP_KEY=base64:" .env; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force --no-interaction
fi

# Run migrations
echo "🗄️  Running database migrations..."
php artisan migrate --force

# Seed database (create default admin user)
echo "👤 Creating default admin user..."
php artisan db:seed --force

# Create storage link
echo "🔗 Creating storage symbolic link..."
php artisan storage:link || true

# Cache optimization
echo "⚡ Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✨ Application is ready!"

# Execute the main command
exec "$@"
