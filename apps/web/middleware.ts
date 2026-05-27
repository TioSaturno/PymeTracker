import { NextRequest, NextResponse } from "next/server";
import { getUsuarioFromRequest } from "./lib/auth";

const publicPaths = ["/auth/login", "/auth/registro", "/api"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(pathname);

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isPublicPath) {
    const usuario = await getUsuarioFromRequest(request);

    if (
      usuario &&
      (pathname === "/auth/login" || pathname === "/auth/registro")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
