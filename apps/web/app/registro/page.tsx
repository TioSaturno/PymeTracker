import Link from "next/link";

export default function RegistroPage() {
  return (
    <main className="contenedor-principal">
      <div className="tarjeta">
        <div className="encabezado">
          <h2>Crear Cuenta</h2>
          <p className="subtitulo">MÓDULO DE REGISTRO</p>
        </div>

        <div className="flex gap-[50px]">
          <h2>nashei</h2>
          <h3>nashei2</h3>
        </div>

        <form>
          <div className="campo">
            <label htmlFor="nombre">Nombre Completo</label>
            <input type="text" id="nombre" placeholder="Juan Pérez" required />
          </div>

          <div className="campo">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="correo@empresa.com"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="password">Nueva Clave</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-principal">
            Registrarse
          </button>
        </form>

        <div className="pie-tarjeta">
          <p>¿Ya tienes cuenta?</p>
          <Link href="/" className="font-bold underline">
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </main>
  );
}
