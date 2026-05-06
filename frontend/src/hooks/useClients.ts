import useSWR from "swr";
import { useState } from "react";
import { clientService, Client } from "@/services/clientService";

export function useClients(debouncedSearch: string, page: number, status: string = "") {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const endpoint = `/clients?search=${debouncedSearch}&page=${page}${status ? `&status=${status}` : ""}`;

    const { data, error, isLoading, mutate } = useSWR(
        endpoint,
        () => clientService.getAll(endpoint),
        { keepPreviousData: true }
    );

    const addClient = async (formData: Partial<Client>) => {
        setIsSubmitting(true);
        try {
            await clientService.create(formData);
            await mutate();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al crear cliente" };
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateClient = async (id: number, formData: Partial<Client>) => {
        setIsSubmitting(true);
        try {
            await clientService.update(id, formData);
            await mutate();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al actualizar cliente" };
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteClient = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
        try {
            await clientService.delete(id);
            await mutate();
        } catch (err) {
            alert("No se pudo eliminar el cliente");
        }
    };

    return {
        clients: data?.data || [],
        meta: data?.meta,
        isLoading,
        isSubmitting,
        addClient,
        updateClient,
        deleteClient,
        error
    };
}
