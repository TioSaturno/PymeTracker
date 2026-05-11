'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Error al iniciar sesión');
      }

      router.push('/valoracion');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contenedor-principal">
      <div className="tarjeta">
        <div className="encabezado">
          <h2>Ingreso al Sistema</h2>
          <p className="subtitulo">PERSONA AUTORIZADA</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email">Correo Corporativo</label>
            <input 
              type="email" 
              id="email" 
              placeholder="ejemplo@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="campo">
            <label htmlFor="password">Clave de Acceso</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-principal" disabled={loading}>
            {loading ? 'Autenticando...' : 'Autenticar Acceso'}
          </button>
        </form>

        <div className="pie-tarjeta">
          <p>¿No tienes cuenta?</p>
          <Link href="/registro" className="font-bold underline">
            SOLICITAR ACCESO
          </Link>
        </div>
      </div>
    </main>
  );
}