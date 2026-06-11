"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LifeBuoy } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";

export default function NuevoTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [formData, setFormData] = useState({
    asunto: "",
    descripcion: "",
    prioridad: "media",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMensaje({ tipo: "success", texto: "Ticket enviado correctamente. Te contactaremos pronto." });
        setTimeout(() => router.push("/tickets"), 1500);
      } else {
        const err = await response.json();
        setMensaje({ tipo: "error", texto: err.error || "Error al enviar." });
      }
    } catch {
      setMensaje({ tipo: "error", texto: "Fallo de conexión con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader
        pageTitle="NUEVO TICKET"
        pageDescription="Reporta un problema o solicita ayuda al equipo de soporte."
      />

      <div className="max-w-2xl mx-auto p-8">
        {mensaje.texto && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
            mensaje.tipo === "success"
              ? "bg-[#dbe3f1]/30 text-[#575f6b] border border-[#dbe3f1]"
              : "bg-[#ffdad6]/30 text-[#93000a] border border-[#ffdad6]"
          }`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#fedcd0]/50 rounded-xl">
                <LifeBuoy className="h-5 w-5 text-[#725950]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Detalles del problema
              </h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Asunto
                </label>
                <input
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200"
                  type="text"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  placeholder="Ej. Error al ejecutar análisis"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Descripción
                </label>
                <textarea
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200 resize-none"
                  rows={5}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el problema con el mayor detalle posible..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Prioridad
                </label>
                <select
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200 appearance-none cursor-pointer"
                  value={formData.prioridad}
                  onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                >
                  <option value="baja">Baja — no es urgente</option>
                  <option value="media">Media — afecta mi trabajo</option>
                  <option value="alta">Alta — no puedo usar la plataforma</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-sm font-medium text-[#4f4441] hover:text-[#725950] transition-colors"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              className="px-8 py-3 bg-[#725950] text-white text-sm font-medium rounded-xl hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
            >
              {loading ? "Enviando..." : "Enviar ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}