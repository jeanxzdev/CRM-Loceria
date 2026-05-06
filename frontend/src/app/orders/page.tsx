"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  ShoppingBag, 
  Calendar, 
  User, 
  ChevronRight,
  Filter,
  Loader2,
  Inbox,
  Trash2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import Modal from "@/components/ui/Modal";
import OrderForm from "@/components/forms/OrderForm";
import { useOrders } from "@/hooks/useOrders";
import { useClients } from "@/hooks/useClients";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "use-debounce";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { orders, meta, stats, isLoading, isSubmitting, addOrder, updateOrderStatus, deleteOrder } = useOrders(debouncedSearch, page, selectedStatus);
  
  // Para el formulario necesitamos la lista de clientes y productos
  const { clients } = useClients("", 1); // Simplificado para el ejemplo
  const { products } = useProducts("", 1); 

  const handleCreateOrder = async (data: any) => {
    const result = await addOrder(data);
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  const statusStyles = {
    pending: "bg-amber-100 text-amber-700",
    in_progress: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
  };
  
  const statusLabels = {
    pending: "Pendiente",
    in_progress: "En Proceso",
    delivered: "Entregado",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pedidos</h2>
          <p className="text-slate-500">Administra los pedidos de tus clientes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-purple-200"
        >
          <Plus size={18} />
          Nuevo Pedido
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Crear Nuevo Pedido"
      >
        <OrderForm 
          clients={clients} 
          products={products} 
          onSubmit={handleCreateOrder} 
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">En Proceso</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats?.in_progress || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hoy</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(stats?.total_today || 0)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o ID de pedido..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all cursor-pointer min-w-[150px] appearance-none font-medium text-slate-600"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Proceso</option>
            <option value="delivered">Entregados</option>
          </select>
          {isLoading && <Loader2 className="animate-spin text-purple-600" size={20} />}
        </div>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                  #{order.id}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors uppercase text-xs">
                      {order.client.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                      <Calendar size={14} />
                      {order.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                      <ShoppingBag size={14} />
                      {order.items.length} productos
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6">
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{formatCurrency(order.total)}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] font-black rounded-full uppercase tracking-wider cursor-pointer border-none outline-none focus:ring-2 focus:ring-purple-500/20 transition-all",
                      statusStyles[order.status as keyof typeof statusStyles]
                    )}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Proceso</option>
                    <option value="delivered">Entregado</option>
                  </select>
                  <button onClick={() => deleteOrder(order.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )) : !isLoading && (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <Inbox className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-medium">No se encontraron pedidos</p>
          </div>
        )}

        {/* PAGINATION */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-slate-500 font-medium">
              Página <span className="text-slate-900 font-bold">{meta.current_page}</span> de <span className="text-slate-900 font-bold">{meta.last_page}</span>
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                disabled={page === meta.last_page}
                onClick={() => setPage(p => p + 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95"
              >
                <ChevronRightIcon size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
