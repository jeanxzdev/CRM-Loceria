"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, DollarSign, Calendar, CreditCard, Loader2 } from "lucide-react";

import { formatCurrency } from "@/lib/utils";

const saleSchema = z.object({
  order_id: z.string().optional(),
  client_id: z.string().min(1, "El cliente es requerido"),
  total: z.number().min(0, "Monto inválido"),
  status: z.enum(["paid", "pending"]),
  date: z.string().min(1, "La fecha es requerida"),
  payment_method: z.string().min(1, "El método de pago es requerido"),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleFormProps {
  clients: any[];
  orders: any[];
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function SaleForm({ clients, orders, onSubmit, isLoading }: SaleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(saleSchema.extend({
      received_amount: z.number().min(0, "Monto recibido inválido"),
    })),
    defaultValues: {
      status: "paid",
      date: new Date().toISOString().split("T")[0],
      payment_method: "Efectivo",
      total: 0,
      received_amount: 0,
    },
  });

  const selectedOrderId = watch("order_id");
  const total = watch("total") || 0;
  const receivedAmount = watch("received_amount") || 0;
  const change = Math.max(0, receivedAmount - total);

  // Al seleccionar un pedido, jalamos sus datos
  const handleOrderChange = (orderId: string) => {
    const order = orders.find(o => o.id.toString() === orderId);
    if (order) {
      setValue("client_id", order.client_id.toString());
      setValue("total", Number(order.total));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Vincular con Pedido (Opcional)</label>
        <select
          {...register("order_id")}
          onChange={(e) => {
            register("order_id").onChange(e);
            handleOrderChange(e.target.value);
          }}
          className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="">Seleccionar un pedido pendiente...</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              Pedido #{o.id} - {o.client?.name} ({formatCurrency(o.total)})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Cliente</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            {...register("client_id")}
            disabled={!!selectedOrderId}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer disabled:opacity-60"
          >
            <option value="">Seleccionar cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Monto de la Venta</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              {...register("total", { valueAsNumber: true })}
              readOnly={!!selectedOrderId}
              type="number"
              step="0.01"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-purple-600 readOnly:bg-purple-50"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Dinero Recibido</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              {...register("received_amount", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full pl-10 pr-4 py-2.5 bg-emerald-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-emerald-700"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {receivedAmount > 0 && (
        <div className="bg-slate-900 p-4 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Vuelto para el Cliente:</span>
          <span className="text-emerald-400 font-black text-xl">{formatCurrency(change)}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 ml-1">Fecha</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            {...register("date")}
            type="date"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          />
        </div>
        {errors.date && <p className="text-xs text-rose-500 ml-1">{errors.date.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Método de Pago</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              {...register("payment_method")}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Yape/Plin">Yape/Plin</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Estado</label>
          <select
            {...register("status")}
            className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer font-bold"
          >
            <option value="paid" className="text-emerald-600">Pagado</option>
            <option value="pending" className="text-amber-600">Pendiente</option>
          </select>
        </div>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Registrar Venta"}
      </button>
    </form>
  );
}
