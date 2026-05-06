import useSWR from "swr";
import { useState } from "react";
import { orderService, Order } from "@/services/orderService";

export function useOrders(debouncedSearch: string, page: number, status: string = "") {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const endpoint = `/orders?search=${debouncedSearch}&page=${page}${status ? `&status=${status}` : ""}`;

    const { data, error, isLoading, mutate } = useSWR(
        endpoint,
        () => orderService.getAll(endpoint),
        { keepPreviousData: true }
    );

    const { data: stats, mutate: mutateStats } = useSWR("/orders/stats", orderService.getStats);

    const addOrder = async (formData: any) => {
        setIsSubmitting(true);
        try {
            await orderService.create(formData);
            await mutate();
            await mutateStats();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al crear pedido" };
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateOrderStatus = async (id: number, status: string) => {
        try {
            await orderService.updateStatus(id, status);
            await mutate();
            await mutateStats();
        } catch (err) {
            alert("No se pudo actualizar el estado");
        }
    };

    const deleteOrder = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este pedido?")) return;
        try {
            await orderService.delete(id);
            await mutate();
            await mutateStats();
        } catch (err) {
            alert("No se pudo eliminar el pedido");
        }
    };

    return {
        orders: data?.data || [],
        meta: data?.meta,
        stats,
        isLoading,
        isSubmitting,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        error
    };
}
