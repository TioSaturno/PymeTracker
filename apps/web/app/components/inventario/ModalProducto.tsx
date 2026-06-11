"use client";

import { useState } from "react";
import type { Producto, NuevoProducto } from "@/lib/inventario";

interface ModalProductoProps {
  producto: Producto | null;
  onClose: () => void;
  onSave: (data: NuevoProducto) => void;
}

interface FormErrors {
  nombre?: string;
  categoria?: string;
  precio?: string;
}

export default function ModalProducto({ producto, onClose, onSave }: ModalProductoProps) {
  const esEdicion = producto !== null;
  const [form, setForm] = useState<NuevoProducto>({
    nombre: producto?.nombre ?? "",
    precio: producto?.precio ?? 0,
    categoria: producto?.categoria ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validar = (): boolean => {
    const errs: FormErrors = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.categoria.trim()) errs.categoria = "La categoría es obligatoria";
    if (form.precio <= 0) errs.precio = "El precio debe ser mayor a 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/80 backdrop-blur-xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-lg p-8">
        <h2 className="text-xl font-semibold text-[#1b1c1c] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {esEdicion ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2">
              Nombre del producto
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Café Americano"
              className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
            />
            {errors.nombre && <p className="text-xs text-[#ba1a1a] mt-1 ml-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2">
              Categoría
            </label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              placeholder="Ej: Bebidas Calientes"
              className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
            />
            {errors.categoria && <p className="text-xs text-[#ba1a1a] mt-1 ml-1">{errors.categoria}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2">
              Precio
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#817470] text-sm font-medium">$</span>
              <input
                type="number"
                min={0}
                step={100}
                value={form.precio || ""}
                onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                placeholder="0"
                className="w-full border border-[#e4e2e2] rounded-xl pl-8 pr-4 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
              />
            </div>
            {errors.precio && <p className="text-xs text-[#ba1a1a] mt-1 ml-1">{errors.precio}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm font-semibold text-[#4f4441] hover:bg-[#f5f3f3] transition-all duration-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#725950] text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] cursor-pointer"
            >
              {esEdicion ? "Guardar Cambios" : "Agregar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
