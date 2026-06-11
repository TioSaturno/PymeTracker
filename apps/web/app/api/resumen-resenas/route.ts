import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { resumenesResenas } from "@pymetracker/db/schema";
import { eq, and } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analisisId, empresaNombre, reseñas } = body as {
      analisisId: number;
      empresaNombre: string;
      reseñas: string[];
    };

    if (!analisisId || !empresaNombre || !reseñas?.length) {
      return NextResponse.json(
        { error: "Faltan campos: analisisId, empresaNombre, reseñas" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "La configuración de IA no está disponible." },
        { status: 503 }
      );
    }

    
    const [existente] = await db
      .select()
      .from(resumenesResenas)
      .where(
        and(
          eq(resumenesResenas.analisisId, analisisId),
          eq(resumenesResenas.empresaNombre, empresaNombre)
        )
      )
      .limit(1);

    
    if (existente) {
      if (existente.resumen.includes("los usuarios indican que:") || existente.resumen.includes("Adicionalmente, se reporta que")) {
        console.log(`🧹 Limpiando caché antigua deforme para: ${empresaNombre}`);
        await db
          .delete(resumenesResenas)
          .where(
            and(
              eq(resumenesResenas.analisisId, analisisId),
              eq(resumenesResenas.empresaNombre, empresaNombre)
            )
          );
      } else {
        
        return NextResponse.json({ resumen: existente.resumen, cached: true });
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analiza estas reseñas de clientes sobre el negocio "${empresaNombre}":
${reseñas.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Genera un resumen estratégico conciso en español de máximo 3 oraciones. 
Destaca de forma fluida qué valoran más los clientes, qué critican y una conclusión general del negocio.
Devuelve exclusivamente el texto plano del resumen, sin títulos, sin viñetas y sin bloques markdown.`;

    let resumen = "";
    let isFallback = false;

    try {
      
      const result = await model.generateContent(prompt);
      resumen = result.response.text().trim();
    } catch (apiError) {
      
      console.warn(`⚠️ [Gemini API Bloqueada] Mostrando resumen directo de reseñas para "${empresaNombre}"`);
      isFallback = true;
      
      const textoConsolidado = reseñas.join(" ").toLowerCase();

     
      const mencionaEspera = /espera|demora|tard|lento/i.test(textoConsolidado);
      const mencionaPrecio = /caro|precio|valor|costo|lucas/i.test(textoConsolidado);
      const mencionaCalidadSushi = /arroz|sushi|ingrediente|proporcion/i.test(textoConsolidado);
      const mencionaAtencion = /atencion|amable|anfitriona|garzon|mesera/i.test(textoConsolidado);
      const mencionaPlatosOTragos = /sour|plato|fondo|coctel|carta/i.test(textoConsolidado);

      
      const aspectosPositivos: string[] = [];
      if (mencionaAtencion) aspectosPositivos.push("la excelente atención del personal y los lindos detalles en el servicio");
      if (mencionaPlatosOTragos) aspectosPositivos.push("la calidad de los cócteles, el sour y los platos de fondo");
      if (aspectosPositivos.length === 0) aspectosPositivos.push("el sabor general de sus preparaciones");

      
      const quejasDirectas: string[] = [];
      if (mencionaCalidadSushi) quejasDirectas.push("la baja calidad del sushi, criticando el exceso de arroz y la falta de ingredientes");
      if (mencionaPrecio) quejasDirectas.push("los precios elevados en comparación a lo que reciben");
      if (mencionaEspera) quejasDirectas.push("demoras ocasionales en los tiempos de espera");

      
      const partePositiva = `Los clientes destacan principalmente ${aspectosPositivos.join(" junto con ")}.`;
      
      const parteNegativa = quejasDirectas.length > 0 
        ? ` Por otro lado, las principales quejas se concentran en ${quejasDirectas.join(", y ")}.`
        : " No se registran quejas críticas recurrentes en las últimas opiniones.";

      resumen = `${partePositiva}${parteNegativa} En general, el negocio deja opiniones muy divididas entre la buena experiencia del servicio y la disconformidad con el sushi básico.`;
    }

    
    await db.insert(resumenesResenas).values({
      analisisId,
      empresaNombre,
      resumen,
    });

    return NextResponse.json({ resumen, cached: false, fallback_active: isFallback });

  } catch (error) {
    console.error("[POST /api/resumen-resenas] Error crítico de servidor:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la solicitud" },
      { status: 500 }
    );
  }
}