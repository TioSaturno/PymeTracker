import { chromium } from "playwright";
import OpenAI from "openai";
import dotenv from "dotenv";
import { getPlacesData } from "./scrapers/scraper-maps";
import { CONFIG, scrapeSitio } from "./scrapers/scraper";
import { ProductoPrecio, PipelineOutput } from "./lib/scraperTypes";
import { STRUCTURED_JSON_PROMPT } from "./lib/prompt";
import { saveInDb } from "./db/save-db";

dotenv.config();

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function generarJsonEstructurado(
  datosCompletos: any,
): Promise<PipelineOutput | null> {
  console.log("\n🧠 Generando JSON estructurado con DeepSeek...");
  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        { role: "system", content: STRUCTURED_JSON_PROMPT },
        { role: "user", content: JSON.stringify(datosCompletos, null, 2) },
      ],
      temperature: 0.1,
      max_tokens: 50000,
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned) as PipelineOutput;
    } catch (parseError) {
      console.error(
        "[DeepSeek] JSON inválido. Respuesta cruda (últimos 500 chars):",
      );
      console.error(cleaned.slice(-500));
      console.error("\nFinish reason:", response.choices[0]?.finish_reason);
      return null;
    }
  } catch (error) {
    console.error("[DeepSeek] Error generando JSON estructurado:", error);
    return null;
  }
}

function calcularRangoPrecios(menu: ProductoPrecio[]): string | null {
  if (!menu || menu.length === 0) return null;

  let min = Infinity;
  let max = -Infinity;

  for (const item of menu) {
    // Limpiar el precio para extraer el número (cubre "$2.500", "2500", "CLP 2.500")
    const numStr = item.precio.replace(/[^\d]/g, "");
    if (!numStr) continue;

    const precioNum = parseInt(numStr, 10);
    if (isNaN(precioNum)) continue;

    if (precioNum < min) min = precioNum;
    if (precioNum > max) max = precioNum;
  }

  if (min === Infinity || max === -Infinity) return null;
  if (min === max) return `$${min.toLocaleString("es-CL")}`;

  return `$${min.toLocaleString("es-CL")} - $${max.toLocaleString("es-CL")}`;
}

const pipeline = async (tiendaBase?: string) => {
  const topic = "Sushi";
  const location = "Ñuñoa";
  const nResults = 5;

  const places = await getPlacesData(topic, location, nResults);
  if (!places || places.length === 0) {
    console.log("No se encontraron lugares para analizar.");
    return;
  }

  const browser = await chromium.launch({ headless: CONFIG.headless });
  const datosGlobales = [];

  for (const place of places) {
    const url = place.sitio_web;

    // Objeto base para cada local
    const localData: any = {
      localName: place.nombre,
      PlacesData: { ...place },
      menu: [],
    };

    if (
      url &&
      url.includes("http") &&
      !url.includes("instagram") &&
      !url.includes("facebook") &&
      !url.includes("tiktok") &&
      !url.includes("whatsapp") &&
      !url.includes("pdf") // proximamente proceso para extraer PDFs y menus de instagram
    ) {
      const data = await scrapeSitio(url, browser);
      localData.menu = data.preciosExtraidos;
    }

    datosGlobales.push(localData);
  }

  await browser.close();

  // Buscar la tienda base en los datos recopilados (si se proporcionó)
  let tiendaBaseData: any = null;
  if (tiendaBase) {
    const match = datosGlobales.find((local) =>
      local.localName.toLowerCase().includes(tiendaBase.toLowerCase()),
    );
    if (match) {
      tiendaBaseData = {
        localName: match.localName,
        PlacesData: match.PlacesData,
        productosConPrecios: match.menu,
      };
      console.log(`\n🏪 Tienda base identificada: ${match.localName}`);
    } else {
      console.warn(
        `\n⚠️ No se encontró "${tiendaBase}" entre los resultados. El análisis comparativo no estará disponible.`,
      );
    }
  }

  // Preparar datos completos para el LLM (incluimos los productos individuales)
  const datosParaLLM = {
    busqueda: { tema: topic, ubicacion: location },
    tienda_base: tiendaBaseData,
    negocios: datosGlobales.map((local) => ({
      localName: local.localName,
      PlacesData: local.PlacesData,
      productosConPrecios: local.menu,
    })),
  };

  // Generar JSON estructurado con DeepSeek
  const resultado = await generarJsonEstructurado(datosParaLLM);

  console.log("\n========================================");
  console.log("RESULTADO JSON ESTRUCTURADO:");
  console.log("========================================");
  console.log(JSON.stringify(resultado, null, 2));
  console.log("\n========================================");

  // Guardar en la base de datos
  saveInDb(resultado);

  return resultado;
};

// Ejecutar el pipeline. Pasar el nombre de la tienda base como argumento para obtener análisis comparativo.
// Ejemplo: pipeline("Yako Sushi") o pipeline() para solo recopilar datos sin análisis.
pipeline();
