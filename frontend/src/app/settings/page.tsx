"use client";

import { useState, useEffect } from "react";
import { 
  Building2, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const { settings, isLoading, isSubmitting, updateSettings } = useSettings();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (settings) {
      const flatSettings: Record<string, string> = {};
      Object.values(settings).flat().forEach(s => {
        flatSettings[s.key] = s.value;
      });
      setFormData(flatSettings);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings(formData);
    if (result.success) {
      setStatus({ type: 'success', message: 'Configuración guardada correctamente' });
      setTimeout(() => setStatus(null), 3000);
    } else {
      setStatus({ type: 'error', message: result.error || 'Error al guardar' });
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Configuración del Negocio</h2>
        <p className="text-slate-500 font-medium">Gestiona la información principal de Locería Trujillo.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Building2 size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Perfil de la Empresa</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Nombre del Negocio</label>
              <input 
                type="text" 
                value={formData.business_name || ""}
                onChange={(e) => handleChange("business_name", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Ej. Locería Trujillo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">RUC / Identificación</label>
              <input 
                type="text" 
                value={formData.business_ruc || ""}
                onChange={(e) => handleChange("business_ruc", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="20123456789"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Dirección Fiscal</label>
              <input 
                type="text" 
                value={formData.business_address || ""}
                onChange={(e) => handleChange("business_address", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="Av. Principal 123..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Teléfono de Contacto</label>
              <input 
                type="text" 
                value={formData.business_phone || ""}
                onChange={(e) => handleChange("business_phone", e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                placeholder="044-123456"
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold",
                  status.type === 'success' ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </motion.div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-200 active:scale-95 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
