import api from "./api";

export interface Settings {
    [group: string]: {
        id: number;
        key: string;
        value: string;
        group: string;
    }[];
}

export const settingService = {
    getAll: async () => {
        const res = await api.get<Settings>("/settings");
        return res.data;
    },
    update: async (data: Record<string, string>) => {
        const res = await api.post("/settings", data);
        return res.data;
    }
};
