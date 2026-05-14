'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  // 1. Estados para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    empresaNombre: '',
    empresaRubro: 'Retail / Comercio' // Valor por defecto
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Función de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/registro', { // Ajusta la ruta si es /api/auth/register
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al registrarse');
      }

      // Registro exitoso: El token se guarda en cookies automáticamente
      router.push('/dashboard'); // O a la página de bienvenida

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans">
      {/* Barra de navegación (Igual) */}
      <nav className="flex justify-between items-center w-full px-10 py-4 max-w-full bg-white border-b border-[#c3c6d5] fixed top-0 z-50">
        <div className="text-xl font-black text-[#191c1e] uppercase tracking-tight">
          Pyme <span className="text-[#0047ab]">Tracker</span>
        </div>
        <div className="flex gap-4">
            <Link href="/inicio" className="text-[12px] font-bold uppercase tracking-wider text-[#434653] px-4 py-2">Iniciar Sesión</Link>
            <Link href="/registro" className="text-[12px] font-bold uppercase tracking-wider bg-[#0047ab] text-white px-6 py-2 rounded-lg">Registrarse</Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-10 pt-32 pb-16">
        <div className="w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda (Igual) */}
          <div className="md:col-span-7 hidden md:flex flex-col gap-8 text-[#191c1e]">
            <h1 className="text-5xl font-black leading-tight uppercase tracking-tighter">
              Autoridad Estructural en el Análisis de Competencia.
            </h1>
            <div className="h-1 bg-[#0047ab] w-24"></div>
            <p className="text-lg text-[#434653] max-w-[480px] font-medium">
              PyME Tracker proporciona un marco arquitectónico disciplinado para pequeñas y medianas empresas. Sin adornos. Solo precisión.
            </p>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="md:col-span-5 w-full">
            <div className="bg-white border border-[#c3c6d5] rounded-xl p-8 md:p-10 flex flex-col gap-6 shadow-lg">
              <h2 className="text-2xl font-bold text-[#191c1e] uppercase tracking-tight">Crear Cuenta</h2>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-[10px] font-black uppercase">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-[#434653] uppercase tracking-wider">Nombre Completo</label>
                  <input 
                    required
                    className="w-full px-4 py-3 border border-[#c3c6d5] rounded-lg outline-none focus:border-[#0047ab] bg-[#f7f9fb] text-sm" 
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej. Juan Pérez" 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-[#434653] uppercase tracking-wider">Nombre de tu Empresa</label>
                  <input 
                    required
                    className="w-full px-4 py-3 border border-[#c3c6d5] rounded-lg outline-none focus:border-[#0047ab] bg-[#f7f9fb] text-sm" 
                    type="text"
                    value={formData.empresaNombre}
                    onChange={(e) => setFormData({...formData, empresaNombre: e.target.value})}
                    placeholder="Ej. Mi Pyme Ltda." 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-[#434653] uppercase tracking-wider">Correo Corporativo</label>
                  <input 
                    required
                    className="w-full px-4 py-3 border border-[#c3c6d5] rounded-lg outline-none focus:border-[#0047ab] bg-[#f7f9fb] text-sm" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="j.perez@empresa.cl" 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-[#434653] uppercase tracking-wider">Contraseña</label>
                  <input 
                    required
                    className="w-full px-4 py-3 border border-[#c3c6d5] rounded-lg outline-none focus:border-[#0047ab] bg-[#f7f9fb] text-sm" 
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                  />
                </div>

                <button 
                  disabled={loading}
                  className="mt-2 w-full bg-[#0047ab] text-white font-bold text-[12px] uppercase tracking-widest py-4 rounded-xl hover:bg-[#00327d] transition-all disabled:opacity-50" 
                  type="submit"
                >
                  {loading ? 'Registrando...' : 'Finalizar Registro'}
                </button>
              </form>

              <div className="flex flex-col items-center gap-2 pt-4 border-t border-[#c3c6d5]">
                <p className="text-[10px] font-bold text-[#434653] uppercase">¿Ya tiene cuenta?</p>
                <Link href="/inicio" className="text-[11px] font-black text-[#0047ab] uppercase underline">Iniciar Sesión</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-10 py-6 border-t border-[#c3c6d5] bg-white text-[10px] font-black uppercase text-[#434653] text-center">
        © 2026 PymeTracker.
      </footer>
    </div>
  );
}