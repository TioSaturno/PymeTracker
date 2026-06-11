"use client";

import type { Producto } from "@/lib/inventario";
import { formatPrecio } from "@/lib/inventario";
import { Pencil, Trash2 } from "lucide-react";

interface ProductoRowProps {
  producto: Producto;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
}

export default function ProductoRow({ producto, onEditar, onEliminar }: ProductoRowProps) {
  return (
    <tr className="border-b border-[#e4e2e2] hover:bg-[#f5f3f3]/50 transition-colors duration-150">
      <td className="py-4 px-4">
        <p className="text-sm font-semibold text-[#1b1c1c]">{producto.nombre}</p>
      </td>
      <td className="py-4 px-4">
        <span className="inline-block px-2.5 py-1 bg-[#fedcd0]/30 text-[#725950] text-[10px] font-semibold rounded-full border border-[#fedcd0]">
          {producto.categoria}
        </span>
      </td>
      <td className="py-4 px-4 text-sm font-bold text-[#1b1c1c] whitespace-nowrap" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {formatPrecio(producto.precio)}
      </td>
      <td className="py-4 px-4 text-xs text-[#817470] whitespace-nowrap">{producto.fechaCreacion}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEditar(producto)}
            className="p-2 rounded-lg text-[#817470] hover:bg-[#f5f3f3] hover:text-[#725950] transition-all duration-200 cursor-pointer"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEliminar(producto)}
            className="p-2 rounded-lg text-[#817470] hover:bg-[#ffdad6]/30 hover:text-[#ba1a1a] transition-all duration-200 cursor-pointer"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
