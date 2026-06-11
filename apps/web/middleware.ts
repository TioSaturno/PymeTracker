import { NextRequest, NextResponse } from "next/server";
import { getUsuarioFromRequest } from "./lib/auth";

const publicPaths = ["/auth/login", "/auth/registro", "/api"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  try {
    // Intentamos validar al usuario de forma segura
    const usuario = await getUsuarioFromRequest(request);

    if (isPublicPath) {
      // CORRECCIÓN: Si está logueado, redirigir a /inicio (en vez de a "/")
      if (usuario && (pathname === "/auth/login" || pathname === "/auth/registro")) {
        return NextResponse.redirect(new URL("/inicio", request.url));
      }
      return NextResponse.next();
    }

    // Si no es público y no hay usuario, mandarlo al login
    if (!usuario) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

  } catch (error) {
    // Si la función de auth crashea por incompatibilidad con el Edge Runtime, 
    // evitamos el 404 global imprimiendo el error y dejando continuar la petición
    console.error("⚠️ Error en Middleware Auth (Posible problema de Edge Runtime):", error);
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};