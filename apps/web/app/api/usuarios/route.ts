import { NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { usuarios } from "@pymetracker/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(usuarios);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[GET /api/usuarios]", error);
    return NextResponse.json(
      { error: "Error al consultar usuarios" },
      { status: 500 },
    );
  }
}
