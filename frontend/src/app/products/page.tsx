"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Package, Plus, Search, Trash2, MoreVertical, Loader2, Edit2, X, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Product } from "@/services/productService";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 600);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: number, name: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    stock: string;
    category: string;
    image: File | null;
  }>({ name: "", price: "", stock: "", category: "", image: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { products, meta, isLoading, isSubmitting, addProduct, updateProduct, deleteProduct, error } = useProducts(debouncedSearch, page, selectedCategory);
  const { categories, addCategory, updateCategory, deleteCategory, isSubmitting: isAddingCategory } = useCategories();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      image: null
    });
    setImagePreview(product.image_url || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, formData);
    } else {
      result = await addProduct(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: "", price: "", stock: "", category: categories[0]?.name || "", image: null });
      setImagePreview(null);
    } else {
      alert(result.error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (editingCategory) {
      result = await updateCategory(editingCategory.id, newCategoryName);
    } else {
      result = await addCategory(newCategoryName);
    }

    if (result.success) {
      setNewCategoryName("");
      setEditingCategory(null);
    } else {
      alert(result.error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock: "", category: categories[0]?.name || "", image: null });
    setImagePreview(null);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4 overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Productos</h2>
          <p className="text-xs text-slate-500">Gestión de inventario CRM.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsCategoryModalOpen(true);
              setEditingCategory(null);
              setNewCategoryName("");
            }}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 hover:bg-slate-50 shadow-sm"
          >
            <Package size={16} className="text-purple-600" /> Gestionar Categorías
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setFormData({ name: "", price: "", stock: "", category: categories[0]?.name || "", image: null });
              setImagePreview(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-lg shadow-purple-100"
          >
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset a primera página al buscar
            }}
          />
        </div>
        
        <select 
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm min-w-[160px] cursor-pointer"
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        {isLoading && <Loader2 className="animate-spin text-purple-600 self-center" size={18} />}
      </div>

      {/* GRID CONTAINER */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border-2 border-dashed border-rose-200">
              <div className="bg-rose-100 p-3 rounded-2xl mb-3 text-rose-600">
                <Trash2 size={24} />
              </div>
              <p className="text-sm font-bold text-rose-900">Error al cargar productos</p>
              <p className="text-xs text-rose-500 mt-1">
                {error.response?.status === 401 ? "No autorizado. Por favor inicia sesión." : "Error de conexión con el servidor"}
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-4 h-full">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-purple-200 transition-all"
                >
                  {/* IMAGE SECTION */}
                  <div className="relative h-32 w-full bg-slate-50 flex items-center justify-center border-b border-slate-100 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-300">
                        <Package size={32} />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Sin imagen</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <button className="p-1.5 bg-white/80 backdrop-blur-md rounded-lg text-slate-400 hover:text-slate-600 shadow-sm"><MoreVertical size={14} /></button>
                    </div>
                    <div className="absolute top-2 left-2">
                       <span className="px-2 py-1 bg-white/80 backdrop-blur-md rounded-lg text-[9px] font-bold text-slate-600 shadow-sm uppercase tracking-tighter">{product.category}</span>
                    </div>
                  </div>

                  {/* INFO SECTION */}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="mb-3">
                      <h3 className="font-bold text-slate-900 text-[11px] line-clamp-1">{product.name}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Precio</p>
                        <p className="text-xs font-black text-purple-600">{formatCurrency(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Stock</p>
                        <p className={cn("text-[10px] font-bold", product.stock < 10 ? "text-rose-600" : "text-slate-900")}>
                          {product.stock} <span className="text-[8px]">und.</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleEdit(product)} className="flex-1 py-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100">Editar</button>
                      <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <Inbox className="text-slate-300 mb-2" size={48} />
              <p className="text-sm font-medium text-slate-500">No se encontraron productos</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* PAGINATION */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 py-2 flex-shrink-0">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-20 hover:bg-slate-50 transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-[11px] font-bold text-slate-500 px-3">Página {page} de {meta.last_page}</span>
          <button disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-20 hover:bg-slate-50 transition-colors"><ChevronRight size={18} /></button>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? "Editar Producto" : "Agregar Producto"}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
              <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" placeholder="Nombre del producto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Precio</label>
                <input name="price" type="number" step="0.01" required value={formData.price} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Stock</label>
                <input name="stock" type="number" required value={formData.stock} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500">
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Imagen del Producto</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} className="h-full w-full object-cover" />
                  ) : (
                    <Plus className="text-slate-300" size={20} />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, image: file }));
                      const reader = new FileReader();
                      reader.onloadend = () => setImagePreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (editingProduct ? "Guardar Cambios" : "Crear Producto")}
          </button>
        </form>
      </Modal>

      {/* CATEGORY MANAGER MODAL */}
      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Gestionar Categorías">
        <div className="p-6 space-y-6">
          {/* Formulario de agregar/editar */}
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </label>
              <div className="flex gap-2">
                <input 
                  required 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  className="flex-1 p-2.5 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500" 
                  placeholder="Ej: Decoración" 
                />
                <button type="submit" disabled={isAddingCategory} className="bg-purple-600 text-white px-4 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center gap-2">
                  {isAddingCategory ? <Loader2 className="animate-spin" size={16} /> : (editingCategory ? "Guardar" : "Agregar")}
                </button>
                {editingCategory && (
                  <button type="button" onClick={() => { setEditingCategory(null); setNewCategoryName(""); }} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Lista de categorías */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Categorías Existentes</p>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingCategory(cat); setNewCategoryName(cat.name); }} 
                    className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => deleteCategory(cat.id)} 
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}