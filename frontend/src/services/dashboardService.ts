import api from "./api";
import { Order } from "./orderService";

export interface DashboardStats {
    stats: {
        sales_today: number;
        sales_change: number;
        active_clients: number;
        new_clients: number;
        pending_orders: number;
        low_stock_alert: number;
    };
    recent_orders: Order[];
    chart_data: { date: string, total: number }[];
}

export const dashboardService = {
    getStats: async () => {
        const res = await api.get<DashboardStats>("/dashboard/stats");
        return res.data;
    }
};
