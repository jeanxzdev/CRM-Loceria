<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;
use App\Models\Category;

return new class extends Migration {
    public function up(): void
    {
        // Obtener todas las categorías únicas de los productos actuales
        $categories = Product::distinct()->pluck('category')->filter();

        foreach ($categories as $catName) {
            Category::firstOrCreate(['name' => $catName]);
        }
    }

    public function down(): void
    {
        // No es necesario deshacer esto
    }
};
