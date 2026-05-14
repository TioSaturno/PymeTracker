"use client";

import { useEffect, useState } from "react";
import GraficoPromedioPrecio from "@/components/analytics/GraficoPromedioPrecio";
import GraficoComparativaProductos from "@/components/analytics/GraficoComparativaProductos";
import GraficoComposicionOferta from "@/components/analytics/GraficoComposicionOferta";
import GraficoEvolucionPrecio from "@/components/analytics/GraficoEvolucionPrecio";

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
    <div className="min-h-screen bg-[#fbf9f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="border-b border-[#e4e2e2] bg-white/60 backdrop-blur-xl px-8 py-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#817470] m-0">
          PYMETRACKER
        </p>
        <h1 className="text-3xl font-semibold text-[#1b1c1c] leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          GRÁFICAS Y
          <br />
          ANÁLISIS
        </h1>
      </div>

      <main className="flex-grow flex flex-col items-center p-8 w-full max-w-6xl mx-auto gap-8">
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] w-full p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center font-semibold text-[#4f4441]">
            Cargando datos...
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#ffdad6] w-full p-8 shadow-[0_8px_30px_rgb(186,26,26,0.04)] text-center font-semibold text-[#ba1a1a]">
            {error}
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[500px]">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-[#1b1c1c] text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Precio Promedio por Restaurante
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <GraficoPromedioPrecio data={data?.preciosPromedios || []} />
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[500px]">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-[#1b1c1c] text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Composición de la Oferta
                  </h2>
                </div>
                <div className="flex-1 min-h-0">
                  <GraficoComposicionOferta data={data?.composicionOferta || []} />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[500px]">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[#1b1c1c] text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[400px]">
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-[#1b1c1c] text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Evolución: {data?.evolucionPrecios?.categoria1?.label || "Cat. 1"}
                    </h2>
                  </div>
                  <div className="flex-1 min-h-0">
                    <GraficoEvolucionPrecio
                      data={data?.evolucionPrecios?.categoria1?.data || []}
                      label={data?.evolucionPrecios?.categoria1?.label || "Cat. 1"}
                      color="#725950"
                    />
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-[400px]">
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-[#1b1c1c] text-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Evolución: {data?.evolucionPrecios?.categoria2?.label || "Cat. 2"}
                    </h2>
                  </div>
                  <div className="flex-1 min-h-0">
                    <GraficoEvolucionPrecio
                      data={data?.evolucionPrecios?.categoria2?.data || []}
                      label={data?.evolucionPrecios?.categoria2?.label || "Cat. 2"}
                      color="#575f6b"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
