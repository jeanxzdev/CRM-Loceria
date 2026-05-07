import axios from "axios";

// Limpiamos la URL de posibles espacios o errores de formato
const rawBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const cleanBaseURL = rawBaseURL.trim().replace(/\/$/, ""); 

const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    Accept: "application/json",
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
