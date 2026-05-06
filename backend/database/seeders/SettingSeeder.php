<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Perfil del Negocio
            ['key' => 'business_name', 'value' => 'Locería Trujillo', 'group' => 'business'],
            ['key' => 'business_ruc', 'value' => '20123456789', 'group' => 'business'],
            ['key' => 'business_address', 'value' => 'Av. Independencia 123, Trujillo', 'group' => 'business'],
            ['key' => 'business_phone', 'value' => '044-123456', 'group' => 'business'],
            
            // Reglas de Inventario
            ['key' => 'low_stock_threshold', 'value' => '10', 'group' => 'inventory'],
            
            // Ventas
            ['key' => 'tax_percentage', 'value' => '18', 'group' => 'sales'],
            ['key' => 'currency_symbol', 'value' => 'S/', 'group' => 'sales'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
