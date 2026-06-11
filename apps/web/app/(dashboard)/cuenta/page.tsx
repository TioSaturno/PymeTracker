"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import PageHeader from "@/app/components/PageHeader";

type Suscripcion = {
  id: number;
  plan: string;
  precio: number;
  moneda: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  fechaCancelacion: string | null;
  metodoPago: string | null;
  referenciaPago: string | null;
};

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatearPrecio(precio: number, moneda: string) {
  const monto = (precio / 100).toLocaleString("es-CL");
  return `$${monto} ${moneda}/mes`;
}

export default function CuentaPage() {
  const router = useRouter();
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const cargarSuscripcion = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/suscripcion");
      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }
      const json = await res.json();
      setSuscripcion(json.data || null);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar suscripción" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSuscripcion();
  }, []);

  const handleCancelar = async () => {
    setCancelando(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const res = await fetch("/api/suscripcion/cancelar", {
        method: "POST",
      });
      const json = await res.json();

      if (res.ok) {
        setMensaje({ tipo: "success", texto: json.message });
        setMostrarConfirmacion(false);
        cargarSuscripcion();
      } else {
        setMensaje({ tipo: "error", texto: json.error || "Error al cancelar" });
      }
    } catch {
      setMensaje({
        tipo: "error",
        texto: "Error de conexión con el servidor",
      });
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="bg-[#fbf9f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader
        pageTitle={<>MI CUENTA</>}
        pageDescription="Administra tu suscripción y datos de facturación"
      />

      <div className="max-w-4xl mx-auto mt-10 space-y-8">
        {mensaje.texto && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              mensaje.tipo === "success"
                ? "bg-[#dbe3f1]/30 text-[#575f6b] border border-[#dbe3f1]"
                : "bg-[#ffdad6]/30 text-[#93000a] border border-[#ffdad6]"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-[#725950] mb-4" />
            <span className="text-[#4f4441] text-sm">
              Cargando información...
            </span>
          </div>
        ) : (
          <>
            {/* Card: Suscripción Actual */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#fedcd0]/50 rounded-xl">
                  <CreditCard className="h-5 w-5 text-[#725950]" />
                </div>
                <h2
                  className="text-lg font-semibold text-[#1b1c1c]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Suscripción Actual
                </h2>
              </div>

              {suscripcion ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#f5f3f3] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-full ${
                          suscripcion.estado === "activa"
                            ? "bg-[#dbe3f1]"
                            : "bg-[#ffdad6]"
                        }`}
                      >
                        {suscripcion.estado === "activa" ? (
                          <CheckCircle className="h-5 w-5 text-[#575f6b]" />
                        ) : (
                          <XCircle className="h-5 w-5 text-[#93000a]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b1c1c] capitalize">
                          {suscripcion.estado === "activa"
                            ? "Activa"
                            : "Cancelada"}
                        </p>

                        <p className="text-xs text-[#817470]">
                          Plan {suscripcion.plan.charAt(0).toUpperCase() + suscripcion.plan.slice(1)}
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-[#725950]">
                      {formatearPrecio(suscripcion.precio, suscripcion.moneda)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-[#fbf9f8] rounded-xl">
                      <Calendar className="h-4 w-4 text-[#817470]" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                          Inicio
                        </p>
                        <p className="text-sm text-[#1b1c1c] font-medium">
                          {formatearFecha(suscripcion.fechaInicio)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#fbf9f8] rounded-xl">
                      <Clock className="h-4 w-4 text-[#817470]" />
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                          {suscripcion.estado === "activa"
                            ? "Próxima renovación"
                            : "Finaliza"}
                        </p>
                        <p className="text-sm text-[#1b1c1c] font-medium">
                          {formatearFecha(suscripcion.fechaFin)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {suscripcion.metodoPago === "flow" && suscripcion.referenciaPago && (
                    <div className="flex items-center gap-3 p-3 bg-[#f5f3f3] rounded-xl">
                      <CreditCard className="h-4 w-4 text-[#817470]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
                          ID Suscripción Flow
                        </p>
                        <p className="text-sm text-[#1b1c1c] font-mono truncate">
                          {suscripcion.referenciaPago}
                        </p>
                      </div>
                    </div>
                  )}

                  {suscripcion.fechaCancelacion && (
                    <div className="flex items-center gap-2 p-3 bg-[#ffdad6]/20 rounded-xl border border-[#ffdad6]">
                      <AlertTriangle className="h-4 w-4 text-[#93000a]" />
                      <p className="text-xs text-[#93000a] font-medium">
                        Cancelaste el {formatearFecha(suscripcion.fechaCancelacion)}.
                        Seguirás teniendo acceso hasta el{" "}
                        {formatearFecha(suscripcion.fechaFin)}.
                      </p>
                    </div>
                  )}

                  {suscripcion.estado === "activa" && (
                    <div className="pt-4 border-t border-[#e4e2e2]">
                      {mostrarConfirmacion ? (
                        <div className="space-y-3">
                          <p className="text-sm text-[#4f4441] font-medium">
                            ¿Estás seguro de cancelar tu suscripción?
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={handleCancelar}
                              disabled={cancelando}
                              className="px-6 py-2.5 bg-[#ba1a1a] text-white text-sm font-medium rounded-xl hover:bg-[#93000a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              {cancelando
                                ? "Cancelando..."
                                : "Sí, cancelar suscripción"}
                            </button>
                            <button
                              onClick={() => setMostrarConfirmacion(false)}
                              className="px-6 py-2.5 text-sm font-medium text-[#4f4441] hover:text-[#1b1c1c] transition-colors cursor-pointer"
                            >
                              No, mantenerla
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setMostrarConfirmacion(true)}
                          className="px-6 py-2.5 border border-[#e4e2e2] text-[#93000a] text-sm font-medium rounded-xl hover:bg-[#ffdad6]/20 transition-all duration-200 cursor-pointer"
                        >
                          Cancelar Suscripción
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-[#4f4441] mb-4">
                    No tienes una suscripción activa.
                  </p>
                  <button
                    onClick={() => router.push("/plan")}
                    className="px-6 py-2.5 bg-[#725950] text-white text-sm font-medium rounded-xl hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] cursor-pointer"
                  >
                    Ver Planes
                  </button>
                </div>
              )}
            </div>

            {/* Card: Facturación (placeholder futuro) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#dbe3f1]/50 rounded-xl">
                  <Calendar className="h-5 w-5 text-[#575f6b]" />
                </div>
                <h2
                  className="text-lg font-semibold text-[#1b1c1c]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Facturación
                </h2>
              </div>
              <p
                className="text-sm text-[#817470]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Los cobros se procesan a través de Flow.
                <br />
                El historial de pagos estará disponible próximamente.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
