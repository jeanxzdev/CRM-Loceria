import useSWR from "swr";
import { useState } from "react";
import { saleService, Sale } from "@/services/saleService";

export function useSales(debouncedSearch: string, page: number) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const endpoint = `/sales?search=${debouncedSearch}&page=${page}`;

    const { data, error, isLoading, mutate } = useSWR(
        endpoint,
        () => saleService.getAll(endpoint),
        { keepPreviousData: true }
    );

    const { data: stats, mutate: mutateStats } = useSWR("/sales/stats", saleService.getStats);

    const addSale = async (formData: Partial<Sale>) => {
        setIsSubmitting(true);
        try {
            await saleService.create(formData);
            await mutate();
            await mutateStats();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al registrar venta" };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        sales: data?.data || [],
        meta: data?.meta,
        stats,
        isLoading,
        isSubmitting,
        addSale,
        error
    };
}
