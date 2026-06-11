import { chromium } from "playwright";
import OpenAI from "openai";
import dotenv from "dotenv";
import { getPlacesData } from "./scrapers/scraper-maps";
import { CONFIG, scrapeSitio } from "./scrapers/scraper";
import { ProductoPrecio, PipelineOutput } from "./lib/scraperTypes";
import { STRUCTURED_JSON_PROMPT } from "./lib/prompt";
import { updateStatus, saveInDb, updateProcesado, obtenerEmailUsuario } from "./db/save-db";
import { processWithDeepSeek } from "./services/deepseek";
import { enviarCorreoAnalisis } from "./services/email";

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

export async function runPipeline(
  analisisId: number,
  topic: string,
  location: string,
  nResults: number,
  tiendaBase?: string,
) {
  try {
    console.log(`\n🚀 Iniciando pipeline para: ${topic} en ${location}`);

    // 1. Places Search
    await updateStatus(analisisId, "places_search");
    const places = await getPlacesData(topic, location, nResults);
    if (!places || places.length === 0) {
      console.log("No se encontraron lugares para analizar.");
      await updateStatus(analisisId, "failed");
      return null;
    }

    // 2. Web Scraping
    await updateStatus(analisisId, "web_scraping");
    const browser = await chromium.launch({ headless: CONFIG.headless });
    const datosGlobales: any[] = [];

    for (const place of places) {
      const url = place.sitio_web;
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
        !url.includes("pdf")
      ) {
        const data = await scrapeSitio(url, browser);
        localData.menu = data.preciosExtraidos;
      }

      datosGlobales.push(localData);
    }

    await browser.close();

    // 3. Preparar datos y analizar con LLM
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
          `\n⚠️ No se encontró "${tiendaBase}" entre los resultados.`,
        );
      }
    }

    const datosParaLLM = {
      busqueda: { tema: topic, ubicacion: location },
      tienda_base: tiendaBaseData,
      negocios: datosGlobales.map((local) => ({
        localName: local.localName,
        PlacesData: local.PlacesData,
        productosConPrecios: local.menu,
      })),
    };

    await updateStatus(analisisId, "llm_analysis");
    const resultado = await generarJsonEstructurado(datosParaLLM);

    console.log("\n========================================");
    console.log("RESULTADO JSON ESTRUCTURADO:");
    console.log("========================================");
    console.log(JSON.stringify(resultado, null, 2));

    await updateStatus(analisisId, "completed", resultado);

    if (resultado) {
      console.log("\n🧠 Procesando datos para gráficos con DeepSeek...");
      const llmResults = await processWithDeepSeek([resultado]);
      if (llmResults[0]) {
        await updateProcesado(analisisId, llmResults[0]);
        console.log("✅ Datos procesados y guardados para gráficos");
      }

      const email = await obtenerEmailUsuario(analisisId);
      if (email) {
        await enviarCorreoAnalisis(email, resultado);
      }
    }

    return resultado;
  } catch (error) {
    console.error("Pipeline error:", error);
    await updateStatus(analisisId, "failed");
    return null;
  }
}

// Versión para ejecución directa por CLI (testing)
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
      !url.includes("pdf")
    ) {
      const data = await scrapeSitio(url, browser);
      localData.menu = data.preciosExtraidos;
    }

    datosGlobales.push(localData);
  }

  await browser.close();

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
        `\n⚠️ No se encontró "${tiendaBase}" entre los resultados.`,
      );
    }
  }

  const datosParaLLM = {
    busqueda: { tema: topic, ubicacion: location },
    tienda_base: tiendaBaseData,
    negocios: datosGlobales.map((local) => ({
      localName: local.localName,
      PlacesData: local.PlacesData,
      productosConPrecios: local.menu,
    })),
  };

  const resultado = await generarJsonEstructurado(datosParaLLM);

  console.log("\n========================================");
  console.log("RESULTADO JSON ESTRUCTURADO:");
  console.log("========================================");
  console.log(JSON.stringify(resultado, null, 2));

  saveInDb(resultado);

  return resultado;
};

if (process.argv[1]?.includes("pipeline")) {
  pipeline();
}
