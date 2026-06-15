import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export async function POST(request: NextRequest) {
  try {
    const { resenas } = await request.json();

    if (!resenas || !Array.isArray(resenas) || resenas.length === 0) {
      return NextResponse.json(
        { error: "Se requiere un array de reseñas" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `Resume las siguientes reseñas de clientes en un párrafo corto de máximo 2 oraciones en español. Destaca los puntos más importantes que mencionan los clientes.

Reseñas:
${resenas.map((r, i) => `${i + 1}. ${r}`).join("\n")}`;

    const result = await model.generateContent(prompt);
    const resumen = result.response.text();

    return NextResponse.json({ resumen });
  } catch (error) {
    console.error("[POST /api/resumen-opiniones]", error);
    return NextResponse.json(
      { error: "Error al generar el resumen de opiniones" },
      { status: 500 }
    );
  }
}
