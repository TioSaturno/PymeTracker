import { describe, it, expect, beforeEach, vi } from "vitest";
import { POST as postRegistro } from "@/app/api/auth/registro/route";
import { POST as postLogin } from "@/app/api/auth/login/route";
import { POST as postForgotPassword } from "@/app/api/auth/forgot-password/route";
import { POST as postResetPassword } from "@/app/api/auth/reset-password/route";
import { db } from "@pymetracker/db/create-client";
import { usuarios, empresas, usuarioEmpresas } from "@pymetracker/db/schema";
import { eq } from "drizzle-orm";
import {
  cleanDatabase,
  createUser,
  createEmpresa,
  TEST_PASSWORD,
  TEST_PASSWORD_HASH,
  loggedCall,
} from "../helpers";

async function req(url: string, init?: any) {
  const { NextRequest } = await import("next/server");
  return new NextRequest(url, init);
}

describe("UT-01: Registro – validación de campos obligatorios", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 con body vacío", async () => {
    const r = await loggedCall(postRegistro,
      await req("http://localhost:3000/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({ nombre: "", email: "", password: "" }),
      }),
    );
    expect(r.status).toBe(400);
    const body = await r.json();
    expect(body.error).toMatch(/requeridos/i);
  });

  it("debe retornar 400 con email vacío", async () => {
    const r = await loggedCall(postRegistro,
      await req("http://localhost:3000/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({ nombre: "Test", email: "", password: "123" }),
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/requeridos/i);
  });
});

describe("UT-02: Registro – email duplicado", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 409 al registrar mismo email", async () => {
    await createUser({ nombre: "Test", email: "dup@test.com" });

    const r = await loggedCall(postRegistro,
      await req("http://localhost:3000/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          nombre: "Test",
          email: "dup@test.com",
          password: "123456",
        }),
      }),
    );
    expect(r.status).toBe(409);
    expect((await r.json()).error).toMatch(/registrado|duplicado/i);

    const users = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, "dup@test.com"));
    expect(users).toHaveLength(1);
  });
});

describe("UT-03: Login – credenciales inválidas", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 401 con email no registrado", async () => {
    const r = await loggedCall(postLogin,
      await req("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "noexiste@test.com",
          password: "x",
        }),
      }),
    );
    expect(r.status).toBe(401);
  });

  it("debe retornar 401 con password incorrecto", async () => {
    await createUser({ email: "existe@test.com" });

    const r = await loggedCall(postLogin,
      await req("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "existe@test.com",
          password: "wrongpassword",
        }),
      }),
    );
    expect(r.status).toBe(401);
  });
});

describe("UT-04: Login – campos vacíos", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 400 con email vacío", async () => {
    const r = await loggedCall(postLogin,
      await req("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "", password: "123" }),
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/requeridos/i);
  });

  it("debe retornar 400 con password vacío", async () => {
    const r = await loggedCall(postLogin,
      await req("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "test@test.com", password: "" }),
      }),
    );
    expect(r.status).toBe(400);
    expect((await r.json()).error).toMatch(/requeridos/i);
  });
});

