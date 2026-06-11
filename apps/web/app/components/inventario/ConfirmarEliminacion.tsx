"use client";

import type { Producto } from "@/lib/inventario";

interface ConfirmarEliminacionProps {
  producto: Producto;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmarEliminacion({ producto, onClose, onConfirm }: ConfirmarEliminacionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/80 backdrop-blur-xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-sm p-8 text-center">
        <div className="text-4xl mb-4">🗑️</div>
        <h2 className="text-xl font-semibold text-[#1b1c1c] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Eliminar Producto
        </h2>
        <p className="text-sm text-[#4f4441] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          ¿Estás seguro de eliminar <strong className="text-[#1b1c1c]">{producto.nombre}</strong>?<br />
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm font-semibold text-[#4f4441] hover:bg-[#f5f3f3] transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#ba1a1a] text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[#93000a] transition-all duration-200 shadow-[0_4px_16px_rgba(186,26,26,0.2)] cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
