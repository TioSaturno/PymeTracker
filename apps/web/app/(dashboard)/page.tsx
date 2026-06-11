"use client";

import { Building2, Users, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import PageHeader from "@/app/components/PageHeader";


type NegocioResumen = {
  nombre: string;
  rating: number;
  total_resenas: number;
  rango_precio_gmaps: string;
  ubicacion: string;
};


type CompetidorDisponible = {
  nombre: string;
  rating: number;
  total_resenas: number;
  ubicacion: string;
};

type Resena = {
  texto: string;
  esPropio: boolean;
  nombre: string;
};

type DatosDashboard = {
  fecha_analisis: string;
  mi_negocio: NegocioResumen | null;
  competidor: NegocioResumen | null;
  competidores_disponibles: CompetidorDisponible[];
  fortalezas_rubro: string[];
  debilidades_rubro: string[];
  analisis_tienda_base: {
    comparacion_precios: string;
    comparacion_general: string;
    conclusion: string;
  } | null;
  resenas: Resena[];
};



function PanelNegocio({
  titulo,
  negocio,
  fortalezas,
  debilidades,
  esPropio,
}: {
  titulo: string;
  negocio: NegocioResumen;
  fortalezas: string[];
  debilidades: string[];
  esPropio: boolean;
}) {
  const accentColor = esPropio ? "#725950" : "#575f6b";
  const bgIcon = esPropio ? "bg-[#fedcd0]/50" : "bg-[#dbe3f1]/50";

  return (
    <div className="flex-1">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${bgIcon} rounded-xl`}>
            {esPropio
              ? <Building2 className="h-6 w-6" style={{ color: accentColor }} />
              : <Users className="h-6 w-6" style={{ color: accentColor }} />
            }
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#817470]">
              {titulo}
            </p>
            <h3
              className="text-base font-semibold text-[#1b1c1c] truncate max-w-[200px]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              title={negocio.nombre}
            >
              {negocio.nombre}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <span
            className="text-3xl font-bold"
            style={{ color: accentColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
             {negocio.rating.toFixed(1)}
          </span>
          <p className="text-[10px] text-[#817470] font-semibold uppercase mt-1">
            Rating Google
          </p>
        </div>
      </div>

      <p className="text-xs text-[#4f4441] font-semibold uppercase mb-4">
        Total Reseñas: {negocio.total_resenas.toLocaleString("es-CL")}
      </p>

      <div className="space-y-3">
        {fortalezas.length > 0 && (
          <div>
            <p className="text-[10px] text-[#817470] font-semibold uppercase mb-2">
              Fortalezas del rubro
            </p>
            <div className="flex flex-wrap gap-2">
               {fortalezas.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#e3e3e3]/40 text-[#5d5f5f] text-[10px] font-semibold rounded-full border border-[#e4e2e2]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
        {debilidades.length > 0 && (
          <div>
            <p className="text-[10px] text-[#817470] font-semibold uppercase mb-2">
              Áreas de mejora del rubro
            </p>
            <div className="flex flex-wrap gap-2">
              {debilidades.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#ffdad6]/40 text-[#93000a] text-[10px] font-semibold rounded-full border border-[#ffdad6]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function ResenaCard({ texto, esPropio, nombre }: Resena) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 flex flex-col gap-4 hover:border-[#d3c3be] transition-all duration-200 shadow-[0_4px_16px_rgb(0,0,0,0.03)]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-[#f5f3f3] rounded-full flex items-center justify-center font-semibold text-[#817470] border border-[#e4e2e2]">
            G
          </div>
          <div>
            <h4 className="font-semibold text-[#1b1c1c] text-sm">
              Reseña de Google Maps
            </h4>
            <p className="text-xs text-[#4f4441]">
              {esPropio ? "Tu negocio" : "Competencia"} • {nombre}
            </p>
          </div>
        </div>
        <span
          className={`text-[9px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
            esPropio
              ? "bg-[#725950] text-white"
              : "bg-[#f5f3f3] text-[#4f4441] border border-[#e4e2e2]"
          }`}
        >
          {esPropio ? "Mi Negocio" : "Competencia"}
        </span>
      </div>
      <p className="text-[#4f4441] text-sm leading-relaxed italic">
         &ldquo;{texto}&rdquo;
      </p>
    </div>
  );
}


export default function DashboardPage() {
  const [datos, setDatos] = useState<DatosDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [loadingCompetidor, setLoadingCompetidor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"ambos" | "mi_negocio" | "competencia">("ambos");
 
  const [competidorSeleccionado, setCompetidorSeleccionado] = useState<string>("");

  const router = useRouter();

  const cargarCompetidor = useCallback(async (nombre: string, datosBase?: DatosDashboard) => {
    if (!nombre) return;
    try {
      setLoadingCompetidor(true);
      const res = await fetch(
        `/api/valoracion?competidorNombre=${encodeURIComponent(nombre)}`
      );
      const json = await res.json();
      if (json.error) throw new Error(json.error);

     
      setDatos((prev) => ({
        ...(datosBase ?? prev!),
        competidor: json.competidor,
        mi_negocio: json.mi_negocio ?? (datosBase ?? prev)?.mi_negocio ?? null,
        fortalezas_rubro: json.fortalezas_rubro,
        debilidades_rubro: json.debilidades_rubro,
        analisis_tienda_base: json.analisis_tienda_base,
        fecha_analisis: json.fecha_analisis,
        resenas: json.resenas,
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingCompetidor(false);
    }
  }, []);

  
  const cargarInicial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/valoracion");
      if (res.status === 401) { router.push("/auth/login"); return; }
      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setDatos(json);

      
      if (json.competidores_disponibles?.length > 0) {
        const primero = json.competidores_disponibles[0].nombre;
        setCompetidorSeleccionado(primero);
        
        await cargarCompetidor(primero, json);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cargarCompetidor, router]);

  useEffect(() => { cargarInicial(); }, [cargarInicial]);

  
  const handleCambioCompetidor = async (nombre: string) => {
    setCompetidorSeleccionado(nombre);
    await cargarCompetidor(nombre);
  };

  
  const resenasFiltradas = (datos?.resenas ?? []).filter((r) => {
    if (filtro === "ambos") return true;
    if (filtro === "mi_negocio") return r.esPropio;
    return !r.esPropio;
  });

  

  
  if (loading) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-[#725950] mb-4" />
        <span className="text-[#4f4441]" style={{ fontFamily: "'Inter', sans-serif" }}>
          Cargando análisis...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center p-10" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-md text-center space-y-6">
          <p className="text-5xl mb-2">🔍</p>
          <h2 className="text-xl font-bold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Aún no ejecutas tu primer análisis
          </h2>
          <p className="text-sm text-[#4f4441]">
            Ejecuta un análisis de competencia para ver cómo se compara tu negocio con otros del rubro.
          </p>
          <a
            href="/analisis/historial"
            className="inline-block bg-[#725950] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
          >
            Ir a ejecutar análisis →
          </a>
        </div>
      </div>
    );
  }

  if (!datos) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] flex flex-col items-center justify-center p-10" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="max-w-md text-center space-y-6">
          <p className="text-5xl mb-2">🔍</p>
          <h2 className="text-xl font-bold text-[#1b1c1c]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Aún no ejecutas tu primer análisis
          </h2>
          <p className="text-sm text-[#4f4441]">
            Ejecuta un análisis de competencia para ver cómo se compara tu negocio con otros del rubro.
          </p>
          <a
            href="/analisis/historial"
            className="inline-block bg-[#725950] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
          >
            Ir a ejecutar análisis →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <main className="flex-1 bg-[#fbf9f8]">
        <PageHeader
          pageTitle={<>ANÁLISIS DE<br />{datos.mi_negocio?.nombre ?? "MI NEGOCIO"}</>}
          pageDescription={`Basado en el último reporte (${new Date(datos.fecha_analisis).toLocaleDateString("es-CL")})`}
        >
          <button
            onClick={cargarInicial}
            className="bg-[#725950] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </PageHeader>

        <div className="p-8">
          <div className="max-w-5xl mx-auto">

          
            {datos.competidores_disponibles.length > 0 && (
              <div className="mb-6 flex items-center gap-4">
                <div>
                  <label
                    htmlFor="selector-competidor"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#817470] mb-2"
                  >
                    Comparar con
                  </label>
                  <select
                    id="selector-competidor"
                    value={competidorSeleccionado}
                    onChange={(e) => handleCambioCompetidor(e.target.value)}
                    disabled={loadingCompetidor}
                    className="border border-[#e4e2e2] rounded-xl px-4 py-2.5 text-sm font-medium text-[#1b1c1c] bg-white/80 backdrop-blur-xl outline-none cursor-pointer focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200 min-w-[220px] disabled:opacity-60"
                  >
                    {datos.competidores_disponibles.map((c) => (
                      <option key={c.nombre} value={c.nombre}>
                        {c.nombre} ({c.rating.toFixed(1)}⭐ · {c.total_resenas} reseñas)
                      </option>
                    ))}
                  </select>
                </div>
                {loadingCompetidor && (
                  <div className="flex items-center gap-2 text-xs text-[#817470] mt-5">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Cargando...
                  </div>
                )}
              </div>
            )}

            
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-6 mb-8 flex flex-col md:flex-row gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

              
              {datos.mi_negocio && (
                <PanelNegocio
                  titulo="Mi Negocio"
                  negocio={datos.mi_negocio}
                  fortalezas={datos.fortalezas_rubro}
                  debilidades={datos.debilidades_rubro}
                  esPropio={true}
                />
              )}

              <div className="hidden md:block w-px bg-[#e4e2e2]" />

              
              {datos.competidor ? (
                <PanelNegocio
                  titulo="Competencia"
                  negocio={datos.competidor}
                  fortalezas={datos.fortalezas_rubro}
                  debilidades={datos.debilidades_rubro}
                  esPropio={false}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-[#817470] italic text-sm">
                    Selecciona un competidor para comparar.
                  </p>
                </div>
              )}
            </div>

            
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-semibold text-[#1b1c1c]"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Reseñas reales
              </h3>
              <div className="flex bg-[#f5f3f3] p-1 rounded-xl border border-[#e4e2e2]">
                {(["ambos", "mi_negocio", "competencia"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltro(f)}
                    disabled={f === "competencia" && !datos.competidor}
                    className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      filtro === f
                        ? "bg-white shadow-sm text-[#1b1c1c]"
                        : "text-[#4f4441] hover:text-[#1b1c1c]"
                    } ${f === "competencia" && !datos.competidor ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {f === "ambos" ? "Ambos" : f === "mi_negocio" ? "Mi Negocio" : "Competencia"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {resenasFiltradas.length > 0 ? (
                resenasFiltradas.map((r, i) => (
                  <ResenaCard key={i} {...r} />
                ))
              ) : (
                <div className="text-center py-10 bg-white/60 backdrop-blur-xl border border-dashed border-[#d3c3be] rounded-2xl">
                  <p className="text-[#4f4441]">
                    No hay reseñas para mostrar con el filtro actual.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
