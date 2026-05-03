import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="contenedor-principal">
      <div className="tarjeta">
        <div className="encabezado">
          <h2>Ingreso al Sistema</h2>
          <p className="subtitulo">PERSONA AUTORIZADA</p>
        </div>

        <form>
          <div className="campo">
            <label htmlFor="email">Correo Corporativo</label>
            <input type="email" id="email" placeholder="ejemplo@empresa.com" required />
          </div>

          <div className="campo">
            <label htmlFor="password">Clave de Acceso</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn-principal">
            Autenticar Acceso
          </button>
        </form>

        <div className="pie-tarjeta">
          <p>¿No tienes cuenta?</p>
          <Link href="/registro" className="font-bold underline">
            SOLICITAR ACCESO
          </Link>
        </div>
      </div>
    </main>
  );
}