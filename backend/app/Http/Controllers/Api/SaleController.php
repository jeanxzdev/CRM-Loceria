<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with('client');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('client', function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%");
            })->orWhere('id', 'like', "%{$search}%");
        }

        return $query->latest()->paginate(10);
    }

    public function getStats()
    {
        $monthTotal = Sale::whereMonth('date', now()->month)
                         ->whereYear('date', now()->year)
                         ->sum('total');
        
        $count = Sale::whereMonth('date', now()->month)->count();
        $dailyAvg = $count > 0 ? $monthTotal / now()->day : 0;

        return response()->json([
            'month_total' => $monthTotal,
            'sales_count' => $count,
            'daily_avg' => $dailyAvg,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:paid,pending',
            'date' => 'required|date',
            'payment_method' => 'nullable|string',
        ]);

        return Sale::create($validated);
    }
}
