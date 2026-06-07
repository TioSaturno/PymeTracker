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
  headless: true,
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

/**
 * Extrae solo el texto visible de la página + las URLs de imágenes relevantes.
 * Mucho más eficiente que mandar HTML completo: menos tokens, mejor razonamiento del LLM.
 */
async function extraerTextoMenu(page: Page): Promise<string> {
  return page.evaluate((maxLen: number) => {
    // 1. Texto visible (innerText respeta display:none y visibilidad)
    const textoVisible = document.body.innerText
      .replace(/[\t ]+/g, " ")   // colapsar espacios/tabs
      .replace(/\n{3,}/g, "\n\n") // máx 2 saltos de línea consecutivos
      .trim()
      .substring(0, maxLen);

    // 2. Recolectar URLs de imágenes que probablemente sean fotos de productos
    //    (evitar iconos, logos y tracking pixels por tamaño mínimo)
    const imagenes: string[] = [];
    document.querySelectorAll("img[src], img[data-src]").forEach((img) => {
      const el = img as HTMLImageElement;
      const src = el.getAttribute("data-src") || el.getAttribute("src") || "";
      const ancho = el.naturalWidth || el.width || 0;
      const alto = el.naturalHeight || el.height || 0;
      // Filtrar imágenes demasiado pequeñas (iconos/trackers) y SVGs inline
      if (src && !src.startsWith("data:") && (ancho === 0 || ancho >= 60) && (alto === 0 || alto >= 60)) {
        imagenes.push(src);
      }
    });

    const bloqueImagenes = imagenes.length > 0
      ? `\n\n<imagenes_detectadas>\n${imagenes.slice(0, 40).join("\n")}\n</imagenes_detectadas>`
      : "";

    return `<texto_pagina>\n${textoVisible}\n</texto_pagina>${bloqueImagenes}`;
  }, CONFIG.maxHtmlLength);
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
    console.log(`\n[DeepSeek] Enviando texto al LLM (${textoMenu.length} chars)...`);
    console.log(`[DeepSeek] Preview: ${textoMenu.slice(0, 200).replace(/\n/g, " ")}`);

    const response = await deepseek.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: MENU_EXTRACTION_PROMPT },
        { role: "user", content: textoMenu },
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content ?? "[]";
    console.log("[DeepSeek] Respuesta cruda:", content.slice(0, 300));

    const cleaned = content.replace(/```json|```/g, "").trim();
    const parsed: ProductoPrecio[] = JSON.parse(cleaned);
    console.log(`[DeepSeek] Productos extraídos: ${parsed.length}`);
    return parsed;
  } catch (error) {
    console.error("[DeepSeek] Error extrayendo productos:", error);
    return [];
  }
}

/**
 * Navega de forma segura a una URL con fallback de estrategias waitUntil.
 * Primero intenta "networkidle" (más estable para SPAs), si falla usa "domcontentloaded" + espera manual.
 * Retorna true si la navegación fue exitosa, false si falló.
 */
async function navegarSeguro(
  page: Page,
  url: string,
  label: string,
): Promise<boolean> {
  console.log(`\n[NAV] Intentando navegar a ${label}: ${url}`);

  // Intento 1: networkidle
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: CONFIG.timeout });
    await page.waitForTimeout(1_500);
    const urlFinal = page.url();
    console.log(`[NAV ✓] networkidle OK | pedida: ${url} | final: ${urlFinal}`);
    if (urlFinal !== url) {
      console.log(`[NAV] ↪ Redirect detectado → ${urlFinal}`);
    }
    return true;
  } catch (e1) {
    console.warn(
      `[NAV] networkidle falló (${(e1 as Error).message?.slice(0, 80)}). Reintentando con domcontentloaded...`,
    );
  }

  // Intento 2: domcontentloaded + espera manual
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: CONFIG.timeout,
    });
    await page.waitForTimeout(3_000); // darle tiempo al JS de la página
    const urlFinal = page.url();
    console.log(`[NAV ✓] domcontentloaded OK | pedida: ${url} | final: ${urlFinal}`);
    if (urlFinal !== url) {
      console.log(`[NAV] ↪ Redirect detectado → ${urlFinal}`);
    }
    return true;
  } catch (e2) {
    console.error(
      `[NAV ✗] Falló completamente la navegación a ${label}: ${url}`,
      (e2 as Error).message?.slice(0, 120),
    );
    return false;
  }
}

/**
 * Función principal de extracción. Dado el análisis inicial del LLM:
 *  - Si ya hay productos en la home → los devuelve directamente.
 *  - Si hay menuUrl → navega a ella y extrae los productos.
 *  - Si hay menuSelector → hace click y extrae los productos de la nueva página.
 *  - En cada caso extrae el HTML del estado actual de la página y lo manda al LLM.
 */
async function extraerProductos(
  page: Page,
  analisis: LLMAnalysis,
  baseUrl: string,
): Promise<ProductoPrecio[]> {
  // Caso 1: la home ya tiene productos → extraer directo sin navegar
  if (analisis.preciosReferencia && analisis.preciosReferencia.length > 0) {
    console.log(
      "[*] Productos encontrados en la home. Extrayendo sin navegar.",
    );
    return analisis.preciosReferencia.map((p: any) => ({
      producto: p.producto || "Producto desconocido",
      precio: p.precio || "$0",
      imagen_url: p.imagen_url || null,
    }));
  }

  // Caso 2: el LLM encontró una URL directa al menú
  if (analisis.menuUrl) {
    let destino: string;
    try {
      destino = new URL(analisis.menuUrl, baseUrl).href;
    } catch {
      destino = analisis.menuUrl;
    }

    if (destino === baseUrl || destino === page.url()) {
      // La "URL del menú" es la misma página → extraer directo
      console.log(
        "[*] menuUrl apunta a la misma página. Extrayendo sin navegar.",
      );
    } else {
      const ok = await navegarSeguro(page, destino, "menuUrl");
      if (!ok) {
        console.error("[X] No se pudo navegar al menú. Retornando vacío.");
        return [];
      }
    }

    const textoMenu = await extraerTextoMenu(page);
    return extraerProductosConDeepSeek(textoMenu);
  }

  // Caso 3: el LLM encontró un selector (botón/link) → hacer click
  if (analisis.menuSelector) {
    console.log(`[*] Intentando click en selector: ${analisis.menuSelector}`);
    try {
      await page.click(analisis.menuSelector, { timeout: 5_000 });
      // Esperar a que la navegación/animación se complete
      await page.waitForLoadState("domcontentloaded", {
        timeout: CONFIG.timeout,
      });
      await page.waitForTimeout(2_000);
      console.log(`[NAV ✓] Click ejecutado. Página actual: ${page.url()}`);
    } catch (eClick) {
      console.warn(
        `[X] Click en selector falló: ${analisis.menuSelector}`,
        (eClick as Error).message?.slice(0, 80),
      );
      return [];
    }

    const textoMenu = await extraerTextoMenu(page);
    return extraerProductosConDeepSeek(textoMenu);
  }

  // Caso 4: el LLM no encontró nada útil
  console.warn(
    "[!] El análisis no retornó productos, menuUrl ni menuSelector. Sin datos.",
  );
  return [];
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

    // 3. Extraer productos (la función maneja todos los casos internamente)
    const preciosExtraidos = await extraerProductos(page, analisis, url);

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
