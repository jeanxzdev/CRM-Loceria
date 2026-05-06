<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('client_id')->constrained()->onDelete('cascade');
            $blueprint->decimal('total', 10, 2);
            $blueprint->enum('status', ['paid', 'pending'])->default('paid');
            $blueprint->date('date');
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
