"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Iniciando análisis...",
  places_search: "Buscando competidores en Google Maps...",
  web_scraping: "Analizando sitios web de competidores...",
  llm_analysis: "Generando informe con IA...",
  completed: "¡Análisis completado!",
  failed: "Error en el análisis",
};

type PollStatus =
  | { status: "pending" | "places_search" | "web_scraping" | "llm_analysis"; updatedAt: string }
  | { status: "completed"; payloadData: unknown; updatedAt: string }
  | { status: "failed"; updatedAt: string };

export default function EjecutarAnalisis() {
  const [ejecutando, setEjecutando] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [perfilCompleto, setPerfilCompleto] = useState<boolean | null>(null);
  const [nResults, setNResults] = useState<number>(3);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const OPCIONES = [1, 3, 5, 10];

  useEffect(() => {
    async function checkProfile() {
      try {
        const res = await fetch("/api/empresa/perfil");
        if (!res.ok) { setPerfilCompleto(false); return; }
        const { data } = await res.json();
        if (!data) { setPerfilCompleto(false); return; }
        const tieneRubro = !!data.rubro;
        const tieneDireccion = !!(data.direccion || data.comuna);
        const tieneTienda = !!(data.tiendas?.length > 0);
        setPerfilCompleto(tieneRubro && tieneDireccion && tieneTienda);
      } catch {
        setPerfilCompleto(false);
      }
    }
    checkProfile();
  }, []);

  const detenerPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => detenerPolling();
  }, [detenerPolling]);

  const iniciarAnalisis = async () => {
    setEjecutando(true);
    setError(null);
    setStatus("pending");

    try {
      const res = await fetch("/api/analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nResults }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al iniciar análisis");
      }

      const { analisisId } = await res.json();

      pollingRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/analisis/${analisisId}`);
          if (!pollRes.ok) throw new Error("Error en polling");

          const data: PollStatus = await pollRes.json();
          setStatus(data.status);

          if (data.status === "completed") {
            detenerPolling();
            setTimeout(() => window.location.reload(), 500);
          } else if (data.status === "failed") {
            detenerPolling();
            setEjecutando(false);
          }
        } catch (err) {
          console.error("Polling error:", err);
          detenerPolling();
          setError("Error al consultar el estado del análisis");
          setEjecutando(false);
        }
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
      setEjecutando(false);
    }
  };

  return (
    <div className="w-full">
      {!ejecutando && !error && perfilCompleto === true && (
        <div className="w-full bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#4f4441]">Competidores:</span>
            <div className="flex gap-2">
              {OPCIONES.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNResults(opt)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    nResults === opt
                      ? "bg-[#1b1c1c] text-white shadow-sm"
                      : "bg-[#f5f3f3] text-[#4f4441] border border-[#e4e2e2] hover:bg-[#efeded]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={iniciarAnalisis}
            className="w-full bg-[#1b1c1c] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#333] transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer"
          >
            Ejecutar Nuevo Análisis
          </button>
        </div>
      )}

      {!ejecutando && !error && perfilCompleto === false && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-4">
          <button
            disabled
            className="w-full bg-[#d3c3be] text-white font-semibold py-3 px-6 rounded-xl cursor-not-allowed opacity-60"
          >
            Ejecutar Nuevo Análisis
          </button>
          <p className="text-xs text-[#817470]">
            Debes completar tu perfil antes de ejecutar un análisis.{' '}
            <Link href="/perfil/edit" className="text-[#725950] font-semibold hover:underline">
              Completar perfil →
            </Link>
          </p>
        </div>
      )}

      {ejecutando && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1b1c1c]" />
            <p className="text-[#4f4441] font-medium">
              {STATUS_MESSAGES[status || "pending"] || "Procesando..."}
            </p>
          </div>
        </div>
      )}

      {error && !ejecutando && (
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#ffdad6] p-8 shadow-[0_8px_30px_rgb(186,26,26,0.04)] text-center">
          <p className="text-[#ba1a1a] font-medium mb-1">{error}</p>
          {perfilCompleto === true ? (
            <button
              onClick={iniciarAnalisis}
              className="bg-[#1b1c1c] text-white font-semibold py-2 px-6 rounded-xl hover:bg-[#333] transition-colors cursor-pointer mt-4"
            >
              Reintentar
            </button>
          ) : (
            <p className="text-xs text-[#817470] mt-4">
              Completa tu perfil antes de reintentar.{' '}
              <Link href="/perfil/edit" className="text-[#725950] font-semibold hover:underline">
                Ir a perfil →
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
