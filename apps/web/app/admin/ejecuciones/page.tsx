"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import PageHeader from "@/app/components/PageHeader";
import { Search, Calendar, User, Building2, PieChart as PieChartIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#725950",
  "#575f6b",
  "#5d5f5f",
  "#e0c0b4",
  "#bfc7d4",
  "#c6c6c7",
];

const RADIAN = Math.PI / 180;

interface Ejecucion {
  id: number;
  status: string | null;
  fechaEjecucion: string | null;
  usuarioNombre: string | null;
  tiendaNombre: string | null;
  empresaNombre: string | null;
  empresaRubro: string | null;
}

interface Usuario {
  id: number;
  nombre: string;
}

export default function AdminEjecucionesPage() {
  const [ejecuciones, setEjecuciones] = useState<Ejecucion[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [rubros, setRubros] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [rubro, setRubro] = useState("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await fetch("/api/usuarios");
        if (res.ok) {
          const data = await res.json();
          setUsuarios(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching usuarios:", err);
      }
    }
    fetchUsuarios();
  }, []);

  const fetchEjecuciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (fechaDesde) params.set("fechaDesde", fechaDesde);
      if (fechaHasta) params.set("fechaHasta", fechaHasta);
      if (usuarioId) params.set("usuarioId", usuarioId);
      if (rubro) params.set("rubro", rubro);

      const res = await fetch(`/api/admin/ejecuciones?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Error al obtener las ejecuciones");
      }
      const data = await res.json();
      setEjecuciones(data.data || []);

      const uniqueRubros = new Set<string>();
      (data.data || []).forEach((e: Ejecucion) => {
        if (e.empresaRubro) uniqueRubros.add(e.empresaRubro);
      });
      setRubros(Array.from(uniqueRubros));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [fechaDesde, fechaHasta, usuarioId, rubro]);

  useEffect(() => {
    fetchEjecuciones();
  }, [fetchEjecuciones]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return "bg-[#f5f3f3] text-[#4f4441] border-[#e4e2e2]";
    const styles: Record<string, string> = {
      completed: "bg-[#e3e3e3]/40 text-[#5d5f5f] border-[#e4e2e2]",
      pending: "bg-[#fedcd0]/40 text-[#725950] border-[#fedcd0]",
      running: "bg-[#dbe3f1]/40 text-[#575f6b] border-[#dbe3f1]",
      failed: "bg-[#ffdad6]/40 text-[#93000a] border-[#ffdad6]",
    };
    return styles[status] || "bg-[#f5f3f3] text-[#4f4441] border-[#e4e2e2]";
  };

  const handleLimpiarFiltros = () => {
    setFechaDesde("");
    setFechaHasta("");
    setUsuarioId("");
    setRubro("");
  };

  const rubroData = useMemo(() => {
    const counts: Record<string, number> = {};
    ejecuciones.forEach((e) => {
      const r = e.empresaRubro || "Sin rubro";
      counts[r] = (counts[r] || 0) + 1;
    });
    const total = ejecuciones.length;
    return Object.entries(counts)
      .map(([categoria, cantidad]) => ({
        categoria,
        cantidad,
        porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [ejecuciones]);

  const renderPieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-col gap-1.5 pl-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-[#4f4441] truncate max-w-[100px]">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <PageHeader pageTitle={<>EJECUCIONES<br/>ADMIN</>} />

      <main className="flex-grow p-8 w-full max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-[#725950]" />
            <h2 className="font-semibold text-[#1b1c1c]">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#817470] uppercase mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Fecha desde
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e4e2e2] rounded-xl text-sm text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#725950]/20 focus:border-[#725950] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#817470] uppercase mb-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Fecha hasta
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e4e2e2] rounded-xl text-sm text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#725950]/20 focus:border-[#725950] transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#817470] uppercase mb-1.5">
                <User className="h-3.5 w-3.5" />
                Usuario
              </label>
              <select
                value={usuarioId}
                onChange={(e) => setUsuarioId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e4e2e2] rounded-xl text-sm text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#725950]/20 focus:border-[#725950] transition-all"
              >
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#817470] uppercase mb-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Tipo de negocio
              </label>
              <select
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e4e2e2] rounded-xl text-sm text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#725950]/20 focus:border-[#725950] transition-all"
              >
                <option value="">Todos</option>
                {rubros.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleLimpiarFiltros}
              className="px-4 py-2 text-sm text-[#4f4441] hover:text-[#725950] hover:bg-[#f5f3f3] rounded-xl transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {!loading && ejecuciones.length > 0 && rubroData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <PieChartIcon className="h-5 w-5 text-[#725950]" />
                <h2 className="font-semibold text-[#1b1c1c]">Análisis por rubro</h2>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={rubroData}
                      dataKey="cantidad"
                      nameKey="categoria"
                      cx="50%"
                      cy="50%"
                      innerRadius="35%"
                      outerRadius="70%"
                      labelLine={false}
                      label={renderPieLabel}
                    >
                      {rubroData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fbf9f8"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _name: string, props: any) => [
                        `${value} análisis (${props.payload.porcentaje}%)`,
                        _name,
                      ]}
                      contentStyle={{
                        border: "1px solid #e4e2e2",
                        borderRadius: "12px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      content={renderLegend}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
              <h2 className="font-semibold text-[#1b1c1c] mb-4">Resumen</h2>
              <div className="text-3xl font-bold text-[#725950] mb-4">
                {ejecuciones.length} <span className="text-sm font-normal text-[#817470]">ejecuciones totales</span>
              </div>
              <div className="space-y-2">
                {rubroData.slice(0, 5).map((item, idx) => (
                  <div key={item.categoria} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-sm text-[#4f4441]">{item.categoria}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#1b1c1c]">{item.cantidad}</span>
                      <span className="text-xs text-[#817470] w-10 text-right">{item.porcentaje}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] w-full p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center font-semibold text-[#4f4441]">
            Cargando ejecuciones...
          </div>
        ) : error ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#ffdad6] w-full p-8 shadow-[0_8px_30px_rgb(186,26,26,0.04)] text-center font-semibold text-[#ba1a1a]">
            {error}
          </div>
        ) : ejecuciones.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] w-full p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center font-semibold text-[#4f4441]">
            No hay ejecuciones que coincidan con los filtros
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e4e2e2] bg-[#f5f3f3]/50">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#817470] uppercase tracking-wider">Usuario</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#817470] uppercase tracking-wider">Tienda</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#817470] uppercase tracking-wider">Empresa</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#817470] uppercase tracking-wider">Rubro</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#817470] uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#817470] uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ejecuciones.map((ejecucion) => (
                    <tr key={ejecucion.id} className="border-b border-[#e4e2e2]/50 hover:bg-[#f5f3f3]/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-[#1b1c1c] font-medium">
                        {ejecucion.usuarioNombre || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4441]">
                        {ejecucion.tiendaNombre || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4441]">
                        {ejecucion.empresaNombre || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4441]">
                        {ejecucion.empresaRubro || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 border rounded-full text-xs font-semibold uppercase ${getStatusBadge(ejecucion.status)}`}>
                          {ejecucion.status || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#4f4441]">
                        {formatDate(ejecucion.fechaEjecucion)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-[#e4e2e2] bg-[#f5f3f3]/30">
              <p className="text-xs text-[#817470]">
                {ejecuciones.length} ejecución{ejecuciones.length !== 1 ? "es" : ""} encontrada{ejecuciones.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
