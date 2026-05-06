import useSWR from "swr";
import { useState } from "react";
import { settingService } from "@/services/settingService";

export function useSettings() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, error, isLoading, mutate } = useSWR("/settings", settingService.getAll, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const updateSettings = async (formData: Record<string, string>) => {
        setIsSubmitting(true);
        try {
            await settingService.update(formData);
            await mutate();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: "Error al actualizar configuración" };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        settings: data,
        isLoading,
        isSubmitting,
        updateSettings,
        error
    };
}
