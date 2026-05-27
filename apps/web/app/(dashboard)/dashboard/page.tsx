"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, Building2, Users } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";

function formatearFechaRelativa(fechaStr: string | null | undefined): string {
  if (!fechaStr) return "Sin fecha";
  const fecha = new Date(fechaStr);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(ayer.getDate() - 1);

  if (fecha.toDateString() === hoy.toDateString()) return "Hoy";
  if (fecha.toDateString() === ayer.toDateString()) return "Ayer";
  return fecha.toLocaleDateString("es-CL");
}

export default function DashboardPage() {
  const [analisisData, setAnalisisData] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const userRes = await fetch("/api/empresa/perfil");
        let tiendaId: number | null = null;

        if (userRes.ok) {
          const userJson = await userRes.json();
          setUserData(userJson.data);
          const tiendas = userJson.data?.tiendas;
          if (tiendas && tiendas.length > 0) {
            tiendaId = tiendas[0].id;
          }
        }

        if (tiendaId) {
          const [analysisRes, analyticsRes] = await Promise.all([
            fetch(`/api/analisis?tiendaId=${tiendaId}`),
            fetch(`/api/analytics?tiendaId=${tiendaId}`),
          ]);

          if (analysisRes.ok) {
            const analysisJson = await analysisRes.json();
            setAnalisisData(analysisJson.data || []);
          }

          if (analyticsRes.ok) {
            const analyticsJson = await analyticsRes.json();
            setAnalyticsData(analyticsJson);
          }
        } else {
          const analysisRes = await fetch("/api/analisis");
          if (analysisRes.ok) {
            const analysisJson = await analysisRes.json();
            setAnalisisData(analysisJson.data || []);
          }
        }
      } catch (error) {
        console.error("Error conectando con la base de datos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const precioPromedioMercado = (() => {
    if (!analyticsData?.preciosPromedios?.length) return null;
    const proms = analyticsData.preciosPromedios;
    const total = proms.reduce(
      (sum: number, e: any) => sum + e.precioPromedio,
      0,
    );
    return Math.round(total / proms.length);
  })();

  const ultimoAnalisis =
    analisisData.length > 0
      ? analisisData.reduce((latest: any, item: any) =>
          new Date(item.fechaEjecucion || 0) >
          new Date(latest.fechaEjecucion || 0)
            ? item
            : latest,
        )
      : null;

  const totalCompetidores = (() => {
    if (!ultimoAnalisis?.payloadData?.empresas?.length) return null;
    return ultimoAnalisis.payloadData.empresas.length - 1;
  })();

  const variacionPrecio = (() => {
    const evol = analyticsData?.evolucionPrecios;
    const data = evol?.categoria1?.data;
    if (!data || data.length < 2) return null;
    const first = data[0].precioPromedio;
    const last = data[data.length - 1].precioPromedio;
    if (!first) return null;
    return (((last - first) / first) * 100).toFixed(1);
  })();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <RefreshCw className="h-8 w-8 animate-spin text-[#725950] mb-4" />
        <span
          className="text-[#4f4441]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Cargando dashboard...
        </span>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        pageTitle={<>DASHBOARD DE<br/>COMPETENCIA</>}
        pageDescription={userData?.nombre || "PymeTracker Inteligencia"}
      />
      <div className="p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-5xl mx-auto">

        {/* Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#fedcd0]/50 rounded-xl">
                <Building2 className="h-5 w-5 text-[#725950]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                Precio Promedio
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span
                className="text-3xl font-bold text-[#725950]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {precioPromedioMercado != null
                  ? `$${precioPromedioMercado.toLocaleString("es-CL")}`
                  : "—"}
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#dbe3f1]/50 rounded-xl">
                <Users className="h-5 w-5 text-[#575f6b]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                Competidores
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span
                className="text-3xl font-bold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {totalCompetidores != null ? totalCompetidores : "—"}
              </span>
              <span className="text-xs font-medium text-[#725950] bg-[#fedcd0]/30 px-2 py-1 rounded-full">
                Último scraping
              </span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#e3e3e3]/50 rounded-xl">
                <RefreshCw className="h-5 w-5 text-[#5d5f5f]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                Último Análisis
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span
                className="text-3xl font-bold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {formatearFechaRelativa(ultimoAnalisis?.fechaEjecucion)}
              </span>
              <span className="text-xs font-medium text-[#575f6b] bg-[#dbe3f1]/30 px-2 py-1 rounded-full">
                {ultimoAnalisis?.status || "—"}
              </span>
            </div>
          </div>
        </section>

        {/* Historial Table */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 overflow-hidden shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
          <div className="p-6 border-b border-[#e4e2e2]">
            <h3
              className="text-lg font-semibold text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Historial de Análisis Recientes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f3f3]/50">
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                    ID Análisis
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                    Tienda Analizada
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e2e2]">
                {analisisData.length > 0 ? (
                  analisisData.map((item: any, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-[#f5f3f3]/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#1b1c1c]">
                        #00{item.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4441]">
                        Tienda ID: {item.tiendaId}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-semibold uppercase px-3 py-1 rounded-full ${
                            item.status === "completed"
                              ? "bg-[#dbe3f1]/50 text-[#575f6b] border border-[#dbe3f1]"
                              : "bg-[#fedcd0]/30 text-[#725950] border border-[#fedcd0]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#725950]">
                        {new Date(item.fechaEjecucion).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-[#817470]"
                    >
                      No hay análisis registrados en la base de datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
