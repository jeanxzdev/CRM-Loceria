#!/bin/bash

# If artisan doesn't exist, it means the framework is not installed
if [ ! -f "artisan" ]; then
    echo "Artisan not found. Installing Laravel framework..."
    # We use a temporary directory to not conflict with existing folders
    composer create-project laravel/laravel tmp_laravel --prefer-dist --no-interaction
    cp -rn tmp_laravel/. .
    rm -rf tmp_laravel
fi

# Install dependencies if vendor is missing
if [ ! -d "vendor" ]; then
    composer install --no-interaction
fi

# Generate key if not set and not provided by environment
if [ -z "$APP_KEY" ] && [ ! -f ".env" ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    php artisan key:generate
fi

# If APP_KEY is set in environment but no .env exists, we might still need a .env for some Laravel features
# but we should be careful not to overwrite DB vars.
# In Railway/production, it's better to rely on actual environment variables.
if [ ! -f ".env" ] && [ "$APP_ENV" != "production" ]; then
    cp .env.example .env
fi

# Clear all caches to ensure fresh configuration
echo "Clearing Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run migrations and seeders
echo "Running migrations..."
php artisan migrate --force
# php artisan db:seed --force # Optional: only if you want to seed on every deploy

# Start server
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
