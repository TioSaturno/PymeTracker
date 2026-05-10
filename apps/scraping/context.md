# Contexto del Proyecto: Analizador de Competencia para PYMEs

## 🎯 Objetivo Principal

Desarrollar una plataforma B2B que permita a dueños de PYMEs ingresar su rubro y ubicación (ej. "Cafetería en Santiago") para generar un reporte automático del estado actual de su competencia. El sistema buscará competidores en la web, navegará por sus sitios y generará un análisis comparativo de precios, oferta de valor y comportamiento utilizando IA.

## 🏗️ Arquitectura y Stack Tecnológico

Para asegurar escalabilidad, evitar timeouts en el edge y mantener bajos los costos, el sistema utiliza una arquitectura desacoplada:

1. **Frontend / API Orquestadora:** Para el front pienso en Astro, ya que es mas adecuado que next si queremos mostrar dashboards principalmente, ademas de que es considerablemente mas compatible con cloudflared que Next. Si usamos next tendriamos que hostearlo en vercel
2. **Base de Datos:** D1 + Drizzle ORM son bien compatibles con cloudflared
3. **Servicio de Scraping (Backend Worker):** Hay que revisar donde se puede hostear bien, pero creo que cloudflared tambien tiene un servicio fork de Playwright que nos puede servir.
4. **Motor de Descubrimiento:** API Oficial de Google Places (`@googlemaps/google-maps-services-js`).
5. **Motor de Scraping Web:** Playwright.
6. **LLM principal:** DeepSeek (`deepseek-chat`). Se usa en dos momentos: análisis heurístico por sitio y reporte final comparativo.

## 🔄 Flujo de Datos del Sistema (Pipeline)

El pipeline principal está en `src/pipeline.ts` y orquesta los siguientes pasos:

1. **Input:** Se define `topic` (ej. "Sushi"), `location` (ej. "Rancagua") y `nResults` (cantidad de competidores a analizar).

2. **Fase de Descubrimiento Local — `src/scrapers/scraper-maps.ts` → `getPlacesData`:**
   - Llama a Google Places Text Search para encontrar negocios que coincidan.
   - Por cada negocio, llama a Place Details para obtener: nombre, dirección, rating, total de reseñas, URL de Google Maps, sitio web, nivel de precio (mapeado a `$`–`$$$$`) y las últimas 5 reseñas en texto (el `5` es configurable con `.slice(0, N)`).
   - Retorna el array `pymesData` con estos datos estructurados.

3. **Fase de Rastreo Web — `src/scrapers/scraper.ts` → `scrapeSitio`:**
   - Se ejecuta solo si el negocio tiene sitio web válido (con `http`) y **no es Instagram** (no tiene scraper propio aún).
   - **Sub-fase 1 — Análisis Heurístico (DeepSeek + `SYSTEM_PROMPT`):** Extrae el HTML limpio de la home (sin scripts/estilos/atributos de ruido, truncado a `maxHtmlLength = 12.000 chars`) y lo envía a DeepSeek para identificar el selector CSS o URL del menú/precios.
   - **Sub-fase 2 — Extracción de Productos (DeepSeek + `MENU_EXTRACTION_PROMPT`):** Navega a la página del menú detectada. Extrae texto visible (truncado a `maxTextLength = 5.000 chars`) y lo envía a DeepSeek para obtener un array de `{ producto, precio }`.

4. **Fase de Síntesis de Precios — `calcularRangoPrecios` (en `pipeline.ts`):**
   - Calcula el rango min-max de los precios extraídos (ej. `$2.500 - $12.000`).
   - Reemplaza la carta completa en el payload al LLM final para no saturar tokens.

5. **Fase de Análisis Final Comparativo — DeepSeek + `FINAL_ANALYSIS_PROMPT`:**
   - Construye un objeto resumido por local: nombre, datos de Places (reseñas, rating, rango de precio de Google, etc.) y rango de precios detectado en web.
   - Envía todo el array a DeepSeek en una sola llamada para generar el reporte comparativo final en Markdown.

