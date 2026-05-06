"use client";

import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Plus
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";

export default function Dashboard() {
  const { dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  const stats = [
    {
      label: "Ventas de Hoy",
      value: dashboard?.stats.sales_today || 0,
      change: `${dashboard?.stats.sales_change}%`,
      trend: dashboard?.stats.sales_change! >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Clientes Activos",
      value: dashboard?.stats.active_clients || 0,
      change: `+${dashboard?.stats.new_clients}`,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pedidos Pendientes",
      value: dashboard?.stats.pending_orders || 0,
      change: "Hoy",
      trend: "neutral",
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Alertas de Stock",
      value: dashboard?.stats.low_stock_alert || 0,
      change: "Bajo",
      trend: dashboard?.stats.low_stock_alert! > 0 ? "down" : "neutral",
      icon: AlertTriangle,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bienvenido al Panel de Control</h2>
          <p className="text-slate-500 font-medium">Aquí tienes el resumen operativo de Locería Trujillo.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fecha Actual</p>
          <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={cn(stat.bg, stat.color, "p-3 rounded-2xl group-hover:scale-110 transition-transform")}>
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase",
                stat.trend === "up" ? "bg-emerald-100 text-emerald-700" : 
                stat.trend === "down" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"
              )}>
                {stat.trend === "up" && <ArrowUpRight size={12} />}
                {stat.trend === "down" && <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stat.label.includes("Ventas") 
                  ? formatCurrency(stat.value as number) 
                  : stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Pedidos Recientes</h3>
              <p className="text-xs text-slate-400 font-bold mt-1">Últimos movimientos detectados</p>
            </div>
            <Link href="/orders" className="text-purple-600 text-xs font-black uppercase hover:text-purple-700 flex items-center gap-1 group">
              Ver todos <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {dashboard?.recent_orders.length! > 0 ? dashboard?.recent_orders.map((order, index) => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-600 text-sm border border-slate-200">
                    #{order.id}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors uppercase">
                      {order.client?.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">
                      {new Date(order.date).toLocaleDateString()} • {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest",
                  order.status === "pending" ? "bg-amber-100 text-amber-700" :
                  order.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                  "bg-emerald-100 text-emerald-700"
                )}>
                  {order.status === "pending" ? "Pendiente" : order.status === "in_progress" ? "Proceso" : "Listo"}
                </span>
              </motion.div>
            )) : (
              <div className="py-12 text-center text-slate-400">
                No hay actividad reciente.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & High Importance Alerts */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-500/40 transition-all duration-500"></div>
            
            <h3 className="text-lg font-black mb-1 uppercase tracking-tight">Acceso Rápido</h3>
            <p className="text-slate-400 text-xs font-bold mb-8 uppercase tracking-widest">Optimiza tu tiempo</p>
            
            <div className="space-y-4 relative z-10">
              <Link href="/clients" className="w-full py-4 px-4 bg-purple-600 hover:bg-purple-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 active:scale-95">
                <Plus size={18} />
                Nuevo Cliente
              </Link>
              <Link href="/orders" className="w-full py-4 px-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-700 active:scale-95">
                <ShoppingBag size={18} />
                Crear Pedido
              </Link>
              <Link href="/products" className="w-full py-4 px-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-700 active:scale-95">
                <TrendingUp size={18} />
                Inventario
              </Link>
            </div>
          </div>

          {dashboard?.stats.low_stock_alert! > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-rose-50 border-2 border-rose-100 rounded-3xl p-6 flex flex-col items-center text-center group"
            >
              <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4 group-hover:animate-bounce">
                <AlertTriangle size={24} />
              </div>
              <h4 className="text-sm font-black text-rose-900 uppercase">¡Alerta de Inventario!</h4>
              <p className="text-xs text-rose-600 font-bold mt-1">Tienes {dashboard?.stats.low_stock_alert} productos con stock crítico.</p>
              <Link href="/products" className="mt-4 text-[10px] font-black uppercase text-rose-700 hover:underline">Reponer ahora</Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
