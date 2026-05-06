"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, Package, Plus, Trash2, Loader2, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const orderSchema = z.object({
  client_id: z.string().min(1, "El cliente es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  status: z.enum(["pending", "in_progress", "delivered"]),
  items: z.array(z.object({
    product_id: z.string().min(1, "Producto requerido"),
    quantity: z.number().min(1, "Mínimo 1"),
    price: z.number().min(0),
  })).min(1, "Debe agregar al menos un producto"),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  clients: any[];
  products: any[];
  onSubmit: (data: OrderFormData) => void;
  isLoading?: boolean;
}

export default function OrderForm({ clients, products, onSubmit, isLoading }: OrderFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      items: [{ product_id: "", quantity: 1, price: 0 }],
    },
  });

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find(p => p.id.toString() === productId);
    if (prod) {
      setValue(`items.${index}.price`, Number(prod.price));
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchItems = watch("items");
  const total = watchItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Cliente</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              {...register("client_id")}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {errors.client_id && <p className="text-xs text-rose-500 ml-1">{errors.client_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Fecha de Pedido</label>
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
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Productos del Pedido</h4>
          <button
            type="button"
            onClick={() => append({ product_id: "", quantity: 1, price: 0 })}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Plus size={14} />
            Agregar Producto
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-end group">
              <div className="flex-1 space-y-1">
                <select
                  {...register(`items.${index}.product_id` as const)}
                  onChange={(e) => {
                    register(`items.${index}.product_id`).onChange(e);
                    handleProductChange(index, e.target.value);
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Producto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-24 space-y-1">
                <input
                  {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                  type="number"
                  placeholder="Cant."
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-center"
                />
              </div>
              <div className="w-32 space-y-1">
                <input
                  {...register(`items.${index}.price` as const, { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="Precio"
                  className="w-full px-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none text-right"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        {errors.items && <p className="text-xs text-rose-500 ml-1">{errors.items.message}</p>}
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Estimado</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(total)}</p>
        </div>
        <button
          disabled={isLoading}
          type="submit"
          className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-200 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Crear Pedido"}
        </button>
      </div>
    </form>
  );
}