6. **Output:** El reporte final se imprime en consola. _(Pendiente: guardarlo en D1 vía Drizzle)._

## 🗂️ Estructura de Archivos Clave

| Archivo                        | Rol                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `src/pipeline.ts`              | Orquestador principal. Une Google Places + Scraper web + DeepSeek.                                                             |
| `src/scrapers/scraper-maps.ts` | Descubrimiento de competidores vía Google Places API.                                                                          |
| `src/scrapers/scraper.ts`      | Scraping web con Playwright + análisis LLM por sitio. `run()` es solo utilidad de prueba standalone, no se usa en el pipeline. |
| `src/lib/prompt.ts`            | Prompts del sistema: `SYSTEM_PROMPT`, `MENU_EXTRACTION_PROMPT`, `FINAL_ANALYSIS_PROMPT`.                                       |
| `src/lib/scraperTypes.ts`      | Tipos TypeScript: `LLMAnalysis`, `ProductoPrecio`, `ScrapeResult`.                                                             |

## 🚦 Reglas de Desarrollo

- No enviar HTML crudo al LLM bajo ninguna circunstancia (peligro de exceder la ventana de contexto).
- Manejar los scrapers con `timeouts` y `try/catch` estricto, asumiendo que el 30% de las webs fallarán al cargar.
- Priorizar la extracción de texto semántico sobre la interacción de UI compleja.
- Los sitios de Instagram se saltan en la fase de scraping web por ahora.

## 💡 Por hacer / Ideas

- **Instagram:** Si la URL es de Instagram, llamar a la API de RapidAPI (`userInfo`) para obtener el `external_url` de la bio y scrapear ese sitio.
- **PDF:** Si el menú está en PDF, descargarlo y parsearlo con `pdf-parse` para extraer el texto y analizarlo con el LLM.
- **Persistencia:** Guardar el reporte final en D1 vía Drizzle ORM en vez de solo imprimirlo en consola.
- **price_level:** Evaluar si conviene enviar el `price_level` de Google (0 a 4) en lugar del string `$`–`$$$$` al LLM de análisis final.
- **Tiktok:** Agregar un servicio que permita obtener los primeros n videos de una busqueda de tiktok y analizarlos, cosa de complementar el analisis. Para hacer esto, pienso en usar una API de RapidAPI tambien, donde se pueda descargar el video, extraer el audio y enviarlo al LLM para que lo analice (deepseek me parece que no puede, pero la version gratuita de gemini puede hacerlo).
- **Cache de Tiendas Conocidas (Optimización del Scraper):** Actualmente el scraper recorre recursivamente cada sitio web, extrayendo HTML y usando IA en cada solicitud para navegar hasta la página de productos/precios. La idea es crear una base de datos de archivos (JSON) donde se almacenen tiendas ya visitadas con la siguiente estructura:
  ```json
  {
    "nombre": "Nombre de la tienda",
    "catalogo_url": "https://ejemplo.com/menu",
    "isStatic": true,
    "selectores": [".producto", ".precio"]
  }
  ```
  **Flujo propuesto:**
  1. Una vez obtenido el nombre de la tienda desde Google Places, se busca si existe en la base de datos de archivos.
  2. **Si existe:** Se navega directamente a `catalogo_url` (sin recorrer recursivamente el sitio). Si `isStatic` es `true`, se usa un simple `curl`/`fetch` para obtener el HTML (sin levantar el browser). Si es `false`, se inicia Playwright para renderizar el HTML.
  3. Con los `selectores` CSS conocidos, se extraen las ofertas directamente del HTML con código, sin necesidad de enviar nada al LLM.
  4. **Si no existe:** Se ejecuta el flujo actual (navegación recursiva + IA). Al finalizar exitosamente, se guardan `catalogo_url`, `isStatic` y `selectores` en la base de datos para futuras ejecuciones.
  5. **Verificación de vigencia:** Si al usar los selectores guardados no se obtienen ofertas, se asume que el sitio cambió de estructura. Se re-ejecuta el flujo completo y se actualizan los datos en la base de datos.
