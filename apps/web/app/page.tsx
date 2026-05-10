"use client";
import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
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
          <Link href="/inicio" className="flex items-center gap-3 px-4 py-3 font-bold text-sm bg-[#0047ab] text-white rounded-lg transition-transform active:scale-95">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/inicio" className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-[#434653] hover:bg-[#eceef0] transition-colors rounded-lg">
            <span className="material-symbols-outlined">analytics</span>
            <span>Competencia</span>
          </Link>
          <Link href="/inicio" className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-[#434653] hover:bg-[#eceef0] transition-colors rounded-lg">
            <span className="material-symbols-outlined">trending_up</span>
            <span>Mercado</span>
          </Link>
          <Link href="/inicio" className="flex items-center gap-3 px-4 py-3 font-bold text-sm text-[#434653] hover:bg-[#eceef0] transition-colors rounded-lg">
            <span className="material-symbols-outlined">settings</span>
            <span>Configuración</span>
          </Link>
        </nav>

        <div className="p-8 border-t border-[#c3c6d5]">
          <Link href="/inicio" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#737784] overflow-hidden bg-[#e0e3e5] group-hover:border-[#0047ab] transition-colors">
              <div className="w-full h-full bg-[#0047ab] flex items-center justify-center text-white font-bold text-xs">AD</div>
            </div>
            <div>
              <p className="font-black text-[10px] uppercase text-[#191c1e]">Admin User</p>
              <p className="text-[9px] text-[#434653] uppercase tracking-widest font-bold">Cuenta Premium</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-10 flex flex-col gap-10">
        
        {/* Header Section */}
        <header className="flex justify-between items-end border-b border-[#c3c6d5] pb-6">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tight text-[#191c1e]">BIENVENIDO A PYMETRACKER</h2>
            <p className="text-sm mt-2 text-[#434653] font-medium uppercase tracking-widest">Inteligencia Estratégica</p>
          </div>
          <div className="flex gap-4">
            <Link href="/inicio" className="px-6 py-2 border border-[#737784] font-black text-[10px] rounded hover:bg-[#eceef0] transition-colors uppercase tracking-widest">
              Exportar PDF
            </Link>
            <Link href="/inicio" className="px-6 py-2 bg-[#0047ab] text-white font-black text-[10px] rounded hover:bg-[#00327d] transition-colors uppercase tracking-widest shadow-md">
              Actualizar Datos
            </Link>
          </div>
        </header>

        {/* Metric Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/inicio" className="bg-white border border-[#c3c6d5] p-8 rounded-xl flex flex-col gap-4 shadow-sm group hover:border-[#0047ab] transition-all text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#434653] group-hover:text-[#0047ab]">Precio Promedio Rubro</span>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-black text-[#0047ab]">$4.250</span>
              <span className="text-xs font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-1 rounded">+2.4%</span>
            </div>
          </Link>
          <Link href="/inicio" className="bg-white border border-[#c3c6d5] p-8 rounded-xl flex flex-col gap-4 shadow-sm group hover:border-[#0047ab] transition-all text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#434653] group-hover:text-[#0047ab]">Calificación Media</span>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-black text-[#0047ab]">4.2</span>
              <span className="material-symbols-outlined text-3xl text-[#0047ab]">star_half</span>
            </div>
          </Link>
          <Link href="/inicio" className="bg-white border border-[#c3c6d5] p-8 rounded-xl flex flex-col gap-4 shadow-sm group hover:border-[#0047ab] transition-all text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#434653] group-hover:text-[#0047ab]">Tu Posicionamiento</span>
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-black text-[#0047ab]">#3</span>
              <span className="text-[10px] font-black uppercase bg-[#dae2ff] text-[#001946] px-3 py-1 rounded-full">Top 10%</span>
            </div>
          </Link>
        </section>

        {/* Local Competition Table */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase italic text-[#191c1e]">Análisis de Competencia Local</h3>
            <div className="flex gap-2">
              <Link href="/inicio" className="material-symbols-outlined border border-[#c3c6d5] p-2 rounded hover:bg-white transition-colors">filter_list</Link>
              <Link href="/inicio" className="material-symbols-outlined border border-[#c3c6d5] p-2 rounded hover:bg-white transition-colors">search</Link>
            </div>
          </div>
          <div className="bg-white border border-[#c3c6d5] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f2f4f6] text-[#434653]">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Empresa</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Distancia</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Precio Estrella</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Rating Google</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d5]">
                {[
                  { name: "Panadería El Sol", dist: "0.4 km", price: "$3.800", rate: "4.5" },
                  { name: "Café del Barrio", dist: "1.2 km", price: "$4.100", rate: "4.1" },
                  { name: "Market Express", dist: "2.5 km", price: "$4.500", rate: "3.8" },
                  { name: "Boutique Gourmet", dist: "3.1 km", price: "$5.200", rate: "4.8" },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f7f9fb] transition-colors cursor-pointer" onClick={() => window.location.href='/inicio'}>
                    <td className="px-6 py-5 text-sm font-bold">{item.name}</td>
                    <td className="px-6 py-5 text-sm text-[#434653]">{item.dist}</td>
                    <td className="px-6 py-5 text-sm font-black text-[#0047ab]">{item.price}</td>
                    <td className="px-6 py-5 text-sm flex items-center gap-2 font-bold">
                      {item.rate} <span className="material-symbols-outlined text-[16px] text-[#0047ab]">star</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Market Insights Section */}
         <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="text-2xl font-black uppercase italic text-[#191c1e]">Visión de Mercado</h3>
            <div className="bg-white border border-[#c3c6d5] rounded-xl h-64 flex items-end p-8 gap-4 relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 flex flex-col justify-between p-8 opacity-10">
                {[1, 2, 3, 4].map(i => <div key={i} className="border-b border-[#737784] w-full"></div>)}
              </div>
              {/* Mock Line Chart */}
              <svg className="absolute inset-0 w-full h-full px-8 py-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 0 80 L 20 60 L 40 70 L 60 30 L 80 40 L 100 10" fill="none" stroke="#0047ab" strokeWidth="2" />
                {[0, 20, 40, 60, 80, 100].map((x, i) => (
                  <circle key={i} cx={x} cy={[80, 60, 70, 30, 40, 10][i]} fill="#0047ab" r="1.5" />
                ))}
              </svg>
              <div className="absolute bottom-4 left-0 w-full flex justify-between px-8 text-[9px] font-black uppercase text-[#434653]">
                <span>Ene</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
              <div className="absolute top-4 right-8 bg-[#0047ab] text-white px-3 py-1 text-[9px] font-black rounded uppercase tracking-tighter">
                Tendencia de Precios Local
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-black uppercase italic text-[#191c1e]">Insight</h3>
            <div className="bg-[#27374c] text-white p-8 rounded-xl flex-grow flex flex-col justify-center shadow-lg relative border-l-4 border-[#0047ab]">
              <span className="material-symbols-outlined text-4xl mb-4 text-[#dae2ff]">lightbulb</span>
              <p className="text-lg italic leading-relaxed font-medium">
                "Tu precio actual está un <span className="text-[#dae2ff] font-black">12%</span> por encima del promedio local, pero tu calificación es superior al 85% de tus competidores."
              </p>
              <button className="mt-8 text-left text-[10px] font-black uppercase border-b-2 border-[#0047ab] w-fit hover:text-[#dae2ff] transition-colors tracking-widest">
                Optimizar Estrategia
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-10 border-t border-[#c3c6d5] flex flex-col md:flex-row justify-between items-center text-[#434653]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">© 2026 PymeTracker.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link className="text-[10px] font-black uppercase hover:text-[#0047ab] transition-all" href="/inicio">Términos</Link>
            <Link className="text-[10px] font-black uppercase hover:text-[#0047ab] transition-all" href="/inicio">Privacidad</Link>
            <Link className="text-[10px] font-black uppercase hover:text-[#0047ab] transition-all" href="/inicio">Soporte</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}