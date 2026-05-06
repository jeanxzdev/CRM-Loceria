"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  CreditCard, 
  Calendar, 
  ArrowUpRight,
  TrendingUp,
  Download,
  Loader2,
  Inbox,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSales } from "@/hooks/useSales";
import { useClients } from "@/hooks/useClients";
import { useOrders } from "@/hooks/useOrders";
import { useDebounce } from "use-debounce";
import Modal from "@/components/ui/Modal";
import SaleForm from "@/components/forms/SaleForm";

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { sales, meta, stats, isLoading, isSubmitting, addSale, error } = useSales(debouncedSearch, page);
  const { clients } = useClients("", 1); // Para el selector de clientes
  const { orders } = useOrders("", 1, "pending"); // Solo pedidos pendientes para cobrar

  const handleCreateSale = async (data: any) => {
    const result = await addSale(data);
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ventas</h2>
          <p className="text-slate-500">Registro de ventas completadas y pagos.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border border-slate-200">
            <Download size={18} />
            Exportar
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shadow-purple-200"
          >
            <Plus size={18} />
            Registrar Venta
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nueva Venta"
      >
        <SaleForm 
          clients={clients} 
          orders={orders}
          onSubmit={handleCreateSale} 
          isLoading={isSubmitting} 
        />
      </Modal>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ingresos Totales (Mes)</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.month_total || 0)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
            <ArrowUpRight size={14} />
            <span>+15% vs mes anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ventas Registradas</p>
              <p className="text-2xl font-bold text-slate-900">{stats?.sales_count || 0}</p>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[70%]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Promedio Diario</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.daily_avg || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID o cliente..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          {isLoading && <Loader2 className="animate-spin text-purple-600" size={20} />}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Método</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Monto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.length > 0 ? sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-400 text-xs">#{sale.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 uppercase text-xs">{sale.client.name}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 font-bold">{sale.date}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">
                      {sale.payment_method || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-black rounded-full uppercase tracking-wider",
                      sale.status === "paid" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {sale.status === "paid" ? "Pagado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              )) : !isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Inbox className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-medium">No se encontraron ventas registradas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {meta && meta.last_page > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Página <span className="text-slate-900 font-bold">{meta.current_page}</span> de <span className="text-slate-900 font-bold">{meta.last_page}</span>
            </p>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                disabled={page === meta.last_page}
                onClick={() => setPage(p => p + 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-all active:scale-95 shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
