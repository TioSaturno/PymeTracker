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
      completed: "bg-green-100 text-green-800 border-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      running: "bg-blue-100 text-blue-800 border-blue-300",
      failed: "bg-red-100 text-red-800 border-red-300",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="flex-grow flex flex-col items-center p-10 w-full max-w-4xl mx-auto gap-8">
      <div className="bg-white border-2 border-black w-full p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="encabezado">
          <h2 className="text-3xl font-black uppercase tracking-widest">
            Historial de Ejecuciones
          </h2>
        </div>
        <p className="subtitulo mt-2">Últimos 8 análisis del sistema</p>
      </div>

      {loading ? (
        <div className="bg-white border-2 border-black w-full p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center font-bold uppercase tracking-widest">
          Cargando historial...
        </div>
      ) : error ? (
        <div className="bg-white border-2 border-red-500 w-full p-8 shadow-[12px_12px_0px_0px_rgba(239,68,68,1)] text-center font-bold text-red-500 uppercase tracking-widest">
          {error}
        </div>
      ) : executions.length === 0 ? (
        <div className="bg-white border-2 border-black w-full p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center font-bold uppercase tracking-widest">
          No hay ejecuciones registradas
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {executions.map((exec) => (
            <div
              key={exec.id}
              className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === exec.id ? null : exec.id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{exec.summary}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(exec.fechaEjecucion)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 border-2 text-xs font-bold uppercase ${getStatusBadge(exec.status)}`}>
                      {exec.status}
                    </span>
                    <span className="text-2xl">
                      {expandedId === exec.id ? "−" : "+"}
                    </span>
                  </div>
                </div>
              </div>

              {expandedId === exec.id && exec.payload && (
                <div className="border-t-2 border-black p-6 bg-gray-50">
                  {exec.payload.busqueda && (
                    <div className="mb-4">
                      <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">Búsqueda</h4>
                      <p><span className="font-semibold">Tema:</span> {exec.payload.busqueda.tema}</p>
                      <p><span className="font-semibold">Ubicación:</span> {exec.payload.busqueda.ubicacion}</p>
                    </div>
                  )}

                  {exec.payload.analisis_tienda_base && (
                    <div className="mb-4">
                      <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">Tu Tienda</h4>
                      <p className="font-semibold">{exec.payload.analisis_tienda_base.nombre}</p>
                      {exec.payload.analisis_tienda_base.ubicacion && (
                        <p className="text-sm text-gray-600">
                          {exec.payload.analisis_tienda_base.ubicacion}
                        </p>
                      )}
                    </div>
                  )}

                  {exec.payload.empresas && exec.payload.empresas.length > 0 && (
                    <div>
                      <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">
                        Competidores ({exec.payload.empresas.length})
                      </h4>
                      <div className="space-y-3">
                        {exec.payload.empresas.map((empresa, idx) => (
                          <div key={idx} className="border border-gray-300 p-3 bg-white">
                            <p className="font-semibold">{empresa.nombre}</p>
                            {empresa.ubicacion && (
                              <p className="text-sm text-gray-600">
                                {empresa.ubicacion}
                              </p>
                            )}
                            {empresa.calificaciones && (
                              <p className="text-sm mt-1">
                                <span className="font-medium">Rating:</span> {empresa.calificaciones.rating}/5 ({empresa.calificaciones.total_resenas} reseñas)
                              </p>
                            )}
                            {empresa.precios && empresa.precios.length > 0 && (
                              <p className="text-sm mt-1">
                                <span className="font-medium">Productos encontrados:</span> {empresa.precios.length}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {exec.payload.mas_valorado && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">Lo más valorado</h4>
                      <p className="text-sm">{exec.payload.mas_valorado}</p>
                    </div>
                  )}

                  {exec.payload.mas_criticado && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="font-bold uppercase text-xs text-gray-500 mb-2">Lo más criticado</h4>
                      <p className="text-sm">{exec.payload.mas_criticado}</p>
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
          className="inline-block px-6 py-3 bg-black text-white border-2 border-black font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
        >
          ← Volver al Panel
        </Link>
      </div>
    </div>
  );
}