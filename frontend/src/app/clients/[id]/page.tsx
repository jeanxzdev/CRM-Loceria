"use client";

import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  CreditCard,
  ChevronRight,
  Clock
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

const client = {
  id: 1,
  name: "Tienda Escolar ABC",
  phone: "987 654 321",
  address: "Av. Larco 123, Trujillo",
  status: "active",
  notes: "Cliente fiel desde 2024. Prefiere entregas por la mañana.",
  stats: {
    totalSpent: 12450.50,
    ordersCount: 15,
    pendingBalance: 0
  }
};

const history = [
  { id: 1, type: "sale", date: "2026-04-20", title: "Venta Registrada", amount: 350.00, status: "completed" },
  { id: 2, type: "order", date: "2026-04-18", title: "Pedido Recibido", amount: 120.00, status: "pending" },
  { id: 3, type: "sale", date: "2026-04-10", title: "Venta Registrada", amount: 450.00, status: "completed" },
];

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors font-semibold"
      >
        <ArrowLeft size={20} />
        Volver a Clientes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-3xl bg-purple-100 flex items-center justify-center text-3xl font-extrabold text-purple-600 mb-4 shadow-inner">
                {client.name.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{client.name}</h2>
              <span className="mt-2 px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                {client.status === "active" ? "Cliente Activo" : "Inactivo"}
              </span>
            </div>

            <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone size={18} className="text-slate-400" />
                <span className="text-sm font-medium">{client.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-slate-400" />
                <span className="text-sm font-medium">{client.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} className="text-slate-400" />
                <span className="text-sm font-medium">Desde Enero 2024</span>
              </div>
            </div>

            <div className="mt-8 bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notas</p>
              <p className="text-sm text-slate-600 leading-relaxed italic">"{client.notes}"</p>
            </div>
          </div>

          <div className="bg-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-200">
            <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-4">Resumen de Cuenta</p>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium opacity-80">Ventas Totales</span>
                <span className="text-2xl font-bold">{formatCurrency(client.stats.totalSpent)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium opacity-80">Pedidos Realizados</span>
                <span className="text-2xl font-bold">{client.stats.ordersCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* History Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Línea de Tiempo</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Todos</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">Ventas</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full">Pedidos</span>
              </div>
            </div>

            <div className="space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-100" />

              {history.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-6 pl-14 group"
                >
                  <div className={cn(
                    "absolute left-3 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10",
                    item.type === "sale" ? "bg-purple-500" : "bg-amber-500"
                  )} />
                  
                  <div className="flex-1 bg-slate-50/50 hover:bg-slate-50 p-5 rounded-2xl border border-slate-100 transition-all group-hover:border-purple-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          item.type === "sale" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"
                        )}>
                          {item.type === "sale" ? <CreditCard size={18} /> : <ShoppingBag size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <Clock size={12} />
                            {item.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{formatCurrency(item.amount)}</p>
                        <span className={cn(
                          "text-[10px] font-bold uppercase",
                          item.status === "completed" ? "text-emerald-500" : "text-amber-500"
                        )}>
                          {item.status === "completed" ? "Completado" : "Pendiente"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-8 py-3 text-sm font-bold text-slate-500 hover:text-purple-600 border-2 border-dashed border-slate-200 hover:border-purple-200 rounded-2xl transition-all">
              Ver Historial Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
