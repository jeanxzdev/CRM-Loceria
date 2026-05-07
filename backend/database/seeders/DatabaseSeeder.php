<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@loceriatrujillo.com'],
            [
                'name' => 'Admin Trujillo',
                'password' => Hash::make('admin123'),
            ]
        );

        $products = [
            ['name' => 'Plato Tendido 24cm', 'price' => 15.50, 'stock' => 50, 'category' => 'Vajilla'],
            ['name' => 'Taza Café Porcelana', 'price' => 8.20, 'stock' => 100, 'category' => 'Vajilla'],
            ['name' => 'Juego de Cubiertos (24p)', 'price' => 45.00, 'stock' => 20, 'category' => 'Cubiertos'],
            ['name' => 'Bowl Ensalada Vidrio', 'price' => 22.00, 'stock' => 15, 'category' => 'Cristalería'],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['name' => $product['name']], $product);
        }
    }
}
