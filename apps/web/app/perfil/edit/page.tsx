"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    rubro: '',
    direccion: '',
    comuna: '',
    telefono: ''
  });

  // Cargar datos actuales desde el backend
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/empresa/perfil'); 
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setFormData({
              nombre: result.data.nombre || '',
              rut: result.data.rut || '',
              rubro: result.data.rubro || '',
              direccion: result.data.direccion || '',
              comuna: result.data.comuna || '',
              telefono: result.data.telefono || ''
            });
          }
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch('/api/empresa/perfil', {
  method: 'PUT', // <--- IMPORTANTE: PUT para actualizar
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: '¡Perfil actualizado en la base de datos!' });
        setIsReadOnly(true);
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      } else {
        const err = await response.json();
        setMensaje({ tipo: 'error', texto: err.error || 'Error al guardar.' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Fallo de conexión.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (readOnly: boolean) => `
    border p-4 rounded-lg outline-none transition-all text-sm w-full
    ${readOnly 
      ? 'bg-transparent border-transparent text-gray-500 font-medium cursor-default' 
      : 'bg-white border-[#737784] focus:border-[#0047ab] text-black shadow-sm'}
  `;

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans">
      <header className="bg-white flex justify-between items-center w-full px-10 py-4 border-b border-[#c3c6d5] sticky top-0 z-50">
        <div className="text-xl font-black text-[#0047ab] uppercase tracking-tighter">
          PyME <span className="text-[#191c1e]">Tracker</span>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="bg-[#191c1e] text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded">Volver al Panel</Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-10 py-12 max-w-7xl">
        <div className="grid grid-cols-12 gap-12">
          
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 space-y-8">
            <div className="border-b border-[#c3c6d5] pb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black uppercase text-[#191c1e] leading-none">Mi Perfil</h1>
                <button 
                  type="button"
                  onClick={() => setIsReadOnly(!isReadOnly)}
                  className={`p-2 rounded-full transition-all ${!isReadOnly ? 'bg-[#ba1a1a] text-white' : 'hover:bg-gray-200 text-[#0047ab]'}`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {isReadOnly ? 'edit' : 'close'}
                  </span>
                </button>
              </div>
              <p className="text-sm text-[#434653] font-medium">Información oficial de su PyME.</p>
            </div>
            
            {mensaje.texto && (
              <div className={`p-4 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md ${
                mensaje.tipo === 'success' ? 'bg-green-100 text-green-700 border-l-4 border-green-500' : 'bg-red-100 text-red-700 border-l-4 border-red-500'
              }`}>
                {mensaje.texto}
              </div>
            )}
          </aside>

          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* SECCIÓN 1: IDENTIFICACIÓN */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#0047ab] text-xl">business</span>
                  <h2 className="text-lg font-bold uppercase text-[#191c1e]">Identificación Comercial</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Nombre de la Empresa</label>
                    <input disabled={isReadOnly} className={inputClass(isReadOnly)} type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">RUT (ID Fiscal)</label>
                    <input disabled={isReadOnly} className={inputClass(isReadOnly)} type="text" value={formData.rut} onChange={(e) => setFormData({...formData, rut: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Rubro</label>
                    <select disabled={isReadOnly} className={inputClass(isReadOnly)} value={formData.rubro} onChange={(e) => setFormData({...formData, rubro: e.target.value})}>
                      <option value="">Seleccione una categoría</option>
                      <option value="retail">Comercio Minorista</option>
                      <option value="services">Servicios Profesionales</option>
                      <option value="tech">Tecnología e Innovación</option>
                      <option value="fnb">Alimentos y Bebidas</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#c3c6d5] w-full"></div>

              {/* SECCIÓN 2: UBICACIÓN */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#0047ab] text-xl">location_on</span>
                  <h2 className="text-lg font-bold uppercase text-[#191c1e]">Ubicación y Contacto</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Dirección</label>
                    <input disabled={isReadOnly} className={inputClass(isReadOnly)} type="text" value={formData.direccion} onChange={(e) => setFormData({...formData, direccion: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Ciudad / Región</label>
                    <input disabled={isReadOnly} className={inputClass(isReadOnly)} type="text" value={formData.comuna} onChange={(e) => setFormData({...formData, comuna: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Teléfono de Contacto</label>
                    <input disabled={isReadOnly} className={inputClass(isReadOnly)} type="tel" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                  </div>
                </div>
              </div>

              {!isReadOnly && (
                <div className="pt-8 flex justify-end items-center gap-6 animate-in slide-in-from-bottom-2 duration-300">
                  <button type="button" onClick={() => setIsReadOnly(true)} className="text-[11px] font-black uppercase tracking-widest text-[#434653] hover:text-[#ba1a1a]">
                    Descartar
                  </button>
                  <button disabled={loading} className="bg-[#0047ab] text-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#00327d] rounded-lg shadow-lg" type="submit">
                    {loading ? 'Guardando...' : 'Confirmar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}