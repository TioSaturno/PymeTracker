"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Busqueda {
  tema: string;
  ubicacion: string;
}

interface Calificaciones {
  rating: number;
  total_resenas: number;
  ultimas_resenas: string[];
  rango_precio_gmaps: string;
}

interface Precio {
  producto: string;
  precio: number;
  imagen_url: string | null;
}

interface Empresa {
  id: number;
  nombre: string;
  precios: Precio[] | null;
  sitio_web: string | null;
  ubicacion: string;
  calificaciones: Calificaciones;
  google_maps_url: string;
}

interface AnalisisTiendaBase {
  nombre: string;
  ubicacion: string;
  calificaciones?: Calificaciones;
}

interface PayloadData {
  fecha: string;
  busqueda: Busqueda;
  empresas: Empresa[];
  mas_valorado: string | null;
  mas_criticado: string | null;
  analisis_tienda_base: AnalisisTiendaBase | null;
  total_empresas: number;
}

interface Execution {
  id: number;
  fechaEjecucion: string;
  status: string;
  summary: string;
  payload: PayloadData;
}

export default function HistorialPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analisis/historial");
        if (!response.ok) {
          throw new Error("Error al obtener el historial");
        }
        const result = await response.json();
        setExecutions(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-[#e3e3e3]/40 text-[#5d5f5f] border-[#e4e2e2]",
      pending: "bg-[#fedcd0]/40 text-[#725950] border-[#fedcd0]",
      running: "bg-[#dbe3f1]/40 text-[#575f6b] border-[#dbe3f1]",
      failed: "bg-[#ffdad6]/40 text-[#93000a] border-[#ffdad6]",
    };
    return styles[status] || "bg-[#f5f3f3] text-[#4f4441] border-[#e4e2e2]";
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="border-b border-[#e4e2e2] bg-white/60 backdrop-blur-xl px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#817470] m-0">
          PYMETRACKER
        </p>
        <h1 className="text-3xl font-semibold text-[#1b1c1c] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          HISTORIAL DE
          <br />
          ANÁLISIS
        </h1>
      </div>

      <main className="flex-grow flex flex-col items-center p-8 w-full max-w-4xl mx-auto gap-6">
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] w-full p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center font-semibold text-[#4f4441]">
            Cargando historial...
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#ffdad6] w-full p-8 shadow-[0_8px_30px_rgb(186,26,26,0.04)] text-center font-semibold text-[#ba1a1a]">
            {error}
          </div>
        ) : executions.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] w-full p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center font-semibold text-[#4f4441]">
            No hay ejecuciones registradas
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {executions.map((exec) => (
              <div
                key={exec.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-[#f5f3f3]/50 transition-colors"
                  onClick={() => setExpandedId(expandedId === exec.id ? null : exec.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-[#1b1c1c]">{exec.summary}</p>
                      <p className="text-sm text-[#4f4441] mt-1">
                        {formatDate(exec.fechaEjecucion)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 border rounded-full text-xs font-semibold uppercase ${getStatusBadge(exec.status)}`}>
                        {exec.status}
                      </span>
                      <span className="text-2xl text-[#817470]">
                        {expandedId === exec.id ? "−" : "+"}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedId === exec.id && exec.payload && (
                  <div className="border-t border-[#e4e2e2] p-6 bg-[#f5f3f3]/30">
                    {exec.payload.busqueda && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-xs text-[#817470] uppercase mb-2">Búsqueda</h4>
                        <p className="text-[#4f4441]"><span className="font-semibold text-[#1b1c1c]">Tema:</span> {exec.payload.busqueda.tema}</p>
                        <p className="text-[#4f4441]"><span className="font-semibold text-[#1b1c1c]">Ubicación:</span> {exec.payload.busqueda.ubicacion}</p>
                      </div>
                    )}

                    {exec.payload.analisis_tienda_base && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-xs text-[#817470] uppercase mb-2">Tu Tienda</h4>
                        <p className="font-semibold text-[#1b1c1c]">{exec.payload.analisis_tienda_base.nombre}</p>
                        {exec.payload.analisis_tienda_base.ubicacion && (
                          <p className="text-sm text-[#4f4441]">
                            {exec.payload.analisis_tienda_base.ubicacion}
                          </p>
                        )}
                      </div>
                    )}

                    {exec.payload.empresas && exec.payload.empresas.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-xs text-[#817470] uppercase mb-2">
                          Competidores ({exec.payload.empresas.length})
                        </h4>
                        <div className="space-y-3">
                          {exec.payload.empresas.map((empresa, idx) => (
                            <div key={idx} className="border border-[#e4e2e2] rounded-xl p-3 bg-white/60">
                              <p className="font-semibold text-[#1b1c1c]">{empresa.nombre}</p>
                              {empresa.ubicacion && (
                                <p className="text-sm text-[#4f4441]">
                                  {empresa.ubicacion}
                                </p>
                              )}
                              {empresa.calificaciones && (
                                <p className="text-sm mt-1 text-[#4f4441]">
                                  <span className="font-medium text-[#1b1c1c]">Rating:</span> {empresa.calificaciones.rating}/5 ({empresa.calificaciones.total_resenas} reseñas)
                                </p>
                              )}
                              {empresa.precios && empresa.precios.length > 0 && (
                                <p className="text-sm mt-1 text-[#4f4441]">
                                  <span className="font-medium text-[#1b1c1c]">Productos encontrados:</span> {empresa.precios.length}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {exec.payload.mas_valorado && (
                      <div className="mt-4 pt-4 border-t border-[#e4e2e2]">
                        <h4 className="font-semibold text-xs text-[#817470] uppercase mb-2">Lo más valorado</h4>
                        <p className="text-sm text-[#4f4441]">{exec.payload.mas_valorado}</p>
                      </div>
                    )}

                    {exec.payload.mas_criticado && (
                      <div className="mt-4 pt-4 border-t border-[#e4e2e2]">
                        <h4 className="font-semibold text-xs text-[#817470] uppercase mb-2">Lo más criticado</h4>
                        <p className="text-sm text-[#4f4441]">{exec.payload.mas_criticado}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <Link 
            href="/analisis" 
            className="inline-block px-6 py-3 bg-[#725950] text-white rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
          >
            ← Volver al Panel
          </Link>
        </div>
      </main>
    </div>
  );
}
