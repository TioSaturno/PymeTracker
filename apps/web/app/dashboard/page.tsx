"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  // 1. Estados para los datos reales
  const [analisisData, setAnalisisData] = useState([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 2. Carga de datos desde los endpoints de Cristóbal
  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Traemos datos del usuario (Login/Auth) y los análisis simultáneamente
        const [userRes, analysisRes] = await Promise.all([
          fetch('/api/auth/login'), // Ajustar según el endpoint de perfil de Cristóbal
          fetch('/api/analisis')
        ]);

        const userJson = await userRes.json();
        const analysisJson = await analysisRes.json();

        if (userRes.ok) setUserData(userJson.data.usuario || userJson.data[0]);
        if (analysisRes.ok) setAnalisisData(analysisJson.data);
        
      } catch (error) {
        console.error("Error conectando con la base de datos de Javier:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#c3c6d5] flex flex-col h-screen sticky top-0 bg-white">
        <div className="px-8 py-10">
          <h1 className="text-xl font-black uppercase tracking-tighter text-[#0047ab]">
            Pyme <span className="text-[#191c1e]">Tracker</span>
          </h1>
        </div>
        
        <nav className="flex-grow px-4 space-y-2">
          <a className="flex items-center gap-3 px-4 py-3 font-bold text-sm bg-[#0047ab] text-white rounded-lg" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <Link className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-[#434653] hover:bg-[#eceef0] rounded-lg" href="/perfil/edit">
            <span className="material-symbols-outlined">person</span>
            <span>Mi Perfil</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-[#434653] hover:bg-[#eceef0] rounded-lg" href="#">
            <span className="material-symbols-outlined">analytics</span>
            <span>Competencia</span>
          </a>
        </nav>

        {/* Perfil del Usuario (Dinámico) */}
        <div className="p-8 border-t border-[#c3c6d5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0047ab] flex items-center justify-center text-white font-bold text-xs uppercase">
              {userData?.nombre?.substring(0,2) || 'AD'}
            </div>
            <div>
              <p className="font-black text-[10px] uppercase text-[#191c1e] truncate max-w-[120px]">
                {userData?.nombre || 'Cargando...'}
              </p>
              <p className="text-[9px] text-[#434653] uppercase tracking-widest font-bold">
                {userData?.rol || 'Analista'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-10 flex flex-col gap-10">
        
        <header className="flex justify-between items-end border-b border-[#c3c6d5] pb-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-[#191c1e]">
              Dashboard de Competencia
            </h2>
            <p className="text-sm mt-2 text-[#434653] font-medium uppercase tracking-widest italic">
              {userData?.empresaNombre || 'PymeTracker Inteligencia'}
            </p>
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-2 bg-[#0047ab] text-white font-black text-[10px] rounded hover:bg-[#00327d] transition-all uppercase tracking-widest shadow-md flex items-center gap-2">
                
                Ejecutar Sistema
             </button>
          </div>
        </header>

        {/* Metric Cards (Iguales a tu diseño, pero con valores que podrían ser dinámicos) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#c3c6d5] p-8 rounded-xl flex flex-col gap-4 shadow-sm hover:border-[#0047ab] transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#434653]">Precio Promedio Rubro</span>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-black text-[#0047ab]">$4.250</span>
              <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-1 rounded">+2.4%</span>
            </div>
          </div>
          {/* ... otras cards ... */}
        </section>

        {/* Local Competition Table (CONECTADA A LA API) */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase italic text-[#191c1e]">Historial de Análisis Recientes</h3>
          </div>
          <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f4f6] text-[#434653]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">ID Análisis</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Tienda Analizada</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d5]">
                {analisisData.length > 0 ? (
                  analisisData.map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-[#f7f9fb] transition-colors">
                      <td className="px-6 py-5 text-sm font-bold">#00{item.id}</td>
                      <td className="px-6 py-5 text-sm text-[#434653]">Tienda ID: {item.tiendaId}</td>
                      <td className="px-6 py-5">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-[#dae2ff] text-[#001946]' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#0047ab]">
                        {new Date(item.fechaCreacion).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-xs font-bold uppercase text-[#737784]">
                      No hay análisis registrados en la base de datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer (Igual) */}
        <footer className="mt-auto pt-10 border-t border-[#c3c6d5] flex justify-between items-center text-[#434653]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">© 2026 PymeTracker.</p>
        </footer>
      </main>
    </div>
  );
}