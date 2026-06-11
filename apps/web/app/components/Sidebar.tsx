"use client";
import {
  LayoutGrid, LayoutDashboard, ChartNoAxesCombined,
  Users, History, User, LogOut, ChevronDown, MapPin, Plus, Check, LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { href: "/", label: "Inicio", icon: LayoutGrid },
  { href: "/perfil/edit", label: "Mi Perfil", icon: User },
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/analisis/historial", label: "Historial", icon: History },
  { href: "/competencia", label: "Competencia", icon: Users },
  { href: "/analisis", label: "Gráficas", icon: ChartNoAxesCombined },
  { href: "/tickets", label: "Soporte", icon: LifeBuoy },
];

type Tienda = { id: number; nombre: string; direccion: string | null };

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sucursales, setSucursales] = useState<Tienda[]>([]);
  const [activa, setActiva] = useState<Tienda | null>(null);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function cargarSucursales() {
      try {
        const res = await fetch("/api/empresa/perfil");
        if (!res.ok) return;
        const { data } = await res.json();
        if (!data?.tiendas?.length) return;
        setSucursales(data.tiendas);
        const activaDesdeToken = data.tiendas.find(
          (t: Tienda) => t.id === data.tiendaActivaId
        );
        setActiva(activaDesdeToken || data.tiendas[0]);
      } catch (e) {
        console.error("Error cargando sucursales:", e);
      }
    }
    cargarSucursales();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = async (tienda: Tienda) => {
    if (tienda.id === activa?.id) { setOpen(false); return; }
    setSwitching(true);
    try {
      const res = await fetch("/api/sucursales/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tiendaId: tienda.id }),
      });
      if (res.ok) {
        setActiva(tienda);
        setOpen(false);
        router.refresh();
      }
    } catch (e) {
      console.error("Error al cambiar sucursal:", e);
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-[#e4e2e2] p-5 flex flex-col">

      {/* Switcher de sucursal */}
      {sucursales.length > 0 && (
        <div className="relative mb-4" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            disabled={switching}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#e4e2e2] bg-white hover:bg-[#f5f3f3] transition-all duration-200 disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-7 h-7 rounded-lg bg-[#fedcd0] flex items-center justify-center flex-shrink-0">
              <MapPin className="h-3.5 w-3.5 text-[#725950]" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-xs font-semibold text-[#1b1c1c] truncate leading-tight">
                {activa?.nombre ?? "Sucursal"}
              </p>
              <p className="text-[10px] text-[#817470] truncate leading-tight">
                {activa?.direccion ?? "Sin dirección"}
              </p>
            </div>
            <ChevronDown className={`h-3.5 w-3.5 text-[#817470] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e2e2] rounded-xl overflow-hidden shadow-[0_4px_16px_rgb(0,0,0,0.06)] z-50">
              {sucursales.map((tienda) => {
                const isActive = tienda.id === activa?.id;
                return (
                  <button
                    key={tienda.id}
                    onClick={() => handleSwitch(tienda)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#f5f3f3] transition-colors duration-150 text-left"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isActive ? "bg-[#725950]" : "bg-[#fedcd0]"}`}>
                      <MapPin className={`h-3 w-3 ${isActive ? "text-white" : "text-[#725950]"}`} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-medium text-[#1b1c1c] truncate">{tienda.nombre}</p>
                      <p className="text-[10px] text-[#817470] truncate">{tienda.direccion ?? "Sin dirección"}</p>
                    </div>
                    {isActive && <Check className="h-3 w-3 text-[#725950] flex-shrink-0" />}
                  </button>
                );
              })}
              <div className="border-t border-[#e4e2e2]">
                <Link
                  href="/sucursales/nueva"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-[#725950] hover:bg-[#fedcd0]/30 transition-colors duration-150"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Agregar sucursal
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Logo */}
      <div className="p-4 mb-6">
        <div className="font-bold text-[1.5em]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          PYMETRACKER
        </div>
        <div className="text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
          Compite inteligente
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-x-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                isActive
                  ? "bg-[#fedcd0] text-[#1b1c1c] font-semibold shadow-sm"
                  : "text-[#4f4441] hover:bg-[#f5f3f3]"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#725950]" : "text-[#817470]"}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-[#e4e2e2]">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-[#4f4441] hover:bg-[#ffdad6]/30 hover:text-[#93000a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">{loading ? "Cerrando..." : "Cerrar Sesión"}</span>
        </button>
      </div>
    </aside>
  );
}