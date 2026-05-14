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
                ? "text-[#f59e0b]"
                : half
                  ? "text-[#f59e0b] opacity-60"
                  : "text-[#d1d5db]"
            }`}
          >
            ★
          </span>
        );
      })}
      <span className="ml-[0.4em] text-[0.85em] font-bold text-[#1a1b22]">
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

  // Bloquear scroll del body cuando el modal está abierto
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
      className="fixed z-[50] flex items-center justify-center bg-[rgba(0,0,0,0.6)] p-[1em] w-[100%] h-[100%]"
      onClick={onClose}
    >
      <div
        className="bg-[#fbf8ff] border-2 border-[#1a1b22] w-[100%] max-w-[680px] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del modal */}
        <div className="flex items-start justify-between border-b-2 border-[#1a1b22] p-[1.25em]">
          <div>
            <p className="text-[0.65em] font-black uppercase tracking-[0.2em] text-[#666] mb-[0.3em]">
              DETALLE DE COMPETENCIA
            </p>
            <h2 className="text-[1.4em] font-black uppercase leading-tight text-[#1a1b22] m-0">
              {empresa.nombre}
            </h2>
            <div className="mt-[0.5em]">
              <StarRating rating={calificaciones.rating} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[1.5em] font-black leading-none text-[#1a1b22] hover:bg-[#1a1b22] hover:text-[#ffffff] transition-colors w-[1.6em] h-[1.6em] flex items-center justify-center border-[2px] border-[#1a1b22] flex-shrink-0"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Cuerpo scrollable */}
        <div className="overflow-y-auto flex-1">
          {/* Info general */}
          <div className="p-[1.25em] border-b-2 border-[#1a1b22] grid grid-cols-2 gap-[1em]">
            <div>
              <p className="text-[0.65em] font-black uppercase tracking-[0.15em] text-[#666] mb-[0.25em]">
                UBICACIÓN
              </p>
              <a
                href={empresa.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.85em] font-bold text-[#1a1b22] underline hover:text-[#f59e0b] transition-colors"
              >
                📍 {empresa.ubicacion}
              </a>
            </div>
            <div>
              <p className="text-[0.65em] font-black uppercase tracking-[0.15em] text-[#666] mb-[0.25em]">
                SITIO WEB
              </p>
              {empresa.sitio_web ? (
                <a
                  href={empresa.sitio_web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.85em] font-bold text-[#1a1b22] underline hover:text-[#f59e0b] transition-colors"
                >
                  {empresa.sitio_web.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <span className="text-[0.85em] text-[#999]">No disponible</span>
              )}
            </div>
            <div>
              <p className="text-[0.65em] font-black uppercase tracking-[0.15em] text-[#666] mb-[0.25em]">
                RESEÑAS TOTALES
              </p>
              <span className="text-[0.85em] font-bold text-[#1a1b22]">
                {calificaciones.total_resenas.toLocaleString("es-CL")} reseñas
              </span>
            </div>
            <div>
              <p className="text-[0.65em] font-black uppercase tracking-[0.15em] text-[#666] mb-[0.25em]">
                RANGO DE PRECIOS
              </p>
              <span className="text-[0.85em] font-bold text-[#1a1b22]">
                {calificaciones.rango_precio_gmaps === "No especificado"
                  ? "—"
                  : calificaciones.rango_precio_gmaps}
              </span>
            </div>
          </div>

          {/* Precios */}
          {precios && precios.length > 0 && (
            <div className="p-[1.25em] border-b-2 border-[#1a1b22]">
              <p className="text-[0.65em] font-black uppercase tracking-[0.15em] text-[#666] mb-[0.75em]">
                LISTA DE PRECIOS
              </p>
              <div className="grid grid-cols-1 gap-[0.4em]">
                {precios.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-[#1a1b22] px-[0.75em] py-[0.5em]"
                  >
                    <span className="text-[0.82em] font-bold text-[#1a1b22] uppercase">
                      {item.producto}
                    </span>
                    <span className="text-[0.82em] font-black text-[#1a1b22] ml-[1em] whitespace-nowrap">
                      ${item.precio.toLocaleString("es-CL")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opiniones scrollables */}
          <div className="p-[1.25em]">
            <p className="text-[0.65em] font-black uppercase tracking-[0.15em] text-[#666] mb-[0.75em]">
              ÚLTIMAS OPINIONES ({calificaciones.ultimas_resenas.length})
            </p>
            <div className="flex flex-col gap-[0.75em] max-h-[260px] overflow-y-auto pr-[0.25em]">
              {calificaciones.ultimas_resenas.map((resena, i) => (
                <div
                  key={i}
                  className="border-2 border-[#1a1b22] p-[0.875em] bg-[#fbf8ff]"
                >
                  <p className="text-[0.65em] font-black uppercase tracking-[0.1em] text-[#666] mb-[0.4em]">
                    RESEÑA #{i + 1}
                  </p>
                  <p className="text-[0.82em] text-[#1a1b22] leading-relaxed m-0">
                    {resena}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#1a1b22] p-[1em] flex gap-[0.75em]">
          <a
            href={empresa.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-[0.75em] bg-[#1a1b22] text-[#ffffff] text-[0.75em] font-black uppercase tracking-[0.1em] hover:bg-[#ffffff] hover:text-[#1a1b22] border-[2px] border-[#1a1b22] transition-colors"
          >
            VER EN GOOGLE MAPS
          </a>
          <button
            onClick={onClose}
            className="flex-1 py-[0.75em] bg-[#ffffff] text-[#1a1b22] text-[0.75em] font-black uppercase tracking-[0.1em] border-[2px] border-[#1a1b22] hover:bg-[#1a1b22] hover:text-[#ffffff] transition-colors"
          >
            CERRAR
          </button>
        </div>
      </div>
    </div>
  );
}
