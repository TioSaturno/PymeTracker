"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Phone } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";

export default function CreateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    rubro: "",
    direccion: "",
    comuna: "",
    telefono: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/empresa/perfil");
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setFormData({
              nombre: result.data.nombre || "",
              rut: result.data.rut || "",
              rubro: result.data.rubro || "",
              direccion: result.data.direccion || "",
              comuna: result.data.comuna || "",
              telefono: result.data.telefono || "",
            });
          }
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const response = await fetch("/api/empresa/perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMensaje({ tipo: "success", texto: "Perfil creado exitosamente." });
        setTimeout(() => router.push("/"), 1500);
      } else {
        const err = await response.json();
        setMensaje({ tipo: "error", texto: err.error || "Error al guardar." });
      }
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: "Fallo de conexión con el servidor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          pageTitle={<>CREAR PERFIL<br/>DE EMPRESA</>}
          pageDescription="Complete la información estructural de su PyME."
        />

        {/* Mensaje */}
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sección: Identificación */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#fedcd0]/50 rounded-xl">
                <Building2 className="h-5 w-5 text-[#725950]" />
              </div>
              <h2
                className="text-lg font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Identificación Comercial
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Nombre de la Empresa
                </label>
                <input
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Ej. Innova Tech SpA"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  RUT (ID Fiscal)
                </label>
                <input
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200"
                  type="text"
                  value={formData.rut}
                  onChange={(e) =>
                    setFormData({ ...formData, rut: e.target.value })
                  }
                  placeholder="76.123.456-K"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Rubro
                </label>
                <select
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200 appearance-none cursor-pointer"
                  value={formData.rubro}
                  onChange={(e) =>
                    setFormData({ ...formData, rubro: e.target.value })
                  }
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

          {/* Sección: Ubicación */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#dbe3f1]/50 rounded-xl">
                <MapPin className="h-5 w-5 text-[#575f6b]" />
              </div>
              <h2
                className="text-lg font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Ubicación y Contacto
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Dirección
                </label>
                <input
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Av. Principal 1234, Oficina 501"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Ciudad / Región
                </label>
                <input
                  className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200"
                  type="text"
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                  placeholder="Ej. Santiago, RM"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Teléfono
                </label>
                <div className="relative flex items-center gap-5">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#817470]" />
                  <input
                    className="w-full border border-[#e4e2e2] rounded-xl pl-11 pr-4 py-3 text-sm text-[#1b1c1c] bg-white/60 backdrop-blur-sm outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10 transition-all duration-200"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    placeholder="9 1234 5678"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
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
              {loading ? "Guardando..." : "Crear Perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
