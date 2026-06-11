import { NextRequest, NextResponse } from "next/server";
import { db } from "@pymetracker/db/create-client";
import { analisis, tiendas, empresas } from "@pymetracker/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";


type Calificaciones = {
  rating: number;
  total_resenas: number;
  ultimas_resenas: string[];
  rango_precio_gmaps: string;
};

type Precio = {
  producto: string;
  precio: number;
  imagen_url: string | null;
};

type EmpresaPayload = {
  id: number;
  nombre: string;
  calificaciones: Calificaciones;
  precios: Precio[] | null;
  sitio_web: string | null;
  ubicacion: string;
  google_maps_url: string;
};

type PayloadData = {
  empresas: EmpresaPayload[];
  busqueda: { tema: string; ubicacion: string };
  fecha: string;
  total_empresas: number;
  mas_valorado: string | null;
  mas_criticado: string | null;
  analisis_tienda_base: {
    comparacion_precios: string;
    comparacion_general: string;
    conclusion: string;
  } | null;
};


const palabrasPositivas = ["excelente", "bueno", "buena", "genial", "increíble", "recomendado", "rápido", "amable", "calidad", "mejores", "rico", "limpio", "profesional"];
const palabrasNegativas = ["malo", "mala", "pésimo", "lento", "caro", "sucio", "horrible", "terrible", "peor", "demora", "fraude", "decepción"];

const CHIPS_POSITIVOS = [
  "buen ambiente", "atención rápida", "local limpio", "sushi fresco",
  "buena calidad", "precios accesibles", "muy amable", "muy profesional",
  "recomendado", "buena presentación", "sabor excelente", "buena variedad",
  "excelente servicio", "muy rico", "buena atención", "lugar agradable",
  "calidad excelente", "muy bueno", "super recomendado", "buen sabor",
];

const CHIPS_NEGATIVOS = [
  "tiempos de espera", "calidad inconsistente", "mal servicio",
  "precios altos", "local sucio", "mala actitud", "demora en entrega",
  "porciones pequeñas", "poco sabor", "errores en pedido",
  "muy lento", "pésima atención", "muy caro", "mala calidad",
  "no recomendado", "lugar sucio", "mala experiencia", "tardaron mucho",
];


function parsearChips(texto: string | null, max: number = 4): string[] {
  if (!texto) return [];
  
  // Expresión regular para remover emojis también de los textos generales del rubro
  const regexEmojis = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu;
  const textoLimpio = texto.replace(regexEmojis, "");

  return textoLimpio
    .split(/[.,;]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => {
      const palabras = s.split(/\s+/).length;
      return palabras >= 1 && palabras <= 3 && s.length > 3 && s.length < 30;
    })
    .slice(0, max);
}

function extraerChipsDeResenas(resenas: string[], tipo: "positivo" | "negativo"): string[] {
  const diccionario = tipo === "positivo" ? CHIPS_POSITIVOS : CHIPS_NEGATIVOS;
  const encontrados: string[] = [];

  // Expresión regular robusta para detectar y eliminar Emojis de raíz
  const regexEmojis = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}]/gu;

  resenas.forEach((resena) => {
    // Eliminamos emojis antes de hacer la comparación
    const limpia = resena.replace(regexEmojis, "");
    const lower = limpia.toLowerCase();
    
    diccionario.forEach((chip) => {
      if (lower.includes(chip) && !encontrados.includes(chip) && encontrados.length < 4) {
        encontrados.push(chip);
      }
    });
  });

  // FALLBACK PROTEGIDO: Si el algoritmo manual no encuentra coincidencias exactas con el diccionario,
  // inyectamos conceptos macro de gestión limpios en vez de recortar trozos literales de los clientes.
  if (encontrados.length === 0) {
    if (tipo === "positivo") {
      return ["buena aceptación", "servicio estándar", "calidad aceptable", "atención regular"];
    } else {
      return ["oportunidad de mejora", "tiempo de espera regular", "detalles en preparación", "gestión de pedidos"];
    }
  }

  // Aseguramos la limpieza final en los resultados
  return encontrados.map(chip => chip.replace(regexEmojis, "").trim()).slice(0, 4);
}

