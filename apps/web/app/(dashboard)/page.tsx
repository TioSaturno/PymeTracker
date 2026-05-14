"use client";

import {
  Users,
  Search,
  Bell,
  Settings,
  CircleUser,
  RefreshCw,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [datos, setDatos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtro, setFiltro] = useState<"ambos" | "mi_negocio" | "competencia">(
    "ambos",
  );

  const router = useRouter();

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/valoracion");

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setDatos(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-[#725950] mb-4" />{" "}
        <span className="text-[#4f4441]" style={{ fontFamily: "'Inter', sans-serif" }}>Cargando análisis...</span>
      </div>
    );
  if (error)
    return <div className="p-10 text-center text-[#ba1a1a]" style={{ fontFamily: "'Inter', sans-serif" }}>Error: {error}</div>;
  if (!datos)
    return <div className="p-10 text-center text-[#4f4441]" style={{ fontFamily: "'Inter', sans-serif" }}>No hay datos disponibles.</div>;

  const miNegocio = datos.mi_negocio;
  const competidores = datos.competencia || [];
  const competenciaPrincipal = competidores[0];

  let resenasMostradas = [];

  if (filtro === "ambos" || filtro === "mi_negocio") {
    const misResenas = (miNegocio.calificaciones?.ultimas_resenas || [])
      .slice(0, 10)
      .map((texto: string) => ({
        texto,
        esPropio: true,
        nombre: miNegocio.nombre,
      }));
    resenasMostradas.push(...misResenas);
  }

  if (
    (filtro === "ambos" || filtro === "competencia") &&
    competenciaPrincipal
  ) {
    const resenasCompetencia = (
      competenciaPrincipal.calificaciones?.ultimas_resenas || []
    )
      .slice(0, 10)
      .map((texto: string) => ({
        texto,
        esPropio: false,
        nombre: competenciaPrincipal.nombre,
      }));
    resenasMostradas.push(...resenasCompetencia);
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <main className="flex-1 p-8 bg-[#fbf9f8]">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Análisis de {miNegocio.nombre}
              </h2>
              <p className="text-[#4f4441] text-sm italic mt-1">
                Basado en el último reporte generado (
                {new Date(datos.fecha_analisis).toLocaleDateString()})
              </p>
            </div>
            <button
              onClick={cargarDatos}
              className="bg-[#725950] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 mb-8 flex flex-col md:flex-row gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#dbe3f1]/50 rounded-xl">
                    <Building2 className="h-6 w-6 text-[#575f6b]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Mi Negocio</h3>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-[#725950]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {miNegocio.calificaciones?.rating || "0.0"}
                  </span>
                  <p className="text-[10px] text-[#817470] font-semibold uppercase mt-1">
                    Rating Google
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#4f4441] font-semibold uppercase mb-4">
                Total Reseñas: {miNegocio.calificaciones?.total_resenas || 0}
              </p>

              <div className="space-y-3">
                {datos.mas_valorado && (
                  <div>
                    <p className="text-[10px] text-[#817470] font-semibold uppercase mb-1">
                      Fortalezas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof datos.mas_valorado === "string"
                        ? datos.mas_valorado
                            .split(/[.,] y |[.,]/)
                            .filter(Boolean)
                            .slice(0, 5)
                        : Array.isArray(datos.mas_valorado)
                          ? datos.mas_valorado
                          : []
                      ).map((item: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#e3e3e3]/40 text-[#5d5f5f] text-[10px] font-semibold rounded-full border border-[#e4e2e2]"
                        >
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {datos.mas_criticado && (
                  <div>
                    <p className="text-[10px] text-[#817470] font-semibold uppercase mb-1">
                      Debilidades
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(typeof datos.mas_criticado === "string"
                        ? datos.mas_criticado
                            .split(/[.,] y |[.,]/)
                            .filter(Boolean)
                            .slice(0, 5)
                        : Array.isArray(datos.mas_criticado)
                          ? datos.mas_criticado
                          : []
                      ).map((item: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#ffdad6]/40 text-[#93000a] text-[10px] font-semibold rounded-full border border-[#ffdad6]"
                        >
                          {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block w-px bg-[#e4e2e2]"></div>

            <div className="flex-1">
              {competenciaPrincipal ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#f5f3f3] rounded-xl">
                        <Users className="h-6 w-6 text-[#575f6b]" />
                      </div>
                      <h3
                        className="text-lg font-semibold text-[#1b1c1c] truncate max-w-[200px]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        title={competenciaPrincipal.nombre}
                      >
                        {competenciaPrincipal.nombre}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-[#575f6b]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {competenciaPrincipal.calificaciones?.rating || "0.0"}
                      </span>
                      <p className="text-[10px] text-[#817470] font-semibold uppercase mt-1">
                        Competencia
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#4f4441] font-semibold uppercase mb-4">
                    Total Reseñas:{" "}
                    {competenciaPrincipal.calificaciones?.total_resenas || 0}
                  </p>

                  <div className="space-y-3">
                    {datos.mas_valorado && (
                      <div>
                        <p className="text-[10px] text-[#817470] font-semibold uppercase mb-1">
                          Fortalezas
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(typeof datos.mas_valorado === "string"
                            ? datos.mas_valorado
                                .split(/[.,] y |[.,]/)
                                .filter(Boolean)
                                .slice(2, 5)
                            : []
                          ).map((item: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#e3e3e3]/40 text-[#5d5f5f] text-[10px] font-semibold rounded-full border border-[#e4e2e2]"
                            >
                              {item.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {datos.mas_criticado && (
                      <div>
                        <p className="text-[10px] text-[#817470] font-semibold uppercase mb-1">
                          Debilidades
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(typeof datos.mas_criticado === "string"
                            ? datos.mas_criticado
                                .split(/[.,] y |[.,]/)
                                .filter(Boolean)
                                .slice(1, 4)
                            : []
                          ).map((item: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#ffdad6]/40 text-[#93000a] text-[10px] font-semibold rounded-full border border-[#ffdad6]"
                            >
                              {item.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[#817470] italic text-sm">
                    No hay competidores analizados.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Feed de Análisis Real
            </h3>
            <div className="flex bg-[#f5f3f3] p-1 rounded-xl border border-[#e4e2e2]">
              <button
                onClick={() => setFiltro("ambos")}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filtro === "ambos" ? "bg-white shadow-sm text-[#1b1c1c]" : "text-[#4f4441] hover:text-[#1b1c1c]"}`}
              >
                Ambos
              </button>
              <button
                onClick={() => setFiltro("mi_negocio")}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filtro === "mi_negocio" ? "bg-white shadow-sm text-[#1b1c1c]" : "text-[#4f4441] hover:text-[#1b1c1c]"}`}
              >
                Mi Negocio
              </button>
              <button
                onClick={() => setFiltro("competencia")}
                disabled={!competenciaPrincipal}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${filtro === "competencia" ? "bg-white shadow-sm text-[#1b1c1c]" : "text-[#4f4441] hover:text-[#1b1c1c]"} ${!competenciaPrincipal ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Competencia
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {resenasMostradas.length > 0 ? (
              resenasMostradas.map((resena, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 flex flex-col gap-4 hover:border-[#d3c3be] transition-all duration-200 shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-[#f5f3f3] rounded-full flex items-center justify-center font-semibold text-[#817470] border border-[#e4e2e2]">
                        G
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1b1c1c] text-sm">
                          Reseña de Google Maps
                        </h4>
                        <p className="text-xs text-[#4f4441]">
                          {resena.esPropio ? "Tu negocio" : "Competencia"} •{" "}
                          {resena.nombre}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`text-[9px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${resena.esPropio ? "bg-[#725950] text-white" : "bg-[#f5f3f3] text-[#4f4441] border border-[#e4e2e2]"}`}
                      >
                        {resena.esPropio ? "Mi Negocio" : "Competencia"}
                      </span>
                      <span className="text-[10px] text-[#817470] font-medium">
                        Vía Google Maps
                      </span>
                    </div>
                  </div>
                  <p className="text-[#4f4441] text-sm leading-relaxed italic">
                    "{resena.texto}"
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/60 backdrop-blur-xl border border-dashed border-[#d3c3be] rounded-2xl">
                <p className="text-[#4f4441]">
                  No hay reseñas para mostrar con el filtro actual.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
