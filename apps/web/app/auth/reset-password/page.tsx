"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Enlace inválido. No se encontró el token de restablecimiento.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error al restablecer la contraseña");
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 p-4 bg-[#dbe3f1]/30 text-[#575f6b] text-sm rounded-xl border border-[#dbe3f1]">
          Contraseña actualizada exitosamente. Redirigiendo al inicio de sesión...
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-[#ffdad6]/40 text-[#93000a] text-sm rounded-xl border border-[#ffdad6]">
          {error}
        </div>
      )}

      {token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#4f4441] mb-2"
            >
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="•••••••• (mín. 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-[#f5f3f3]/50 outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#725950] text-white py-3 rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Restablecer contraseña"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-[#725950] hover:text-[#5d4a42] underline underline-offset-2"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="font-semibold text-[#725950] hover:text-[#5d4a42] underline underline-offset-2"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <main
      className="flex items-center justify-center min-h-screen bg-[#fbf9f8]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-semibold text-[#1b1c1c]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Nueva Contraseña
          </h2>
        </div>

        <Suspense fallback={<div className="text-center text-[#4f4441]">Cargando...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
