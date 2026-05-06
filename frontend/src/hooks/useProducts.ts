import useSWR from "swr";
import { useState } from "react";
import { productService } from "@/services/productService";

export function useProducts(debouncedSearch: string, page: number, category: string = "") {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Endpoint con filtros
    const endpoint = `/products?search=${debouncedSearch}&page=${page}${category ? `&category=${category}` : ""}`;

    const { data, error, isLoading, mutate } = useSWR(
        endpoint,
        () => productService.getAll(endpoint),
        { keepPreviousData: true }
    );

    const addProduct = async (formData: any) => {
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price.toString());
            data.append("stock", formData.stock.toString());
            data.append("category", formData.category);
            
            if (formData.image instanceof File) {
                data.append("image", formData.image);
            }

            await productService.create(data as any);
            await mutate(); // Refresca la lista
            return { success: true };
        } catch (err: any) {
            console.error("Error en addProduct:", err);
            // Extraemos el mensaje de error de Laravel si existe
            const message = err.response?.data?.message || "Error al conectar con el servidor";
            return { success: false, error: message };
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateProduct = async (id: number, formData: any) => {
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("price", formData.price.toString());
            data.append("stock", formData.stock.toString());
            data.append("category", formData.category);
            
            if (formData.image instanceof File) {
                data.append("image", formData.image);
            }

            await productService.update(id, data);
            await mutate();
            return { success: true };
        } catch (err: any) {
            console.error("Error en updateProduct:", err);
            const message = err.response?.data?.message || "Error al actualizar producto";
            return { success: false, error: message };
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await productService.delete(id);
            await mutate();
        } catch (err) {
            alert("No se pudo eliminar el producto");
        }
    };

    return {
        products: data?.data || [],
        meta: data?.meta,
        isLoading,
        isSubmitting,
        addProduct,
        updateProduct,
        deleteProduct,
        error
    };
}