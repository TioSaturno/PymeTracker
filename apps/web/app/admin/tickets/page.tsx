"use client";

import React, { useState, useEffect } from "react";
import { LifeBuoy, ChevronDown, Send } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";

type Ticket = {
  id: number;
  asunto: string;
  descripcion: string;
  status: string;
  prioridad: string;
  respuesta: string | null;
  respondidoPor: number | null;
  fechaRespuesta: string | null;
  fechaCreacion: string;
  usuarioId: number;
  empresaId: number | null;
  usuarioNombre: string | null;
  empresaNombre: string | null;
};

const statusColor: Record<string, string> = {
  abierto: "bg-[#ffdad6]/40 text-[#93000a]",
  en_progreso: "bg-[#faeeda]/40 text-[#854f0b]",
  resuelto: "bg-[#dbe3f1]/40 text-[#575f6b]",
};

const prioridadColor: Record<string, string> = {
  alta: "bg-[#ffdad6]/40 text-[#93000a]",
  media: "bg-[#faeeda]/40 text-[#854f0b]",
  baja: "bg-[#dbe3f1]/40 text-[#575f6b]",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState("");

  useEffect(() => {
    async function cargar() {
      try {
        const res = await fetch("/api/admin/tickets");
        if (res.ok) {
          const { data } = await res.json();
          setTickets(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status } : t))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResponder = async (id: number) => {
    if (!respuestaTexto.trim()) return;
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuesta: respuestaTexto.trim() }),
      });
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, respuesta: respuestaTexto.trim(), respondidoPor: 0, fechaRespuesta: new Date().toISOString() }
              : t
          )
        );
        setRespuestaTexto("");
        setExpandido(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader pageTitle="TICKETS" pageDescription="Gestión de tickets de soporte." />

      <div className="max-w-4xl mx-auto p-8">
        {loading ? (
          <p className="text-sm text-[#817470]">Cargando tickets...</p>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <LifeBuoy className="h-10 w-10 text-[#e4e2e2] mx-auto mb-4" />
            <p className="text-sm text-[#817470]">No hay tickets registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] overflow-hidden shadow-[0_4px_16px_rgb(0,0,0,0.03)]"
              >
                <button
                  onClick={() => setExpandido(expandido === ticket.id ? null : ticket.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#f5f3f3] transition-colors"
                >
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold text-[#1b1c1c] truncate">{ticket.asunto}</p>
                    <p className="text-xs text-[#817470] mt-0.5">
                      {ticket.usuarioNombre || "Usuario #" + ticket.usuarioId}
                      {ticket.empresaNombre ? ` · ${ticket.empresaNombre}` : ""}
                      {" · "}
                      {new Date(ticket.fechaCreacion).toLocaleDateString("es-CL")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${prioridadColor[ticket.prioridad] ?? "bg-[#f5f3f3] text-[#4f4441]"}`}>
                      {ticket.prioridad}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColor[ticket.status] ?? "bg-[#f5f3f3] text-[#4f4441]"}`}>
                      {ticket.status.replace("_", " ")}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-[#817470] transition-transform duration-200 ${expandido === ticket.id ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {expandido === ticket.id && (
                  <div className="px-6 pb-5 border-t border-[#e4e2e2] space-y-4">
                    <p className="text-sm text-[#4f4441] mt-4 leading-relaxed">{ticket.descripcion}</p>

                    {ticket.respuesta && (
                      <div className="bg-[#dbe3f1]/20 border border-[#dbe3f1] rounded-xl p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#575f6b] mb-1">
                          RESPUESTA ENVIADA
                        </p>
                        <p className="text-sm text-[#1b1c1c] leading-relaxed">{ticket.respuesta}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#817470]">Cambiar estado:</span>
                      {["abierto", "en_progreso", "resuelto"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(ticket.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            ticket.status === s
                              ? "bg-[#725950] text-white"
                              : "bg-[#f5f3f3] text-[#4f4441] hover:bg-[#fedcd0]"
                          }`}
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 items-start">
                      <textarea
                        value={respuestaTexto}
                        onChange={(e) => setRespuestaTexto(e.target.value)}
                        placeholder="Escribe una respuesta al usuario..."
                        className="flex-1 border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all resize-none"
                        rows={2}
                      />
                      <button
                        onClick={() => handleResponder(ticket.id)}
                        disabled={!respuestaTexto.trim()}
                        className="px-4 py-3 bg-[#725950] text-white text-sm font-medium rounded-xl hover:bg-[#5d4a42] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        Responder
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
