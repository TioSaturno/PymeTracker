"use client";

import {
  LayoutGrid,
  ChartNoAxesCombined,
  Users,
  History,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Inicio", icon: LayoutGrid },
  { href: "/analisis", label: "Gráficas", icon: ChartNoAxesCombined },
  { href: "/analisis/historial", label: "Historial", icon: History },
  { href: "/competencia", label: "Competencia", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      <div className="p-4 mb-6">
        <div
          className="font-bold text-[1.5em]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          PYMETRACKER
        </div>
        <div
          className="text-xs mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Compite inteligente
        </div>
      </div>

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
              <Icon
                className={`h-5 w-5 ${isActive ? "text-[#725950]" : "text-[#817470]"}`}
              />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-[#e4e2e2]">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-[#4f4441] hover:bg-[#ffdad6]/30 hover:text-[#93000a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">
            {loading ? "Cerrando..." : "Cerrar Sesión"}
          </span>
        </button>
      </div>
    </aside>
  );
}
