# 🕵️ Competitive Intelligence Scraper

Sistema automatizado de inteligencia competitiva para negocios locales. Extrae precios de la competencia, los estructura y los entrega en reportes semanales por correo.

---

## ¿Qué hace?

Cada semana, el pipeline:

1. Consulta la **API de Google Maps** para obtener los competidores relevantes de un negocio (con sus URLs y reseñas)
2. Navega dinámicamente cada sitio web con **Playwright** y un LLM para encontrar los precios
3. Estructura los productos y precios encontrados
4. Envía un **reporte actualizado por correo** al usuario suscrito

La gracia del sistema es que no depende de selectores hardcodeados: usa el LLM para razonar sobre cada sitio independientemente de cómo esté construido.

---

## Arquitectura

```
Google Maps API
      │
      ▼
  URLs + Reseñas de competidores
      │
      ▼
┌─────────────────────────────────────┐
│            Scraper Pipeline         │
│                                     │
│  1. Cargar home del sitio           │
│  2. Extraer nav_elements +          │
│     visible_text                    │
│  3. DeepSeek analiza:               │
│     ┌─ ¿Hay precios aquí? ──────── Extraer directo │
│     └─ ¿Hay que navegar? ───────── Ir a la URL/selector │
│  4. Extraer HTML del menú           │
│  5. DeepSeek estructura productos   │
└─────────────────────────────────────┘
      │
      ▼
  ScrapeResult[]
      │
      ▼
  Reporte semanal por correo
```

---

## Stack

| Capa | Tecnología |
|---|---|
| Navegación web | Playwright |
| LLM de análisis | DeepSeek (deepseek-chat) |
| Fuente de competidores | Google Maps Places API |
| Lenguaje | TypeScript |
| Entrega de reportes | Email (suscripción) |

---

## Flujo del Scraper

### Fase 1 — Orientación

El scraper carga la home del sitio y extrae dos contextos diferenciados:

- **`<nav_elements>`**: todos los `<a>`, `<button>` y elementos interactivos, para entender cómo navegar el sitio
- **`<visible_text>`**: el texto visible de la página, para detectar si los precios ya están presentes

Ambos se envían a DeepSeek, que responde con:

```json
{
  "menuSelector": "a[href*='menu']",
  "menuUrl": "https://sitio.cl/carta",
  "preciosReferencia": [],
  "razonamiento": "Encontré un link a /carta en el nav principal"
}
```

> Si ya hay precios en la home, `menuSelector` y `menuUrl` vienen `null` y los precios se extraen directo.

### Fase 2 — Extracción

Si el LLM indicó que hay que navegar, el scraper se mueve a la página del menú (por URL directa o haciendo click en el selector) y extrae el HTML simplificado.

Ese HTML se envía a DeepSeek nuevamente, que devuelve un array estructurado:

```json
[
  { "nombre": "Café Americano", "precio": 2500, "categoria": "Bebidas" },
  { "nombre": "Tostado Jamón", "precio": 4900, "categoria": "Sándwiches" }
]
```

---

## Estructura del proyecto

```
├── lib/
│   ├── scraperTypes.ts       # Tipos: ScrapeResult, ProductoPrecio, LLMAnalysis
│   └── prompt.ts             # SYSTEM_PROMPT y MENU_EXTRACTION_PROMPT
├── scrapers/
│   └── scraper.ts            # Lógica principal del scraper
├── pipeline/
│   └── ...                   # Orquestación semanal + envío de reportes
└── README.md
```

---

## Variables de entorno

```env
DEEPSEEK_API_KEY=      # API key de DeepSeek
GOOGLE_MAPS_API_KEY=   # API key de Google Maps Places
```

---

## Configuración

En `scraper.ts` puedes ajustar:

```typescript
export const CONFIG = {
  headless: false,       // true para producción
  timeout: 15_000,       // ms de espera por página
  maxHtmlLength: 12_000, // límite de tokens del HTML enviado al LLM
  maxTextLength: 5_000,  // límite del texto visible
};
```

---

## Reporte semanal

El pipeline se ejecuta una vez por semana y envía por correo un reporte con:

- Precios actualizados de cada competidor
- Comparativa respecto a la semana anterior
- Reseñas y valoraciones obtenidas desde Google Maps

Esto permite al negocio suscrito **adaptar su oferta y precios al mercado en tiempo real**.

---

## Limitaciones conocidas

- Sitios que cargan precios vía JavaScript asíncrono tardío pueden requerir mayor `timeout`
- Sitios con autenticación o captchas no son compatibles
- El límite de `maxHtmlLength` puede truncar páginas de menú muy extensas