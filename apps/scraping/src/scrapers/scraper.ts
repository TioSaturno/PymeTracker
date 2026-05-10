import { chromium, Browser, Page } from "playwright";
import OpenAI from "openai";
import dotenv from "dotenv";
import { LLMAnalysis, ProductoPrecio, ScrapeResult } from "../lib/scraperTypes";
import {
  MENU_EXTRACTION_PROMPT,
  SYSTEM_PROMPT,
  SYSTEM_PROMPT_v2,
} from "../lib/prompt";

dotenv.config();

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const CONFIG = {
  headless: false,
  timeout: 15_000,
  maxHtmlLength: 12_000,
  maxTextLength: 5_000,
};

// funcion para limpiar el html para el LLM
async function extraerHtmlLimpio(page: Page): Promise<string> {
  return page.evaluate(() => {
    // --- Parte 1: elementos de navegación ---
    const elementos = document.querySelectorAll(
      'a[href], button, [role="button"], [onclick]',
    );
    const fragmentos: string[] = [];

    elementos.forEach((el) => {
      if (el.closest('a[href], button, [role="button"], [onclick]') !== el)
        return;

      const clone = el.cloneNode(true) as HTMLElement;
      const atributosBlancos = ["href", "class", "id", "data-href"];
      Array.from(clone.attributes).forEach((attr) => {
        if (!atributosBlancos.includes(attr.name))
          clone.removeAttribute(attr.name);
      });
      clone
        .querySelectorAll("svg, img, script, style")
        .forEach((n) => n.remove());

      const outerHtml = clone.outerHTML.replace(/\s+/g, " ").trim();
      if (outerHtml) fragmentos.push(outerHtml);
    });

    // --- Parte 2: texto visible para detección de precios ---
    const textoVisible = document.body.innerText
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 3000);

    return `<nav_elements>\n${fragmentos.join("\n")}\n</nav_elements>\n\n<visible_text>\n${textoVisible}\n</visible_text>`;
  });
}

