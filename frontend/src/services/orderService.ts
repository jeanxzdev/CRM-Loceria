import api from "./api";
import { Client } from "./clientService";
import { Product } from "./productService";

export interface OrderItem {
    id?: number;
    product_id: number;
    quantity: number;
    price: number;
    product?: Product;
}

export interface Order {
    id: number;
    client_id: number;
    client: Client;
    total: number;
    status: 'pending' | 'in_progress' | 'delivered';
    date: string;
    items: OrderItem[];
    created_at: string;
}

export interface OrdersResponse {
    data: Order[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export interface OrderStats {
    pending: number;
    in_progress: number;
    total_today: number;
}

export const orderService = {
    getAll: async (endpoint: string) => {
        const res = await api.get<OrdersResponse>(endpoint);
        return res.data;
    },
    getStats: async () => {
        const res = await api.get<OrderStats>("/orders/stats");
        return res.data;
    },
    create: async (data: any) => {
        const res = await api.post<Order>("/orders", data);
        return res.data;
    },
    updateStatus: async (id: number, status: string) => {
        const res = await api.patch<Order>(`/orders/${id}/status`, { status });
        return res.data;
    },
    delete: async (id: number) => {
        const res = await api.delete(`/orders/${id}`);
        return res.data;
    }
};
