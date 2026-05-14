"use client";

import { useEffect, useState } from "react";
import GraficoPromedioPrecio from "../../components/analytics/GraficoPromedioPrecio";
import GraficoComparativaProductos from "../../components/analytics/GraficoComparativaProductos";
import GraficoComposicionOferta from "../../components/analytics/GraficoComposicionOferta";
import GraficoEvolucionPrecio from "../../components/analytics/GraficoEvolucionPrecio";

export default function AnalisisPage() {
  const [data, setData] = useState<{
    preciosPromedios: any[];
    comparativaProductos: any[];
    labels: { categoria1: string; categoria2: string };
    composicionOferta: any[];
    evolucionPrecios: {
      categoria1: { label: string; data: { fecha: string; precioPromedio: number }[] };
      categoria2: { label: string; data: { fecha: string; precioPromedio: number }[] };
    } | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics?tiendaId=1");
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const showEvolution = data?.evolucionPrecios && (
    data.evolucionPrecios.categoria1.data.length > 0 ||
    data.evolucionPrecios.categoria2.data.length > 0
  );

  return (
    <div className="flex-grow flex flex-col items-center p-10 w-full max-w-6xl mx-auto gap-10">
      <div className="bg-white border-2 border-black w-full p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="encabezado">
          <h2 className="text-3xl font-black uppercase tracking-widest">
            Panel de Datos
          </h2>
        </div>
        <p className="subtitulo mt-2">Métricas y estadísticas del sistema</p>
      </div>

      {loading ? (
        <div className="bg-white border-2 border-black w-full p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center font-bold uppercase tracking-widest">
          Cargando datos...
        </div>
      ) : error ? (
        <div className="bg-white border-2 border-red-500 w-full p-8 shadow-[12px_12px_0px_0px_rgba(239,68,68,1)] text-center font-bold text-red-500 uppercase tracking-widest">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px]">
              <div className="encabezado mb-4">
                <h2 className="text-xl font-black uppercase text-center">
                  Precio Promedio por Restaurante
                </h2>
              </div>
              <div className="flex-1 min-h-0">
                <GraficoPromedioPrecio data={data?.preciosPromedios || []} />
              </div>
            </div>

            <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px]">
              <div className="encabezado mb-4">
                <h2 className="text-xl font-black uppercase text-center">
                  Composición de la Oferta
                </h2>
              </div>
              <div className="flex-1 min-h-0">
                <GraficoComposicionOferta data={data?.composicionOferta || []} />
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[500px]">
            <div className="encabezado mb-4">
              <h2 className="text-xl font-black uppercase text-center">
                Comparativa: {data?.labels?.categoria1 || "Cat. 1"} vs {data?.labels?.categoria2 || "Cat. 2"}
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <GraficoComparativaProductos
                data={data?.comparativaProductos || []}
                labels={data?.labels || { categoria1: "Cat. 1", categoria2: "Cat. 2" }}
              />
            </div>
          </div>

          {showEvolution && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
              <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[400px]">
                <div className="encabezado mb-4">
                  <h2 className="text-lg font-black uppercase text-center">
                    Evolución: {data?.evolucionPrecios?.categoria1?.label || "Cat. 1"}
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <GraficoEvolucionPrecio
                    data={data?.evolucionPrecios?.categoria1?.data || []}
                    label={data?.evolucionPrecios?.categoria1?.label || "Cat. 1"}
                    color="#000000"
                  />
                </div>
              </div>

              <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[400px]">
                <div className="encabezado mb-4">
                  <h2 className="text-lg font-black uppercase text-center">
                    Evolución: {data?.evolucionPrecios?.categoria2?.label || "Cat. 2"}
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <GraficoEvolucionPrecio
                    data={data?.evolucionPrecios?.categoria2?.data || []}
                    label={data?.evolucionPrecios?.categoria2?.label || "Cat. 2"}
                    color="#888888"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}