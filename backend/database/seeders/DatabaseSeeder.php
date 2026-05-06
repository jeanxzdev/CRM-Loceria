<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Trujillo',
            'email' => 'admin@loceriatrujillo.com',
            'password' => Hash::make('admin123'),
        ]);

        \App\Models\Product::create(['name' => 'Plato Tendido 24cm', 'price' => 15.50, 'stock' => 50, 'category' => 'Vajilla']);
        \App\Models\Product::create(['name' => 'Taza Café Porcelana', 'price' => 8.20, 'stock' => 100, 'category' => 'Vajilla']);
        \App\Models\Product::create(['name' => 'Juego de Cubiertos (24p)', 'price' => 45.00, 'stock' => 20, 'category' => 'Cubiertos']);
        \App\Models\Product::create(['name' => 'Bowl Ensalada Vidrio', 'price' => 22.00, 'stock' => 15, 'category' => 'Cristalería']);
    }
}
