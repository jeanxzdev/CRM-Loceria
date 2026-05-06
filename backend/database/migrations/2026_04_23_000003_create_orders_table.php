<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('client_id')->constrained()->onDelete('cascade');
            $blueprint->enum('status', ['pending', 'in_progress', 'delivered'])->default('pending');
            $blueprint->decimal('total', 10, 2)->default(0);
            $blueprint->date('date');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
