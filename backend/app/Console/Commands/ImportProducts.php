<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product; // No olvides importar el modelo

class ImportProducts extends Command
{
    protected $signature = 'app:import-products';
    protected $description = 'Importa una lista inicial de productos de locería';

    public function handle()
    {
        $json = '[
            {"name": "Juego de Platos Cerámica (12 piezas)", "price": 45.90, "stock": 10, "category": "Vajilla"},
            {"name": "Taza de Porcelana Blanca", "price": 4.50, "stock": 50, "category": "Tazas"},
            {"name": "Ensaladera de Vidrio Templado", "price": 12.00, "stock": 15, "category": "Fuentes"},
            {"name": "Set de Vasos Cristalería (6 unidades)", "price": 18.50, "stock": 20, "category": "Cristalería"},
            {"name": "Plato Playo Decorado", "price": 7.20, "stock": 40, "category": "Vajilla"},
            {"name": "Tetera de Hierro Encedido", "price": 32.00, "stock": 5, "category": "Té y Café"},
            {"name": "Bowl de Barro Cocido", "price": 6.00, "stock": 25, "category": "Artesanal"},
            {"name": "Plato para Postre Mármol", "price": 9.99, "stock": 30, "category": "Vajilla"},
            {"name": "Jarros Térmicos de Cerámica", "price": 11.50, "stock": 12, "category": "Tazas"}
        ]';

        $products = json_decode($json, true);

        $this->info('Iniciando la importación de productos...');

        foreach ($products as $productData) {
            // Usamos updateOrCreate para evitar duplicados si corres el comando varias veces
            Product::updateOrCreate(
                ['name' => $productData['name']], // Condición para buscar
                $productData                      // Datos para insertar o actualizar
            );
        }

        $this->info('¡Importación completada con éxito!'); // <--- USA INFO O LINE
    }
}