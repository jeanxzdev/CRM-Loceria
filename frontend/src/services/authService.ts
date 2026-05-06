import api from "./api";

export const loginRequest = async (data: {
    email: string;
    password: string;
}) => {
    const response = await api.post("/login", data);
    return response.data;
};