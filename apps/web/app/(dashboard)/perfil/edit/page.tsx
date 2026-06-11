"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Phone, Calendar, Store, Pencil, X } from "lucide-react";
import { CATEGORIAS_LOCALES } from "@/types/categories";
import PageHeader from "@/app/components/PageHeader";

export default function ProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    rubro: "",
    direccion: "",
    comuna: "",
    telefono: "",
    diaSeleccionado: "lunes",
  });

  const [sucursalData, setSucursalData] = useState({
    nombreSucursal: "",
    direccionSucursal: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/empresa/perfil");
        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            const tiendaActiva = result.data.tiendas?.find(
              (t: { id: number }) => t.id === result.data.tiendaActivaId
            );
            
            setFormData({
              nombre: result.data.nombre || "",
              rut: result.data.rut || "",
              rubro: result.data.rubro || "",
              direccion: tiendaActiva?.direccion || result.data.direccion || "",
              comuna: result.data.comuna || "",
              telefono: result.data.telefono || "",
              diaSeleccionado: result.data.diaSeleccionado || "lunes",
            });
            if (result.data.activeTienda) {
              setSucursalData({
                nombreSucursal: result.data.activeTienda.nombre || "",
                direccionSucursal: result.data.activeTienda.direccion || "",
              });
            }
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...sucursalData }),
      });

      if (response.ok) {
        setMensaje({
          tipo: "success",
          texto: "Perfil actualizado exitosamente.",
        });
        setIsReadOnly(true);
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3000);
      } else {
        const err = await response.json();
        setMensaje({ tipo: "error", texto: err.error || "Error al guardar." });
      }
    } catch (error) {
      setMensaje({ tipo: "error", texto: "Fallo de conexión." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (readOnly: boolean) => `
    w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200
    ${
      readOnly
        ? "bg-transparent border-transparent text-[#817470] cursor-default"
        : "bg-white/60 backdrop-blur-sm border-[#e4e2e2] text-[#1b1c1c] placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/10"
    }
  `;

  return (
    <div className="gap-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader
        pageTitle="MI PERFIL"
        pageDescription="Información oficial de su PyME."
      >
        <button
          type="button"
          onClick={() => setIsReadOnly(!isReadOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            !isReadOnly
              ? "bg-[#ffdad6]/30 text-[#93000a] hover:bg-[#ffdad6]/50"
              : "bg-[#fedcd0]/30 text-[#725950] hover:bg-[#fedcd0]/50"
          }`}
        >
          {isReadOnly ? (
            <>
              <Pencil className="h-4 w-4" /> Editar
            </>
          ) : (
            <>
              <X className="h-4 w-4" /> Cancelar
            </>
          )}
        </button>
      </PageHeader>

      <div className="max-w-4xl mx-auto mt-10">
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#fedcd0]/50 rounded-xl">
                <Building2 className="h-5 w-5 text-[#725950]" />
              </div>
              <h2
                className="text-lg font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Información Empresa
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Nombre de la Empresa
                </label>
                <input
                  disabled={isReadOnly}
                  className={inputClass(isReadOnly)}
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  RUT (ID Fiscal)
                </label>
                <input
                  disabled={isReadOnly}
                  className={inputClass(isReadOnly)}
                  type="text"
                  value={formData.rut}
                  onChange={(e) =>
                    setFormData({ ...formData, rut: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Rubro
                </label>
                <select
                  disabled={isReadOnly}
                  className={`${inputClass(isReadOnly)} appearance-none cursor-pointer`}
                  value={formData.rubro}
                  onChange={(e) =>
                    setFormData({ ...formData, rubro: e.target.value })
                  }
                >
                  <option value="">Seleccione una categoría</option>
                  {CATEGORIAS_LOCALES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Dirección
                </label>
                <input
                  disabled={isReadOnly}
                  className={inputClass(isReadOnly)}
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Ciudad / Región
                </label>
                <input
                  disabled={isReadOnly}
                  className={inputClass(isReadOnly)}
                  type="text"
                  value={formData.comuna}
                  onChange={(e) =>
                    setFormData({ ...formData, comuna: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#817470]" />
                  <input
                    disabled={isReadOnly}
                    className={`${inputClass(isReadOnly)} !pl-8`}
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#dbe3f1]/50 rounded-xl">
                <Store className="h-5 w-5 text-[#575f6b]" />
              </div>
              <h2
                className="text-lg font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Información Tienda
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Nombre de Sucursal
                </label>
                <input
                  disabled={isReadOnly}
                  className={inputClass(isReadOnly)}
                  type="text"
                  value={sucursalData.nombreSucursal}
                  onChange={(e) =>
                    setSucursalData({ ...sucursalData, nombreSucursal: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                  Dirección de la Sucursal
                </label>
                <input
                  disabled={isReadOnly}
                  className={inputClass(isReadOnly)}
                  type="text"
                  value={sucursalData.direccionSucursal}
                  onChange={(e) =>
                    setSucursalData({ ...sucursalData, direccionSucursal: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#fedcd0]/50 rounded-xl">
                <Calendar className="h-5 w-5 text-[#725950]" />
              </div>
              <h2
                className="text-lg font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Día de Análisis
              </h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#817470] block">
                Día de la semana para ejecutar el análisis automático
              </label>
              <select
                disabled={isReadOnly}
                className={`${inputClass(isReadOnly)} appearance-none cursor-pointer`}
                value={formData.diaSeleccionado}
                onChange={(e) =>
                  setFormData({ ...formData, diaSeleccionado: e.target.value })
                }
              >
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sabado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end items-center gap-4 pt-4 animate-in slide-in-from-bottom-2 duration-300">
              <button
                type="button"
                onClick={() => setIsReadOnly(true)}
                className="px-6 py-3 text-sm font-medium text-[#4f4441] hover:text-[#725950] transition-colors"
              >
                Descartar
              </button>
              <button
                disabled={loading}
                className="px-8 py-3 bg-[#725950] text-white text-sm font-medium rounded-xl hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
