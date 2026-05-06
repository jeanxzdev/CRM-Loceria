import api from "./api";

export interface Client {
    id: number;
    name: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive';
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ClientsResponse {
    data: Client[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export const clientService = {
    getAll: async (endpoint: string) => {
        const res = await api.get<ClientsResponse>(endpoint);
        return res.data;
    },
    create: async (data: Partial<Client>) => {
        const res = await api.post<Client>("/clients", data);
        return res.data;
    },
    update: async (id: number, data: Partial<Client>) => {
        const res = await api.put<Client>(`/clients/${id}`, data);
        return res.data;
    },
    delete: async (id: number) => {
        const res = await api.delete(`/clients/${id}`);
        return res.data;
    }
};
