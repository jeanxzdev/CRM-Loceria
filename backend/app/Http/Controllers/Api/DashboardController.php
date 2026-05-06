<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Order;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        // 1. Ventas de Hoy
        $salesToday = Sale::whereDate('date', now()->toDateString())->sum('total');
        $salesYesterday = Sale::whereDate('date', now()->subDay()->toDateString())->sum('total');
        
        $salesChange = $salesYesterday > 0 
            ? (($salesToday - $salesYesterday) / $salesYesterday) * 100 
            : 0;

        // 2. Clientes Activos
        $activeClientsCount = Client::where('status', 'active')->count();
        $newClientsThisMonth = Client::whereMonth('created_at', now()->month)->count();

        // 3. Pedidos Pendientes
        $pendingOrdersCount = Order::where('status', 'pending')->count();

        // 4. Actividad Reciente (Últimos 10 pedidos)
        $recentOrders = Order::with('client')
            ->latest()
            ->take(5)
            ->get();

        // 5. Productos con Stock Bajo (< 10)
        $lowStockProducts = Product::where('stock', '<', 10)->count();

        // 6. Ventas últimos 7 días (para un gráfico futuro)
        $salesLast7Days = Sale::select(
                DB::raw('DATE(date) as date'),
                DB::raw('SUM(total) as total')
            )
            ->where('date', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => [
                'sales_today' => $salesToday,
                'sales_change' => round($salesChange, 1),
                'active_clients' => $activeClientsCount,
                'new_clients' => $newClientsThisMonth,
                'pending_orders' => $pendingOrdersCount,
                'low_stock_alert' => $lowStockProducts,
            ],
            'recent_orders' => $recentOrders,
            'chart_data' => $salesLast7Days
        ]);
    }
}
