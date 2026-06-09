"use client";
import {
  LayoutGrid, LayoutDashboard, ChartNoAxesCombined,
  Users, History, User, LogOut, ChevronDown, Plus, Check, Building2,
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
];

type Empresa = { id: number; nombre: string; rubro: string | null; rut: string | null };

function getInitials(nombre: string) {
  return nombre.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaActiva, setEmpresaActiva] = useState<Empresa | null>(null);
  const [switching, setSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function cargarEmpresas() {
      try {
        const res = await fetch("/api/empresas/mis-empresas");
        if (!res.ok) return;
        const { data } = await res.json();
        setEmpresas(data);

        // La empresa activa es la que coincide con empresaActivaId del token
        // La obtenemos del perfil actual
        const perfil = await fetch("/api/empresa/perfil");
        if (perfil.ok) {
          const { data: perfilData } = await perfil.json();
          if (perfilData) {
            const activa = data.find((e: Empresa) => e.id === perfilData.id);
            setEmpresaActiva(activa || data[0] || null);
          } else {
            setEmpresaActiva(data[0] || null);
          }
        }
      } catch (e) {
        console.error("Error cargando empresas:", e);
      }
    }
    cargarEmpresas();
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

  const handleSwitch = async (empresa: Empresa) => {
    if (empresa.id === empresaActiva?.id) { setOpen(false); return; }
    setSwitching(true);
    try {
      const res = await fetch("/api/empresas/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresaId: empresa.id }),
      });
      if (res.ok) {
        setEmpresaActiva(empresa);
        setOpen(false);
        router.refresh(); // recarga los datos de la página actual
      }
    } catch (e) {
      console.error("Error al cambiar empresa:", e);
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

      {/* Switcher de empresa */}
      {empresaActiva && (
        <div className="relative mb-4" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            disabled={switching}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-[#e4e2e2] bg-white hover:bg-[#f5f3f3] transition-all duration-200 disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className="w-7 h-7 rounded-lg bg-[#fedcd0] flex items-center justify-center text-[10px] font-bold text-[#725950] flex-shrink-0">
              {getInitials(empresaActiva.nombre)}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-xs font-semibold text-[#1b1c1c] truncate leading-tight">
                {empresaActiva.nombre}
              </p>
              <p className="text-[10px] text-[#817470] leading-tight">Empresa activa</p>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-[#817470] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e4e2e2] rounded-xl overflow-hidden shadow-[0_4px_16px_rgb(0,0,0,0.06)] z-50">
              {empresas.map((empresa) => {
                const isActive = empresa.id === empresaActiva.id;
                return (
                  <button
                    key={empresa.id}
                    onClick={() => handleSwitch(empresa)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#f5f3f3] transition-colors duration-150 text-left"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${isActive ? "bg-[#725950] text-white" : "bg-[#fedcd0] text-[#725950]"}`}>
                      {getInitials(empresa.nombre)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-medium text-[#1b1c1c] truncate">{empresa.nombre}</p>
                      {empresa.rubro && (
                        <p className="text-[10px] text-[#817470]">{empresa.rubro}</p>
                      )}
                    </div>
                    {isActive && <Check className="h-3 w-3 text-[#725950] flex-shrink-0" />}
                  </button>
                );
              })}

              <div className="border-t border-[#e4e2e2]">
                <Link
                  href="/perfil/create"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-[#725950] hover:bg-[#fedcd0]/30 transition-colors duration-150"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Nueva empresa
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