import api from "./api";
import { Client } from "./clientService";

export interface Sale {
    id: number;
    client_id: number;
    client: Client;
    total: number;
    status: 'paid' | 'pending';
    date: string;
    payment_method: string;
}

export interface SalesResponse {
    data: Sale[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export interface SaleStats {
    month_total: number;
    sales_count: number;
    daily_avg: number;
}

export const saleService = {
    getAll: async (endpoint: string) => {
        const res = await api.get<SalesResponse>(endpoint);
        return res.data;
    },
    getStats: async () => {
        const res = await api.get<SaleStats>("/sales/stats");
        return res.data;
    },
    create: async (data: Partial<Sale>) => {
        const res = await api.post<Sale>("/sales", data);
        return res.data;
    }
};
