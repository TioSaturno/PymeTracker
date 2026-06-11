"use client";

import type { Producto } from "@/lib/inventario";
import ProductoRow from "./ProductoRow";
import { ArrowUpDown } from "lucide-react";

export type SortField = "nombre" | "precio" | "categoria";
export type SortDirection = "asc" | "desc";

interface InventarioTableProps {
  productos: Producto[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEditar: (producto: Producto) => void;
  onEliminar: (producto: Producto) => void;
}

const columnas: { label: string; field: SortField; className?: string }[] = [
  { label: "Producto", field: "nombre" },
  { label: "Categoría", field: "categoria" },
  { label: "Precio", field: "precio" },
  { label: "Agregado", field: "nombre", className: "hidden md:table-cell" },
  { label: "Acciones", field: "nombre", className: "w-[100px]" },
];

export default function InventarioTable({ productos, sortField, sortDirection, onSort, onEditar, onEliminar }: InventarioTableProps) {
  if (productos.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-xl border border-dashed border-[#d3c3be] rounded-2xl p-12 text-center">
        <p className="text-3xl mb-3">📦</p>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#817470] mb-1">
          SIN PRODUCTOS
        </p>
        <p className="text-sm text-[#4f4441]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Agrega tu primer producto para comenzar con tu inventario.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 rounded-2xl shadow-[0_4px_16px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
          <thead>
            <tr className="border-b border-[#e4e2e2] bg-[#f5f3f3]/30">
              {columnas.map((col) => (
                <th
                  key={col.label}
                  className={`text-left py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-[#817470] ${col.className ?? ""}`}
                >
                  {col.field === "nombre" || col.field === "precio" || col.field === "categoria" ? (
                    col.label === "Acciones" || col.label === "Agregado" ? (
                      col.label
                    ) : (
                      <button
                        onClick={() => onSort(col.field)}
                        className="flex items-center gap-1 hover:text-[#725950] transition-colors cursor-pointer"
                      >
                        {col.label}
                        <ArrowUpDown className={`h-3 w-3 ${sortField === col.field ? "text-[#725950]" : "text-[#d3c3be]"}`} />
                      </button>
                    )
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <ProductoRow key={p.id} producto={p} onEditar={onEditar} onEliminar={onEliminar} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
