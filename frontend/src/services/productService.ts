import api from "./api";

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    image_url?: string;
}

export interface ApiResponse {
    data: Product[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export const productService = {
    // Obtener productos (para el fetcher de SWR)
    getAll: async (url: string) => {
        const res = await api.get<ApiResponse>(url);
        return res.data;
    },

    // Crear un producto
    create: async (productData: FormData) => {
        const res = await api.post<Product>("/products", productData);
        return res.data;
    },
    
    // Actualizar un producto
    update: async (id: number, productData: FormData) => {
        // Para enviar archivos en un PUT/PATCH con Laravel y FormData, se debe usar POST con _method=PUT
        productData.append("_method", "PUT");
        const res = await api.post<Product>(`/products/${id}`, productData);
        return res.data;
    },

    // Eliminar un producto
    delete: async (id: number) => {
        await api.delete(`/products/${id}`);
        return true;
    }
};