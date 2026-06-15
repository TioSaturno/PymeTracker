"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/app/components/PageHeader";
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
                ? "text-[#725950]"
                : half
                  ? "text-[#725950] opacity-50"
                  : "text-[#d3c3be]"
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
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      return;
    }
    onClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-full text-left bg-white/80 backdrop-blur-xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 rounded-2xl hover:shadow-[0_4px_16px_rgb(0,0,0,0.06)] transition-all duration-200 p-5 flex items-start justify-between gap-4 group cursor-pointer shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] mb-1">
          {empresa._meta?.busqueda?.tema ?? "NEGOCIO"}
        </p>
        <h3 className="text-base font-semibold text-[#1b1c1c] leading-tight truncate group-hover:text-[#725950] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {empresa.nombre}
        </h3>

        <a
          href={empresa.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 text-sm font-medium text-[#4f4441] hover:text-[#725950] transition-colors flex items-center gap-1 w-fit"
        >
          <span>📍</span>
          <span className="truncate max-w-[280px]">{empresa.ubicacion}</span>
        </a>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs font-semibold border border-[#e4e2e2] px-2.5 py-1 bg-[#f5f3f3]/50 text-[#4f4441] rounded-full">
            {empresa.calificaciones.total_resenas.toLocaleString("es-CL")} reseñas
          </span>
          {empresa.calificaciones.rango_precio_gmaps !== "No especificado" && (
            <span className="text-xs font-semibold border border-[#e4e2e2] px-2.5 py-1 bg-[#725950] text-white rounded-full">
              {empresa.calificaciones.rango_precio_gmaps}
            </span>
          )}
          {empresa.precios && empresa.precios.length > 0 && (
            <span className="text-xs font-semibold border border-[#fedcd0] px-2.5 py-1 bg-[#fedcd0]/30 text-[#725950] rounded-full">
              {empresa.precios.length} PRECIOS
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center flex-shrink-0 border border-[#e4e2e2] rounded-xl p-3 min-w-[5em] bg-[#f5f3f3]/30">
        <span className="text-2xl font-bold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {empresa.calificaciones.rating.toFixed(1)}
        </span>
        <StarRating rating={empresa.calificaciones.rating} />
        <span className="text-xs uppercase font-semibold tracking-wider text-[#817470] mt-1">
          / 5.0
        </span>
      </div>
    </div>
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
  const [resumenesCache, setResumenesCache] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCompetencia = async () => {
      try {
        const perfilRes = await fetch("/api/empresa/perfil");
        let tiendaId: number | null = null;

        if (perfilRes.ok) {
          const perfilJson = await perfilRes.json();
          tiendaId = perfilJson.data?.tiendaActivaId ?? null;
        }

        if (!tiendaId) {
          setError("No se encontró una tienda asociada a tu cuenta.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/competencia?tiendaId=${tiendaId}`);
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

  return (
    <>
      <main className="min-h-screen bg-[#fbf9f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader pageTitle={<>ANÁLISIS DE<br/>COMPETENCIA</>} />

        <div className="max-w-[860px] mx-auto px-6 py-8">
          {!loading && !error && empresas.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
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
                  className="bg-white/80 backdrop-blur-xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 rounded-2xl p-4 text-center shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#817470] m-0 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 mb-6 items-end">
            <div className="flex-1">
              <label
                htmlFor="search-competencia"
                className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2"
              >
                BUSCAR NEGOCIO
              </label>
              <input
                id="search-competencia"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: Sushi, Bamboo..."
                className="w-[70%] border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
              />
            </div>
            <div className="min-w-[11em]">
              <label
                htmlFor="sort-competencia"
                className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2"
              >
                ORDENAR POR
              </label>
              <select
                id="sort-competencia"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "opiniones" | "valoracion")
                }
                className="w-full border border-[#e4e2e2] rounded-xl px-3 py-3 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none cursor-pointer focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
              >
                <option value="valoracion">Mejor valorado</option>
                <option value="opiniones">Más opiniones</option>
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-[#4f4441]">
                Cargando competencia...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="border border-[#e4e2e2] bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
              <p className="text-5xl mb-2">🔍</p>
              <h2 className="text-xl font-bold text-[#1b1c1c] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Aún no ejecutas tu primer análisis
              </h2>
              <p className="text-sm text-[#4f4441] mb-6">
                Ejecuta un análisis de competencia para descubrir quiénes son tus competidores y cómo se comparan contigo.
              </p>
              <a
                href="/analisis/historial"
                className="inline-block bg-[#725950] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
              >
                Ir a ejecutar análisis →
              </a>
            </div>
          )}

          {!loading && !error && filtradas.length === 0 && (
            <div className="border border-[#e4e2e2] bg-white/80 backdrop-blur-xl rounded-2xl p-8 text-center shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
              <p className="text-5xl mb-2">🔍</p>
              <h2 className="text-xl font-bold text-[#1b1c1c] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {empresas.length === 0
                  ? "Aún no ejecutas tu primer análisis"
                  : "SIN RESULTADOS"}
              </h2>
              <p className="text-sm text-[#4f4441] mb-6">
                {empresas.length === 0
                  ? "Ejecuta un análisis de competencia para descubrir quiénes son tus competidores y cómo se comparan contigo."
                  : `No hay negocios que coincidan con "${search}".`}
              </p>
              {empresas.length === 0 && (
                <a
                  href="/analisis/historial"
                  className="inline-block bg-[#725950] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
                >
                  Ir a ejecutar análisis →
                </a>
              )}
            </div>
          )}

          {!loading && !error && filtradas.length > 0 && (
            <div className="flex flex-col gap-4">
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
      <ModalEmpresa
        empresa={selected}
        onClose={() => setSelected(null)}
        resumenesCache={resumenesCache}
        onCacheResumen={(nombre, resumen) =>
          setResumenesCache((prev) => ({ ...prev, [nombre]: resumen }))
        }
      />
    </>
  );
}