function armarResenas(
  miNegocio: EmpresaPayload | undefined,
  competidor: EmpresaPayload | undefined,
  max: number = 5
): { texto: string; esPropio: boolean; nombre: string }[] {
  const resultado: { texto: string; esPropio: boolean; nombre: string }[] = [];

  if (miNegocio) {
    (miNegocio.calificaciones.ultimas_resenas ?? [])
      .slice(0, max)
      .forEach((texto) =>
        resultado.push({ texto, esPropio: true, nombre: miNegocio.nombre })
      );
  }

  if (competidor) {
    (competidor.calificaciones.ultimas_resenas ?? [])
      .slice(0, max)
      .forEach((texto) =>
        resultado.push({ texto, esPropio: false, nombre: competidor.nombre })
      );
  }

  return resultado;
}


export async function GET(request: NextRequest) {
  try {
    const usuario = await requireAuth(request);
    if (usuario instanceof NextResponse) return usuario;

    if (!usuario.empresaActivaId) {
      return NextResponse.json(
        { error: "No tienes una empresa asociada" },
        { status: 400 }
      );
    }

    const empresaId = usuario.empresaActivaId;
    const { searchParams } = new URL(request.url);
    const competidorNombre = searchParams.get("competidorNombre");

    const [empresaData, primerasTiendas] = await Promise.all([
      db
        .select({ nombre: empresas.nombre, direccion: empresas.direccion, comuna: empresas.comuna })
        .from(empresas)
        .where(eq(empresas.id, empresaId))
        .limit(1),
      db
        .select({ id: tiendas.id })
        .from(tiendas)
        .where(eq(tiendas.empresaId, empresaId))
        .limit(1),
    ]);

    const empresa = empresaData[0];
    const tienda = primerasTiendas[0];

    if (!empresa || !tienda) {
      return NextResponse.json(
        { error: "No se encontró empresa o tienda asociada" },
        { status: 400 }
      );
    }

    const [latest] = await db
      .select({
        id: analisis.id,
        fechaEjecucion: analisis.fechaEjecucion,
        payload: analisis.payloadData,
      })
      .from(analisis)
      .where(
        and(
          eq(analisis.tiendaId, tienda.id),
          eq(analisis.usuarioId, usuario.id),
          eq(analisis.status, "completed")
        )
      )
      .orderBy(desc(analisis.fechaEjecucion))
      .limit(1);

    if (!latest) {
      return NextResponse.json(
        { error: "No hay análisis disponibles para este usuario" },
        { status: 404 }
      );
    }

    const payload = latest.payload as PayloadData;
    const nombreEmpresa = empresa.nombre.toLowerCase().trim();

    const miNegocio = payload.empresas.find((e) => {
      const n = e.nombre.toLowerCase().trim();
      return n === nombreEmpresa || n.includes(nombreEmpresa) || nombreEmpresa.includes(n);
    });

    const todosCompetidores = payload.empresas.filter((e) => {
      const n = e.nombre.toLowerCase().trim();
      return n !== nombreEmpresa && !n.includes(nombreEmpresa) && !nombreEmpresa.includes(n);
    });

    const fortalezas_rubro = parsearChips(payload.mas_valorado, 4);
    const debilidades_rubro = parsearChips(payload.mas_criticado, 4);

    const reseniasPositivasMiNegocio = miNegocio?.calificaciones?.ultimas_resenas?.filter((r) => {
      const rLower = r.toLowerCase();
      return palabrasPositivas.some((p) => rLower.includes(p));
    }) ?? [];

    const reseniasNegativasMiNegocio = miNegocio?.calificaciones?.ultimas_resenas?.filter((r) => {
      const rLower = r.toLowerCase();
      return palabrasNegativas.some((p) => rLower.includes(p));
    }) ?? [];

    const chipsPositivosMiNegocio = extraerChipsDeResenas(reseniasPositivasMiNegocio, "positivo");
    const chipsNegativosMiNegocio = extraerChipsDeResenas(reseniasNegativasMiNegocio, "negativo");

    const totalResenasMiNegocio = miNegocio?.calificaciones?.total_resenas ?? 0;

    const fortalezas_mi_negocio = totalResenasMiNegocio > 0
      ? (chipsPositivosMiNegocio.length > 0 ? chipsPositivosMiNegocio : fortalezas_rubro)
      : [];

    const debilidades_mi_negocio = totalResenasMiNegocio > 0
      ? (chipsNegativosMiNegocio.length > 0 ? chipsNegativosMiNegocio : debilidades_rubro)
      : [];

    const competidores_disponibles = todosCompetidores.map((c) => ({
      nombre: c.nombre,
      rating: c.calificaciones.rating,
      total_resenas: c.calificaciones.total_resenas,
      ubicacion: c.ubicacion,
    }));

    const miNegocioResponse = {
      nombre: miNegocio?.nombre ?? empresa.nombre,
      rating: miNegocio?.calificaciones.rating ?? 0,
      total_resenas: miNegocio?.calificaciones.total_resenas ?? 0,
      rango_precio_gmaps: miNegocio?.calificaciones.rango_precio_gmaps ?? "No especificado",
      ubicacion: miNegocio?.ubicacion ?? empresa.comuna ?? empresa.direccion ?? "Ubicación no disponible",
    };

    let competidorResponse = null;
    let fortalezas_competidor = fortalezas_rubro;
    let debilidades_competidor = debilidades_rubro;
    let competidorElegido = undefined;

    if (competidorNombre) {
      competidorElegido = todosCompetidores.find((c) => {
        const n = c.nombre.toLowerCase().trim();
        const buscado = competidorNombre.toLowerCase().trim();
        return n === buscado || n.includes(buscado) || buscado.includes(n);
      });

      if (!competidorElegido) {
        return NextResponse.json(
          { error: `No se encontró el competidor "${competidorNombre}" en el análisis` },
          { status: 404 }
        );
      }

      const reseniasPositivasComp = competidorElegido.calificaciones?.ultimas_resenas?.filter((r) => {
        return palabrasPositivas.some((p) => r.toLowerCase().includes(p));
      }) ?? [];

      const reseniasNegativasComp = competidorElegido.calificaciones?.ultimas_resenas?.filter((r) => {
        return palabrasNegativas.some((p) => r.toLowerCase().includes(p));
      }) ?? [];

      const chipsPositivosComp = extraerChipsDeResenas(reseniasPositivasComp, "positivo");
      const chipsNegativosComp = extraerChipsDeResenas(reseniasNegativasComp, "negativo");

      fortalezas_competidor = chipsPositivosComp.length > 0 ? chipsPositivosComp : fortalezas_rubro;
      debilidades_competidor = chipsNegativosComp.length > 0 ? chipsNegativosComp : debilidades_rubro;

      competidorResponse = {
        nombre: competidorElegido.nombre,
        rating: competidorElegido.calificaciones.rating,
        total_resenas: competidorElegido.calificaciones.total_resenas,
        rango_precio_gmaps: competidorElegido.calificaciones.rango_precio_gmaps,
        sitio_web: competidorElegido.sitio_web,
        ubicacion: competidorElegido.ubicacion,
        google_maps_url: competidorElegido.google_maps_url,
      };
    }

    return NextResponse.json({
      fecha_analisis: latest.fechaEjecucion,
      mi_negocio: miNegocioResponse,
      competidor: competidorResponse,
      competidores_disponibles,
      fortalezas_rubro,
      debilidades_rubro,
      fortalezas_mi_negocio,
      debilidades_mi_negocio,
      fortalezas_competidor,
      debilidades_competidor,
      analisis_tienda_base: payload.analisis_tienda_base,
      resenas: armarResenas(miNegocio, competidorElegido),
    });

  } catch (error) {
    console.error("[GET /api/valoracion]", error);
    return NextResponse.json(
      { error: "Error al extraer el análisis" },
      { status: 500 }
    );
  }
}