"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, RefreshCw, Package, DollarSign, Tag } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import InventarioTable, { type SortField, type SortDirection } from "@/app/components/inventario/InventarioTable";
import ModalProducto from "@/app/components/inventario/ModalProducto";
import ConfirmarEliminacion from "@/app/components/inventario/ConfirmarEliminacion";
import { crearAPI, formatPrecio } from "@/lib/inventario";
import type { Producto, NuevoProducto } from "@/lib/inventario";

const api = crearAPI();

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("nombre");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);
  const [eliminarConfirm, setEliminarConfirm] = useState<Producto | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProductos();
      setProductos(data);
    } catch (err) {
      setError("No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria));
    return Array.from(set).sort();
  }, [productos]);

  const filtrados = useMemo(() => {
    let result = [...productos];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q),
      );
    }

    if (filtroCategoria) {
      result = result.filter((p) => p.categoria === filtroCategoria);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === "nombre") cmp = a.nombre.localeCompare(b.nombre);
      else if (sortField === "categoria") cmp = a.categoria.localeCompare(b.categoria);
      else if (sortField === "precio") cmp = a.precio - b.precio;
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [productos, search, filtroCategoria, sortField, sortDirection]);

  const totalValor = useMemo(
    () => productos.reduce((sum, p) => sum + p.precio, 0),
    [productos],
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const abrirModalCrear = () => {
    setProductoAEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEditar = (producto: Producto) => {
    setProductoAEditar(producto);
    setModalAbierto(true);
  };

  const handleSave = async (data: NuevoProducto) => {
    try {
      if (productoAEditar) {
        const actualizado = await api.actualizarProducto(productoAEditar.id, data);
        setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
      } else {
        const nuevo = await api.crearProducto(data);
        setProductos((prev) => [...prev, nuevo]);
      }
      setModalAbierto(false);
      setProductoAEditar(null);
    } catch {
      setError("Error al guardar el producto.");
    }
  };

  const handleEliminar = async () => {
    if (!eliminarConfirm) return;
    try {
      await api.eliminarProducto(eliminarConfirm.id);
      setProductos((prev) => prev.filter((p) => p.id !== eliminarConfirm.id));
      setEliminarConfirm(null);
    } catch {
      setError("Error al eliminar el producto.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader
        pageTitle={<>GESTIÓN DE<br />INVENTARIO</>}
        pageDescription="Administra los productos y precios de tu tienda"
      >
        <button
          onClick={abrirModalCrear}
          className="bg-[#725950] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </button>
      </PageHeader>

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {error && (
            <div className="border border-[#ffdad6] bg-[#ffdad6]/30 rounded-2xl p-4">
              <p className="text-sm font-semibold text-[#ba1a1a]">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-[#725950]" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "PRODUCTOS", value: productos.length.toString(), icon: Package, color: "bg-[#dbe3f1]/50 text-[#575f6b]" },
                  { label: "VALOR INVENTARIO", value: formatPrecio(totalValor), icon: DollarSign, color: "bg-[#fedcd0]/30 text-[#725950]" },
                  { label: "CATEGORÍAS", value: categorias.length.toString(), icon: Tag, color: "bg-[#e3e3e3]/40 text-[#5d5f5f]" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/80 backdrop-blur-xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 rounded-2xl p-5 shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-xl ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#817470] mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2">
                    BUSCAR PRODUCTO
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre o categoría..."
                    className="w-full max-w-md border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
                  />
                </div>
                {categorias.length > 0 && (
                  <div className="min-w-[11em]">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2">
                      FILTRAR POR
                    </label>
                    <select
                      value={filtroCategoria}
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                      className="w-full border border-[#e4e2e2] rounded-xl px-3 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none cursor-pointer focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
                    >
                      <option value="">Todas las categorías</option>
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <InventarioTable
                productos={filtrados}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onEditar={abrirModalEditar}
                onEliminar={setEliminarConfirm}
              />

              {filtrados.length > 0 && (
                <p className="text-xs text-[#817470] text-center">
                  Mostrando {filtrados.length} de {productos.length} producto{productos.length !== 1 ? "s" : ""}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {modalAbierto && (
        <ModalProducto
          producto={productoAEditar}
          onClose={() => { setModalAbierto(false); setProductoAEditar(null); }}
          onSave={handleSave}
        />
      )}

      {eliminarConfirm && (
        <ConfirmarEliminacion
          producto={eliminarConfirm}
          onClose={() => setEliminarConfirm(null)}
          onConfirm={handleEliminar}
        />
      )}
    </div>
  );
}