// funcion para extraer HTML simplificado del menú
async function extraerHtmlMenu(page: Page): Promise<string> {
  const html = await page.evaluate(() => {
    const body = document.body.cloneNode(true) as HTMLElement;

    // Eliminar elementos que solo aportan ruido
    const ruido = body.querySelectorAll(
      "script, style, noscript, svg, iframe, link, meta",
    );
    ruido.forEach((el) => el.remove());

    // Colapsar atributos no relevantes, pero conservar src y data-src para imágenes
    const todos = body.querySelectorAll("*");
    todos.forEach((el) => {
      const atributosBlancos = [
        "href",
        "src",
        "data-src",
        "alt",
        "class",
        "id",
      ];
      Array.from(el.attributes).forEach((attr) => {
        if (!atributosBlancos.includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return body.innerHTML;
  });

  // Colapsar whitespace y truncar (más largo que el de la home porque necesitamos las imágenes)
  return html.replace(/\s+/g, " ").trim().substring(0, CONFIG.maxHtmlLength);
}

async function analizarConDeepSeek(
  htmlLimpio: string,
  url: string,
): Promise<LLMAnalysis> {
  console.log("\n enviando el html a deepseek...");

  const userMessage = `URL del sitio: ${url}\n\nHTML limpio del body:\n${htmlLimpio}`;

  console.log("\n userMessage", userMessage);

  try {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT_v2 },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1, // Baja temperatura para respuestas más deterministas
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    console.log("\nRespuesta de DeepSeek:\n", content);

    // Parsear el JSON (puede venir con ```json ... ``` a veces)
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed: LLMAnalysis = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error("[DeepSeek] Error en análisis:", error);
    return {
      menuSelector: null,
      menuUrl: null,
      preciosReferencia: [],
      razonamiento: "Error al contactar DeepSeek",
    };
  }
}

async function extraerProductosConDeepSeek(
  textoMenu: string,
): Promise<ProductoPrecio[]> {
  try {
    console.log("\n extrayendo informacion del menu con deepseek...");

    const response = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: MENU_EXTRACTION_PROMPT },
        { role: "user", content: textoMenu },
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content ?? "[]";
    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed: ProductoPrecio[] = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error("[DeepSeek] Error extrayendo productos:", error);
    return [];
  }
}

async function navegarYExtraerProductos(
  page: Page,
  analisis: LLMAnalysis,
  baseUrl: string,
): Promise<ProductoPrecio[]> {
  // Resolver URL relativa contra baseUrl si es necesario
  let destino: string | null = null;
  if (analisis.menuUrl) {
    try {
      destino = new URL(analisis.menuUrl, baseUrl).href;
    } catch {
      destino = analisis.menuUrl; // fallback por si acaso
    }
  }

  // Si hay selector, intentar hacer click en el elemento
  if (!destino && analisis.menuSelector) {
    try {
      await page.click(analisis.menuSelector, { timeout: 5_000 });
      await page.waitForLoadState("domcontentloaded", {
        timeout: CONFIG.timeout,
      });
      destino = page.url();
      console.log(`navegacion hacia: ${destino}`);
    } catch {
      console.warn(`[X] Selector no funcionó: ${analisis.menuSelector}`);
    }
  }

  // Si tenemos URL directa, navegar a ella
  if (destino && destino !== baseUrl && page.url() !== destino) {
    try {
      console.log(`\n navegando directamente a: ${destino}`);
      await page.goto(destino, {
        waitUntil: "networkidle",
        timeout: CONFIG.timeout,
      });
      await page.waitForTimeout(2_000);
    } catch {
      console.warn(`[X] No se pudo navegar a: ${destino}`);
      return [];
    }
  }

  const htmlMenu = await extraerHtmlMenu(page);
  const productos = await extraerProductosConDeepSeek(htmlMenu);

  return productos;
}

// Funcion principal del scraper
export async function scrapeSitio(
  url: string,
  browser: Browser,
): Promise<ScrapeResult> {
  console.log(`\n Iniciando scrapeo de: ${url}`);

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    // 1. Cargar la home
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: CONFIG.timeout,
    });

    await page.waitForTimeout(10000);

    // 2. Extraer HTML limpio y enviarlo a DeepSeek
    const htmlLimpio = await extraerHtmlLimpio(page);
    const analisis = await analizarConDeepSeek(htmlLimpio, url);

    let preciosExtraidos: ProductoPrecio[] = [];

    // 3. Si ya tenemos precios de referencia (productos) en la home, no navegamos al menú
    if (analisis.preciosReferencia && analisis.preciosReferencia.length > 0) {
      console.log(
        "[*] Se encontraron productos/precios en la página principal. Omitiendo navegación al menú.",
      );
      // Mapeamos al formato ProductoPrecio asegurando que existan los campos
      preciosExtraidos = analisis.preciosReferencia.map((p: any) => ({
        producto: p.producto || "Producto desconocido",
        precio: p.precio || "$0",
        imagen_url: p.imagen_url || null,
      }));
    } else {
      // 4. Navegar al menú y extraer productos con precios
      console.log("[*] No se detectaron productos en la home. Navegando al menú...");
      preciosExtraidos = await navegarYExtraerProductos(page, analisis, url);
    }

    return {
      url,
      analisisInicial: analisis,
      preciosExtraidos,
    };
  } catch (error) {
    console.error(`[X] Error cargando ${url}:`, error);
    return {
      url,
      analisisInicial: {
        menuSelector: null,
        menuUrl: null,
        preciosReferencia: [],
        razonamiento: "Error en scraping",
      },
      preciosExtraidos: [] as ProductoPrecio[],
    };
  } finally {
    await context.close();
  }
}

// Funcion para ejecutar una prueba del scraper (ahora no se usa, pq el scraperSitio es el que se ejecuta en el pipeline principal)
export async function run() {
  // link de prueba q saque de una exec de la api de places.
  const urls = ["http://www.wonderlandcafe.cl/"];

  const browser = await chromium.launch({ headless: CONFIG.headless });
  const resultados: ScrapeResult[] = [];

  for (const url of urls) {
    const data = await scrapeSitio(url, browser);
    resultados.push(data);
  }

  await browser.close();

  // Output final
  console.log("\n========================================");
  console.log("RESULTADO FINAL:");
  console.log(JSON.stringify(resultados, null, 2));
  console.log("========================================");
}

//run().catch(console.error);
