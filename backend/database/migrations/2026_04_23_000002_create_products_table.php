<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('products', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('name');
            $blueprint->decimal('price', 10, 2);
            $blueprint->integer('stock');    // <--- Agrega esta línea
            $blueprint->string('category'); // <--- Agrega esta línea
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
