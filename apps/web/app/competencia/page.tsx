"use client";

import { useState, useEffect } from "react";
import ModalEmpresa, {
  type Empresa,
} from "@/app/components/competencia/ModalEmpresa";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[0.2em]">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <span
            key={star}
            className={`text-[1em] ${
              filled
                ? "text-[#f59e0b]"
                : half
                  ? "text-[#f59e0b] opacity-50"
                  : "text-[#d1d5db]"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function EmpresaCard({
  empresa,
  onClick,
}: {
  empresa: Empresa;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-[100%] text-left bg-[#ffffff] border-[2px] border-[#1a1b22] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-[150ms] p-[1.25em] flex items-start justify-between gap-[1em] group cursor-pointer"
    >
      {/* Info izquierda */}
      <div className="flex-1 min-w-0">
        <p className="text-[0.6em] font-black uppercase tracking-[0.2em] text-[#666] mb-[0.25em]">
          {empresa._meta?.busqueda?.tema ?? "NEGOCIO"}
        </p>
        <h3 className="text-[1em] font-black uppercase text-[#1a1b22] m-0 leading-tight truncate group-hover:underline">
          {empresa.nombre}
        </h3>

        {/* Ubicación clicable separado */}
        <a
          href={empresa.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-[0.5em] text-[0.75em] font-bold text-[#1a1b22] underline hover:text-[#f59e0b] transition-colors flex items-center gap-[0.3em] w-fit"
        >
          <span>📍</span>
          <span className="truncate max-w-[280px]">{empresa.ubicacion}</span>
        </a>

        {/* Badges */}
        <div className="flex flex-wrap gap-[0.4em] mt-[0.75em]">
          <span className="text-[0.65em] font-black uppercase tracking-[0.1em] border border-[#1a1b22] px-[0.5em] py-[0.2em] bg-[#fbf8ff]">
            {empresa.calificaciones.total_resenas.toLocaleString("es-CL")}{" "}
            reseñas
          </span>
          {empresa.calificaciones.rango_precio_gmaps !== "No especificado" && (
            <span className="text-[0.65em] font-black uppercase tracking-[0.1em] border-[1px] border-[#1a1b22] px-[0.5em] py-[0.2em] bg-[#1a1b22] text-[#ffffff]">
              {empresa.calificaciones.rango_precio_gmaps}
            </span>
          )}
          {empresa.precios && empresa.precios.length > 0 && (
            <span className="text-[0.65em] font-black uppercase tracking-[0.1em] border border-[#f59e0b] px-[0.5em] py-[0.2em] bg-[#fef3c7] text-[#92400e]">
              {empresa.precios.length} PRECIOS
            </span>
          )}
        </div>
      </div>

      {/* Rating derecho */}
      <div className="flex flex-col items-center flex-shrink-0 border-2 border-[#1a1b22] p-[0.75em] min-w-[5em]">
        <span className="text-[1.8em] font-black text-[#1a1b22] leading-none">
          {empresa.calificaciones.rating.toFixed(1)}
        </span>
        <StarRating rating={empresa.calificaciones.rating} />
        <span className="text-[0.55em] uppercase font-black tracking-[0.1em] text-[#666] mt-[0.2em]">
          / 5.0
        </span>
      </div>
    </button>
  );
}

export default function Competencia() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Empresa | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"opiniones" | "valoracion">(
    "valoracion",
  );

  useEffect(() => {
    const fetchCompetencia = async () => {
      try {
        // el id del user y la tienda estan hardcodeados por ahora
        const res = await fetch("/api/competencia?userId=1&tiendaId=1");
        if (!res.ok) throw new Error("Error al obtener datos");
        const data = await res.json();
        setEmpresas(data.empresas ?? []);
      } catch (err) {
        setError("No se pudo cargar la información de la competencia.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetencia();
  }, []);

  const filtradas = empresas
    .filter((e) => e.nombre.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "opiniones"
        ? b.calificaciones.total_resenas - a.calificaciones.total_resenas
        : b.calificaciones.rating - a.calificaciones.rating,
    );

  const promedioRating =
    empresas.length > 0
      ? (
          empresas.reduce((acc, e) => acc + e.calificaciones.rating, 0) /
          empresas.length
        ).toFixed(1)
      : "—";

  console.log(empresas);

  return (
    <>
      <main className="min-h-[100vh] bg-[#fbf8ff] font-['Inter',sans-serif]">
        {/* Header */}
        <div className="border-b-[2px] border-[#1a1b22] bg-[#ffffff] px-[2em] py-[1.5em]">
          <p className="text-[0.65em] font-black uppercase tracking-[0.25em] text-[#666] m-0">
            PYMETRACKER
          </p>
          <h1 className="text-[2em] font-black uppercase text-[#1a1b22] m-0 leading-tight">
            ANÁLISIS DE
            <br />
            COMPETENCIA
          </h1>
        </div>

        <div className="max-w-[860px] mx-auto px-[1.5em] py-[2em]">
          {/* Métricas summary */}
          {!loading && !error && empresas.length > 0 && (
            <div className="grid grid-cols-3 gap-[1em] mb-[2em]">
              {[
                { label: "COMPETIDORES", value: empresas.length.toString() },
                { label: "RATING PROMEDIO", value: promedioRating },
                {
                  label: "CON PRECIOS",
                  value: empresas
                    .filter((e) => e.precios && e.precios.length > 0)
                    .length.toString(),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#ffffff] border-[2px] border-[#1a1b22] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-[1em] text-center"
                >
                  <p className="text-[0.6em] font-black uppercase tracking-[0.15em] text-[#666] m-0 mb-[0.25em]">
                    {stat.label}
                  </p>
                  <p className="text-[2em] font-black text-[#1a1b22] m-0 leading-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Buscador + Ordenar */}
          <div className="flex gap-[1em] mb-[1.5em] items-end">
            <div className="flex-1">
              <label
                htmlFor="search-competencia"
                className="block text-[0.65em] font-black uppercase tracking-[0.2em] text-[#666] mb-[0.4em]"
              >
                BUSCAR NEGOCIO
              </label>
              <input
                id="search-competencia"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: Sushi, Bamboo..."
                className="w-[70%] border-[2px] border-[#1a1b22] px-[1em] py-[0.75em] text-[0.9em] font-bold text-[#1a1b22] bg-[#ffffff] outline-none placeholder:text-[#aaa] placeholder:font-normal"
              />
            </div>
            <div className="min-w-[11em]">
              <label
                htmlFor="sort-competencia"
                className="block text-[0.65em] font-black uppercase tracking-[0.2em] text-[#666] mb-[0.4em]"
              >
                ORDENAR POR
              </label>
              <select
                id="sort-competencia"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "opiniones" | "valoracion")
                }
                className="w-[100%] border-[2px] border-[#1a1b22] px-[0.75em] py-[0.75em] text-[0.85em] font-bold text-[#1a1b22] bg-[#ffffff] outline-none cursor-pointer appearance-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
              >
                <option value="valoracion">Mejor valorado</option>
                <option value="opiniones">Más opiniones</option>
              </select>
            </div>
          </div>

          {/* Estado: loading */}
          {loading && (
            <div className="flex flex-col gap-[1em]">
              <p className="text-[0.9em] font-bold text-[#1a1b22] m-0">
                Cargando competencia...
              </p>
            </div>
          )}

          {/* Estado: error */}
          {!loading && error && (
            <div className="border-[2px] border-[#ef4444] bg-[#ffffff] shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] p-[1.5em]">
              <p className="text-[0.65em] font-black uppercase tracking-[0.2em] text-[#ef4444] m-0 mb-[0.3em]">
                ERROR
              </p>
              <p className="text-[0.9em] font-bold text-[#1a1b22] m-0">
                {error}
              </p>
            </div>
          )}

          {/* Estado: sin resultados */}
          {!loading && !error && filtradas.length === 0 && (
            <div className="border-[2px] border-[#1a1b22] bg-[#ffffff] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-[2em] text-center">
              <p className="text-[2em] m-0">🔍</p>
              <p className="text-[0.65em] font-black uppercase tracking-[0.2em] text-[#666] mt-[0.5em] m-0">
                {empresas.length === 0
                  ? "SIN DATOS DISPONIBLES"
                  : "SIN RESULTADOS"}
              </p>
              <p className="text-[0.85em] text-[#666] mt-[0.5em] m-0">
                {empresas.length === 0
                  ? "No se encontró información de competencia para esta tienda."
                  : `No hay negocios que coincidan con "${search}".`}
              </p>
            </div>
          )}

          {/* Lista de empresas */}
          {!loading && !error && filtradas.length > 0 && (
            <div className="flex flex-col gap-[1em]">
              {filtradas.map((empresa, i) => (
                <EmpresaCard
                  key={i}
                  empresa={empresa}
                  onClick={() => setSelected(empresa)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      {/* Modal */}
      <ModalEmpresa empresa={selected} onClose={() => setSelected(null)} />
    </>
  );
}
