<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['client', 'items.product']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('client', function($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%");
            })->orWhere('id', 'like', "%{$search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return $query->latest()->paginate(10);
    }

    public function getStats()
    {
        return response()->json([
            'pending' => Order::where('status', 'pending')->count(),
            'in_progress' => Order::where('status', 'in_progress')->count(),
            'total_today' => Order::whereDate('date', now()->toDateString())->sum('total'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'date' => 'required|date',
            'status' => 'required|in:pending,in_progress,delivered',
        ]);

        return DB::transaction(function () use ($validated) {
            $total = collect($validated['items'])->sum(function ($item) {
                return $item['quantity'] * $item['price'];
            });

            $order = Order::create([
                'client_id' => $validated['client_id'],
                'status' => $validated['status'],
                'total' => $total,
                'date' => $validated['date'],
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            return $order->load(['client', 'items.product']);
        });
    }

    public function show(Order $order)
    {
        return $order->load(['client', 'items.product']);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,delivered',
        ]);

        $order->update(['status' => $validated['status']]);
        return $order;
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(['success' => true]);
    }
}
