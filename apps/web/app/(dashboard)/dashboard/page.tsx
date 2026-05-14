"use client";

import React, { useEffect, useState } from 'react';
import { RefreshCw, Building2, Users } from 'lucide-react';

export default function DashboardPage() {
  const [analisisData, setAnalisisData] = useState([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [userRes, analysisRes] = await Promise.all([
          fetch('/api/auth/login'),
          fetch('/api/analisis')
        ]);

        const userJson = await userRes.json();
        const analysisJson = await analysisRes.json();

        if (userRes.ok) setUserData(userJson.data.usuario || userJson.data[0]);
        if (analysisRes.ok) setAnalisisData(analysisJson.data);
        
      } catch (error) {
        console.error("Error conectando con la base de datos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10">
        <RefreshCw className="h-8 w-8 animate-spin text-[#725950] mb-4" />
        <span className="text-[#4f4441]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Cargando dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#817470] mb-2">
            PYMETRACKER
          </p>
          <h1 
            className="text-3xl font-semibold text-[#1b1c1c] leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            DASHBOARD DE
            <br />
            COMPETENCIA
          </h1>
          <p className="text-sm mt-2 text-[#4f4441] italic">
            {userData?.empresaNombre || 'PymeTracker Inteligencia'}
          </p>
        </div>

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
                $4.250
              </span>
              <span className="text-xs font-medium text-[#ba1a1a] bg-[#ffdad6]/50 px-2 py-1 rounded-full">
                +2.4%
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
                12
              </span>
              <span className="text-xs font-medium text-[#725950] bg-[#fedcd0]/30 px-2 py-1 rounded-full">
                Activos
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
                Hoy
              </span>
              <span className="text-xs font-medium text-[#575f6b] bg-[#dbe3f1]/30 px-2 py-1 rounded-full">
                Actualizado
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
                    <tr key={idx} className="hover:bg-[#f5f3f3]/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#1b1c1c]">
                        #00{item.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4441]">
                        Tienda ID: {item.tiendaId}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-semibold uppercase px-3 py-1 rounded-full ${
                          item.status === 'completed' 
                            ? 'bg-[#dbe3f1]/50 text-[#575f6b] border border-[#dbe3f1]' 
                            : 'bg-[#fedcd0]/30 text-[#725950] border border-[#fedcd0]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#725950]">
                        {new Date(item.fechaCreacion).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-[#817470]">
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
  );
}
