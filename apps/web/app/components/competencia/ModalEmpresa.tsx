"use client";

import { useEffect } from "react";

export interface Empresa {
  nombre: string;
  ubicacion: string;
  google_maps_url: string;
  sitio_web: string | null;
  calificaciones: {
    rating: number;
    total_resenas: number;
    rango_precio_gmaps: string;
    ultimas_resenas: string[];
  };
  precios: Array<{
    producto: string;
    precio: number;
    imagen_url: string | null;
  }> | null;
  _meta?: {
    analisisId: number;
    status: string;
    fechaEjecucion: string;
    busqueda: { tema: string; ubicacion: string };
    fecha: string;
  };
}

interface Props {
  empresa: Empresa | null;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[0.25em]">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span
            key={star}
            className={`text-[1.2em] ${
              filled
                ? "text-[#725950]"
                : half
                  ? "text-[#725950] opacity-60"
                  : "text-[#d3c3be]"
            }`}
          >
            ★
          </span>
        );
      })}
      <span
        className="ml-[0.4em] text-[0.85em] font-semibold text-[#1b1c1c]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ModalEmpresa({ empresa, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (empresa) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [empresa]);

  if (!empresa) return null;

  const { calificaciones, precios } = empresa;

  return (
    <div
      className="fixed top-0 inset-0 z-[999] flex items-center justify-center bg-[rgba(27,28,28,0.3)] backdrop-blur-sm p-4 w-full h-full"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-xl border border-[#e4e2e2] rounded-2xl w-full max-w-[680px] max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#e4e2e2] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-1">
              DETALLE DE COMPETENCIA
            </p>
            <h2
              className="text-xl font-semibold leading-tight text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {empresa.nombre}
            </h2>
            <div className="mt-2">
              <StarRating rating={calificaciones.rating} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xl font-semibold leading-none text-[#4f4441] hover:bg-[#f5f3f3] hover:text-[#1b1c1c] transition-colors w-10 h-10 flex items-center justify-center border border-[#e4e2e2] rounded-xl flex-shrink-0 cursor-pointer"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-5 border-b border-[#e4e2e2] grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-1">
                UBICACIÓN
              </p>
              <a
                href={empresa.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#1b1c1c] hover:text-[#725950] transition-colors"
              >
                📍 {empresa.ubicacion}
              </a>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-1">
                SITIO WEB
              </p>
              {empresa.sitio_web ? (
                <a
                  href={empresa.sitio_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#1b1c1c] hover:text-[#725950] transition-colors"
                >
                  {empresa.sitio_web.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <span className="text-sm text-[#817470]">No disponible</span>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-1">
                RESEÑAS TOTALES
              </p>
              <span className="text-sm font-semibold text-[#1b1c1c]">
                {calificaciones.total_resenas.toLocaleString("es-CL")} reseñas
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-1">
                RANGO DE PRECIOS
              </p>
              <span className="text-sm font-semibold text-[#1b1c1c]">
                {calificaciones.rango_precio_gmaps === "No especificado"
                  ? "—"
                  : calificaciones.rango_precio_gmaps}
              </span>
            </div>
          </div>

          {precios && precios.length > 0 && (
            <div className="p-5 border-b border-[#e4e2e2]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-3">
                LISTA DE PRECIOS
              </p>
              <div className="grid grid-cols-1 gap-2">
                {precios.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-[#e4e2e2] rounded-xl px-4 py-3 bg-[#f5f3f3]/30"
                  >
                    <span className="text-sm font-semibold text-[#1b1c1c] uppercase">
                      {item.producto}
                    </span>
                    <span className="text-sm font-bold text-[#725950] ml-4 whitespace-nowrap">
                      ${item.precio.toLocaleString("es-CL")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-3">
              ÚLTIMAS OPINIONES ({calificaciones.ultimas_resenas.length})
            </p>
            <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
              {calificaciones.ultimas_resenas.map((resena, i) => (
                <div
                  key={i}
                  className="border border-[#e4e2e2] rounded-xl p-4 bg-[#f5f3f3]/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2">
                    RESEÑA #{i + 1}
                  </p>
                  <p className="text-sm text-[#1b1c1c] leading-relaxed m-0">
                    {resena}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#e4e2e2] p-4 flex gap-3">
          <a
            href={empresa.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-3 bg-[#725950] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#5d4a42] border border-[#725950] rounded-xl transition-all duration-200"
          >
            VER EN GOOGLE MAPS
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white text-[#1b1c1c] text-xs font-semibold uppercase tracking-wider border border-[#e4e2e2] hover:bg-[#f5f3f3] rounded-xl transition-all duration-200 cursor-pointer"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
}
