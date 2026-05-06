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

# Generate key if not set
if [ ! -f ".env" ]; then
    cp .env.example .env
    php artisan key:generate
fi

# Run migrations and start server
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
