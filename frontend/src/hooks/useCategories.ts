import useSWR from "swr";
import { useState } from "react";
import { categoryService } from "@/services/categoryService";

export function useCategories() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: categories, error, mutate, isLoading } = useSWR("/categories", () => categoryService.getAll());

    const addCategory = async (name: string) => {
        setIsSubmitting(true);
        try {
            await categoryService.create(name);
            await mutate();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al crear categoría" };
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateCategory = async (id: number, name: string) => {
        setIsSubmitting(true);
        try {
            await categoryService.update(id, name);
            await mutate();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al actualizar categoría" };
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteCategory = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar esta categoría?")) return;
        setIsSubmitting(true);
        try {
            await categoryService.delete(id);
            await mutate();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || "Error al eliminar categoría" };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        categories: categories || [],
        isLoading,
        addCategory,
        updateCategory,
        deleteCategory,
        isSubmitting,
        error
    };
}
