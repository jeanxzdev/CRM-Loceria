import useSWR from "swr";
import { dashboardService } from "@/services/dashboardService";

export function useDashboard() {
    const { data, error, isLoading, mutate } = useSWR("/dashboard/stats", dashboardService.getStats, {
        refreshInterval: 30000, // Refresh every 30 seconds
    });

    return {
        dashboard: data,
        isLoading,
        error,
        mutate
    };
}