describe("UT-05: Recuperación de contraseña – flujo completo", () => {
  beforeEach(async () => await cleanDatabase());

  it("flujo completo: forgot -> reset -> login", async () => {
    const { user } = await createUser({
      email: "resetflow@test.com",
      passwordHash: TEST_PASSWORD_HASH,
    });

    const forgotRes = await loggedCall(postForgotPassword,
      await req("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: "resetflow@test.com" }),
      }),
    );
    expect(forgotRes.status).toBe(200);

    const [userRow] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, "resetflow@test.com"))
      .limit(1);
    expect(userRow?.resetToken).toBeTruthy();
    expect(userRow?.resetTokenExpires).toBeTruthy();

    const { sendPasswordResetEmail } = await import("@/lib/mail");
    expect(sendPasswordResetEmail).toHaveBeenCalled();

    const resetCall = vi.mocked(sendPasswordResetEmail).mock.calls[0];
    const resetLink = resetCall[1] as string;
    const rawToken = new URL(resetLink).searchParams.get("token") as string;
    expect(rawToken).toBeTruthy();

    const resetRes = await loggedCall(postResetPassword,
      await req("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: rawToken, password: "newpass123" }),
      }),
    );
    expect(resetRes.status).toBe(200);

    const loginRes = await loggedCall(postLogin,
      await req("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "resetflow@test.com",
          password: "newpass123",
        }),
      }),
    );
    expect(loginRes.status).toBe(200);

    const usedTokenRes = await loggedCall(postResetPassword,
      await req("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: rawToken, password: "otra123" }),
      }),
    );
    expect(usedTokenRes.status).toBe(400);
    expect((await usedTokenRes.json()).error).toMatch(/inválido|utilizado/i);
  });

  it("debe retornar 400 con token inválido", async () => {
    const r = await loggedCall(postResetPassword,
      await req("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token: "tokennoexiste123",
          password: "newpass123",
        }),
      }),
    );
    expect(r.status).toBe(400);
  });
});

describe("IT-01: Registro exitoso – solo usuario", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 201 con token y sin empresa", async () => {
    const r = await loggedCall(postRegistro,
      await req("http://localhost:3000/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          nombre: "Juan",
          email: "juan@test.com",
          password: "pass123",
        }),
      }),
    );
    expect(r.status).toBe(201);

    const body = await r.json();
    expect(body.data.usuario).toBeDefined();
    expect(body.data.usuario.nombre).toBe("Juan");
    expect(body.data.usuario.email).toBe("juan@test.com");
    expect(body.data.usuario.empresaActivaId).toBeNull();
    expect(body.data.usuario.tiendaActivaId).toBeNull();
    expect(body.data.usuario.planActivo).toBe(false);

    const users = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, "juan@test.com"));
    expect(users).toHaveLength(1);
    expect(users[0].nombre).toBe("Juan");
  });
});

describe("IT-02: Registro exitoso – usuario + empresa", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe crear usuario, empresa, relación y tienda por defecto", async () => {
    const r = await loggedCall(postRegistro,
      await req("http://localhost:3000/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          nombre: "María",
          email: "maria@test.com",
          password: "pass123",
          empresaNombre: "Mi Empresa",
          empresaRubro: "tecnologia",
        }),
      }),
    );
    expect(r.status).toBe(201);

    const body = await r.json();
    expect(body.data.usuario.email).toBe("maria@test.com");
    expect(body.data.usuario.empresaActivaId).toBeTruthy();
    expect(body.data.usuario.tiendaActivaId).toBeTruthy();

    const empresasCreadas = await db
      .select()
      .from(empresas)
      .where(eq(empresas.nombre, "Mi Empresa"));
    expect(empresasCreadas).toHaveLength(1);

    const relaciones = await db
      .select()
      .from(usuarioEmpresas)
      .where(eq(usuarioEmpresas.usuarioId, body.data.usuario.id));
    expect(relaciones).toHaveLength(1);
  });
});

describe("IT-03: Login exitoso", () => {
  beforeEach(async () => await cleanDatabase());

  it("debe retornar 200 con token JWT que contiene id, email, rol, planActivo", async () => {
    const { user, token } = await createUser({
      email: "logintest@test.com",
    });
    const empresa = await createEmpresa(user.id);

    vi.mocked(fetch).mockRestore();

    const r = await loggedCall(postLogin,
      await req("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "logintest@test.com",
          password: TEST_PASSWORD,
        }),
      }),
    );
    expect(r.status).toBe(200);

    const body = await r.json();
    expect(body.data.usuario).toBeDefined();
    expect(body.data.usuario.id).toBe(user.id);
    expect(body.data.usuario.email).toBe("logintest@test.com");
    expect(body.data.usuario.rol).toBeDefined();
    expect(typeof body.data.usuario.planActivo).toBe("boolean");
    expect(body.data.usuario.empresaActivaId).toBeTruthy();
  });
});
