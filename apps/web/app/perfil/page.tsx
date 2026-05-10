"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // 1. Estado para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    rubro: '',
    direccion: '',
    comuna: '',
    telefono: ''
  });

  // 2. Cargar datos actuales si ya existen (GET)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/auth/perfil'); // Ajustar a la ruta de Cristóbal
        if (response.ok) {
          const result = await response.json();
          // Si el usuario ya tiene empresa, llenamos los campos
          if (result.data.empresa) {
            setFormData({
              nombre: result.data.empresa.nombre || '',
              rut: result.data.empresa.rut || '',
              rubro: result.data.empresa.rubro || '',
              direccion: result.data.empresa.direccion || '',
              comuna: result.data.empresa.comuna || '',
              telefono: result.data.empresa.telefono || ''
            });
          }
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    }
    fetchProfile();
  }, []);

  // 3. Función para Guardar Cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: '', texto: '' });

    try {
      const response = await fetch('/api/empresa/perfil', { // Endpoint para actualizar empresa
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMensaje({ tipo: 'success', texto: 'Perfil estructural actualizado con éxito.' });
        setTimeout(() => router.push('/sesion'), 1500); // Redirigir al dashboard
      } else {
        const err = await response.json();
        setMensaje({ tipo: 'error', texto: err.error || 'Error al guardar.' });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: 'Fallo de conexión con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-3xl font-black uppercase mb-2 text-[#191c1e] leading-none">Perfil de Empresa</h1>
              <p className="text-sm text-[#434653] font-medium">Actualice la información estructural de su PyME.</p>
            </div>
            
            {mensaje.texto && (
              <div className={`p-4 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${
                mensaje.tipo === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {mensaje.texto}
              </div>
            )}
          </aside>

          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Sección: Identificación */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#0047ab] text-xl">business</span>
                  <h2 className="text-lg font-bold uppercase text-[#191c1e]">Identificación Comercial</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Nombre de la Empresa</label>
                    <input 
                      className="border border-[#737784] p-4 bg-white rounded-lg focus:border-[#0047ab] outline-none transition-all text-sm" 
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      placeholder="Ej. Innova Tech SpA" 
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">RUT (ID Fiscal)</label>
                    <input 
                      className="border border-[#737784] p-4 bg-white rounded-lg focus:border-[#0047ab] outline-none text-sm" 
                      type="text"
                      value={formData.rut}
                      onChange={(e) => setFormData({...formData, rut: e.target.value})}
                      placeholder="76.123.456-K" 
                    />
                  </div>
                  <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Rubro</label>
                    <select 
                      className="border border-[#737784] p-4 bg-white rounded-lg focus:border-[#0047ab] outline-none text-sm appearance-none cursor-pointer" 
                      value={formData.rubro}
                      onChange={(e) => setFormData({...formData, rubro: e.target.value})}
                    >
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

              {/* Sección: Ubicación */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[#0047ab] text-xl">location_on</span>
                  <h2 className="text-lg font-bold uppercase text-[#191c1e]">Ubicación y Contacto</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Dirección</label>
                    <input 
                      className="border border-[#737784] p-4 bg-white rounded-lg focus:border-[#0047ab] outline-none text-sm" 
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                      placeholder="Av. Principal 1234, Oficina 501" 
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Ciudad / Región</label>
                    <input 
                      className="border border-[#737784] p-4 bg-white rounded-lg focus:border-[#0047ab] outline-none text-sm" 
                      type="text"
                      value={formData.comuna}
                      onChange={(e) => setFormData({...formData, comuna: e.target.value})}
                      placeholder="Ej. Santiago, RM" 
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] font-black text-[#434653] uppercase tracking-widest">Teléfono</label>
                    <input 
                      className="border border-[#737784] p-4 bg-white rounded-lg focus:border-[#0047ab] outline-none text-sm" 
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      placeholder="9 1234 5678" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-end items-center gap-6">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="text-[11px] font-black uppercase tracking-widest text-[#434653] hover:text-[#ba1a1a]"
                >
                  Descartar
                </button>
                <button 
                  disabled={loading}
                  className="bg-[#0047ab] text-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#00327d] rounded-lg transition-all disabled:opacity-50 shadow-lg" 
                  type="submit"
                >
                  {loading ? 'Guardando...' : 'Guardar Perfil'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}