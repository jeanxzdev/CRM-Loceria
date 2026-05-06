import api from "./api";

export interface Category {
    id: number;
    name: string;
}

export const categoryService = {
    getAll: async () => {
        const res = await api.get<Category[]>("/categories");
        return res.data;
    },
    create: async (name: string) => {
        const res = await api.post<Category>("/categories", { name });
        return res.data;
    },
    update: async (id: number, name: string) => {
        const res = await api.put<Category>(`/categories/${id}`, { name });
        return res.data;
    },
    delete: async (id: number) => {
        const res = await api.delete(`/categories/${id}`);
        return res.data;
    }
};
