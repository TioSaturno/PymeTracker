"use client";

import { Check, Sparkles, ArrowRight, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const beneficios = [
  "Análisis de competencia ilimitado",
  "Reportes detallados con gráficas",
  "Historial completo de análisis",
  "Alertas en tiempo real",
  "Soporte prioritario",
];

export default function PlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [usuario, setUsuario] = useState<{ nombre: string; email: string } | null>(null);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    async function init() {
      const [meRes] = await Promise.all([
        fetch("/api/auth/me"),
      ]);
      if (meRes.ok) {
        const json = await meRes.json();
        if (json.data) setUsuario(json.data);
      }
      try {
        const res = await fetch("/api/suscripcion");
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            router.replace("/");
            return;
          }
        }
      } catch {
      } finally {
        setChecking(false);
      }
    }
    init();
  }, [router]);

  const handleLogout = async () => {
    setCerrando(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setCerrando(false);
    }
  };

  const handleActivar = async () => {
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch("/api/suscripcion", { method: "POST" });
      const json = await res.json();

      if (res.ok) {
        setMensaje({ tipo: "success", texto: json.message });
        setTimeout(() => router.replace("/"), 1000);
      } else {
        setMensaje({ tipo: "error", texto: json.error || "Error al activar" });
      }
    } catch {
      setMensaje({
        tipo: "error",
        texto: "Error de conexión con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  const userHeader = usuario && (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#e4e2e2] px-6 py-3 flex items-center justify-end gap-4">
      <div className="flex items-center gap-2 text-sm text-[#4f4441]">
        <User className="h-4 w-4 text-[#817470]" />
        <span style={{ fontFamily: "'Inter', sans-serif" }}>
          {usuario.nombre || usuario.email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        disabled={cerrando}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#93000a] bg-[#ffdad6]/30 rounded-xl hover:bg-[#ffdad6]/50 transition-colors disabled:opacity-50 cursor-pointer"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <LogOut className="h-3.5 w-3.5" />
        {cerrando ? "Saliendo..." : "Cerrar sesión"}
      </button>
    </div>
  );

  if (checking) {
    return (
      <div className="w-full">
        {userHeader}
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="animate-spin h-8 w-8 border-4 border-[#725950] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {userHeader}
      <div className="max-w-2xl mx-auto px-4 pt-24">
        <div className="text-center mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#817470] mb-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          PYMETRACKER
        </p>
        <h1
          className="text-[2.5rem] font-bold text-[#1b1c1c] leading-tight mb-3"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Elige tu plan
        </h1>
        <p
          className="text-[#4f4441] text-lg max-w-md mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Desbloquea todas las herramientas para impulsar tu negocio
        </p>
      </div>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#fedcd0]/50 rounded-xl">
              <Sparkles className="h-6 w-6 text-[#725950]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  className="text-xl font-semibold text-[#1b1c1c]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Plan Premium
                </h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 bg-[#725950] text-white rounded-full">
                  Recomendado
                </span>
              </div>
              <p
                className="text-sm text-[#4f4441]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Acceso completo a todas las funcionalidades
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-[#e4e2e2]">
          <span
            className="text-sm font-medium text-[#817470]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            $
          </span>
          <span
            className="text-5xl font-bold text-[#1b1c1c]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            500
          </span>
          <span
            className="text-sm font-medium text-[#817470] ml-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            CLP / mes
          </span>
        </div>

        <ul className="space-y-4 mb-10">
          {beneficios.map((beneficio, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="p-0.5 bg-[#725950] rounded-full mt-0.5 flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span
                className="text-[#4f4441] text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {beneficio}
              </span>
            </li>
          ))}
        </ul>

        {mensaje.texto && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              mensaje.tipo === "success"
                ? "bg-[#dbe3f1]/30 text-[#575f6b] border border-[#dbe3f1]"
                : "bg-[#ffdad6]/30 text-[#93000a] border border-[#ffdad6]"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        <button
          onClick={handleActivar}
          disabled={loading}
          className="w-full py-3.5 bg-[#725950] text-white text-sm font-semibold rounded-xl hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Activar Suscripción Ahora
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p
          className="text-xs text-[#817470] text-center mt-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Pago seguro vía Flow. — Monto de prueba: $500 CLP (sandbox).
          <br />
          La activación es inmediata.
        </p>
      </div>
    </div>
  </div>
  );
}
