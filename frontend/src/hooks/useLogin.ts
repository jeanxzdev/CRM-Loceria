import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/services/authService";

export const useLogin = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await loginRequest(data);
            localStorage.setItem("token", res.token);
            router.push("/");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Credenciales incorrectas";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return { onSubmit, error, isLoading };
};