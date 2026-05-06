"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Phone, MapPin, FileText, Loader2 } from "lucide-react";
import { useState } from "react";

const clientSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  phone: z.string().min(9, "Teléfono inválido"),
  address: z.string().min(5, "La dirección es requerida"),
  status: z.enum(["active", "inactive"]),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<ClientFormData>;
}

export default function ClientForm({ onSubmit, isLoading, initialData }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData || {
      status: "active",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Nombre de la Tienda / Cliente</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            {...register("name")}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="Ej. Bazar El Sol"
          />
        </div>
        {errors.name && <p className="text-xs text-rose-500 ml-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Teléfono</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              {...register("phone")}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              placeholder="999 999 999"
            />
          </div>
          {errors.phone && <p className="text-xs text-rose-500 ml-1">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Estado</label>
          <select
            {...register("status")}
            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Dirección</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            {...register("address")}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="Calle, Número, Distrito"
          />
        </div>
        {errors.address && <p className="text-xs text-rose-500 ml-1">{errors.address.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Notas (Opcional)</label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
            placeholder="Información adicional sobre el cliente..."
          />
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Guardar Cliente"}
      </button>
    </form>
  );
}
