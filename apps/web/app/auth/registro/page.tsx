import Link from "next/link";

export default function RegistroPage() {
  return (
    <main
      className="flex min-w-screen items-center justify-center min-h-screen bg-[#fbf9f8]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#e4e2e2] border-t-white/50 border-l-white/50 p-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-semibold text-[#1b1c1c]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Crear Cuenta
          </h2>
          <p className="text-[#4f4441] mt-1">MÓDULO DE REGISTRO</p>
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-[#4f4441] mb-2"
            >
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              placeholder="Juan Pérez"
              required
              className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-[#f5f3f3]/50 outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#4f4441] mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="correo@empresa.com"
              required
              className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-[#f5f3f3]/50 outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#4f4441] mb-2"
            >
              Nueva Clave
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
              className="w-full border border-[#e4e2e2] rounded-xl px-4 py-3 text-sm text-[#1b1c1c] bg-[#f5f3f3]/50 outline-none placeholder:text-[#817470] focus:border-[#725950] focus:ring-2 focus:ring-[#725950]/20 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#725950] text-white py-3 rounded-xl font-semibold hover:bg-[#5d4a42] transition-all duration-200 shadow-[0_4px_16px_rgba(114,89,80,0.2)]"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#4f4441]">¿Ya tienes cuenta?</p>
          <Link
            href="/auth/login"
            className="font-semibold text-[#725950] hover:text-[#5d4a42] underline underline-offset-2"
          >
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
