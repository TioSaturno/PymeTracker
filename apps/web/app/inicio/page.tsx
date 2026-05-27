'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  // 1. Estados para capturar los datos y manejar errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Función para conectar con el endpoint de Cristóbal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Mostramos el mensaje de error que configuró Cristóbal
        throw new Error(result.error || 'Error al iniciar sesión');
      }

      // Login exitoso: El token ya se guardó en cookies (lo hizo Cristóbal en el server)
      console.log('Usuario autenticado:', result.data.usuario);
      router.push('/sesion'); // Redirigir al dashboard/sesion

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f7f9fb] text-[#191c1e]">
      {/* Barra de Navegación (Igual) */}
      <nav className="flex justify-between items-center w-full px-10 py-4 max-w-full bg-white border-b border-[#c3c6d5] fixed top-0 z-50">
        <div className="text-xl font-black text-[#191c1e] uppercase tracking-tight">
          Pyme <span className="text-[#0047ab]">Tracker</span>
        </div>
        <div className="flex items-center gap-6">
          <Link className="text-[12px] font-bold uppercase tracking-wider text-[#434653]" href="#">Soporte</Link>
          <div className="flex gap-4">
            <Link href="/inicio" className="text-[12px] font-bold uppercase tracking-wider bg-[#0047ab] text-white px-6 py-2 rounded-lg">Iniciar Sesión</Link>
            <Link href="/registro" className="text-[12px] font-bold uppercase tracking-wider text-[#434653] px-4 py-2">Registrarse</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-16 py-25 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl gap-12 items-center">
          
          {/* Lado Izquierdo (Igual) */}
          <div className="md:col-span-7 space-y-8">
            <div className="border-l-4 border-[#0047ab] pl-8">
              <h1 className="text-6xl font-black uppercase leading-[0.9] text-[#191c1e] tracking-tighter">
                Autoridad <br/> Estratégica en <br/> Inteligencia.
              </h1>
            </div>
            <p className="text-lg text-[#434653] max-w-lg font-medium">
              Diseñado para el análisis de alta precisión. Autentifícate para acceder a tu panel de control.
            </p>
          </div>

          {/* Lado Derecho: Formulario Conectado */}
          <div className="md:col-span-5 bg-white border border-[#c3c6d5] p-8 md:p-12 flex flex-col space-y-8 rounded-lg shadow-sm">
            <h2 className="text-3xl font-bold uppercase text-[#191c1e]">Inicio de Sesión</h2>

            {/* Alerta de Error */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold block uppercase tracking-wider" htmlFor="email">Correo Electrónico</label>
                <input 
                  className="w-full border border-[#737784] p-4 rounded-lg focus:border-[#0047ab] outline-none bg-[#f7f9fb]" 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej. director@pyme.com" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[11px] font-bold block uppercase tracking-wider" htmlFor="password">Contraseña</label>
                  <Link className="text-[10px] uppercase font-black text-[#434653] hover:text-[#0047ab] underline" href="#">¿Olvidaste tu contraseña?</Link>
                </div>
                <input 
                  className="w-full border border-[#737784] p-4 rounded-lg focus:border-[#0047ab] outline-none bg-[#f7f9fb]" 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-[#0047ab] text-white font-bold uppercase tracking-widest py-4 px-6 rounded-lg active:scale-[0.98] hover:bg-[#00327d] transition-all disabled:opacity-50" 
                type="submit"
              >
                {loading ? 'Procesando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="pt-6 border-t border-[#c3c6d5]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-[11px] font-bold text-[#434653] uppercase">¿No tienes una cuenta?</p>
                <Link className="text-[11px] font-bold text-[#0047ab] uppercase underline" href="/registro">Solicitar Acceso</Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Igual) */}
      <footer className="bg-white border-t border-[#c3c6d5] mt-auto py-6 px-10 flex justify-between items-center">
        <div className="text-[10px] font-black uppercase text-[#434653]">© 2026 PymeTracker.</div>
      </footer>
    </div>
  );
}