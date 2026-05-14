import OpenAI from 'openai';

interface DeepSeekProduct {
  producto_original: string;
  categoria: string;
  precio_lista: number;
  precio_unitario: number;
  unidad: string;
}

interface DeepSeekEmpresa {
  nombre: string;
  productos: DeepSeekProduct[];
}

interface DeepSeekResponse {
  empresas: DeepSeekEmpresa[];
  categorias_principales: string[];
}

const SYSTEM_PROMPT = `Eres un analista de datos de mercado. Recibirás una lista de empresas con sus productos y precios.

Tu tarea:
1. Para cada producto, asígnalo a una categoría general del menú (3-5 categorías que representen los tipos principales de productos que vende ese negocio).
2. Para cada producto, determina DOS precios:
   - precio_lista: el precio tal como aparece en el menú, SIN dividir. Si dice "20 PIEZAS TWINS $8700", precio_lista = 8700. Si dice "Ceviche $13900", precio_lista = 13900.
   - precio_unitario: el precio por unidad individual. Si dice "20 PIEZAS TWINS $8700", precio_unitario = 435 (8700/20). Si dice "Ceviche $13900", precio_unitario = 13900 (ya es por plato).
3. unidad: el tipo de unidad del precio_unitario. Para combos o piezas: "pieza". Para platos individuales: "plato". Para kilos: "kg". Para litros: "lt".
4. Excluye bebidas, aguas y acompañamientos simples (no son productos principales).
5. Las categorías deben ser consistentes entre todas las empresas (misma palabra para la misma categoría, ej: "sushi" no "sushis" en una y "sushi" en otra).
6. Usa categorías EN MINÚSCULAS.

Responde SOLO con JSON válido, sin texto adicional, usando esta estructura exacta:
{
  "empresas": [
    {
      "nombre": "nombre de la empresa",
      "productos": [
        {
          "producto_original": "20 PIEZAS TWINS",
          "categoria": "sushi",
          "precio_lista": 8700,
          "precio_unitario": 435,
          "unidad": "pieza"
        },
        {
          "producto_original": "Ceviche de Pescado",
          "categoria": "entrada",
          "precio_lista": 13900,
          "precio_unitario": 13900,
          "unidad": "plato"
        }
      ]
    }
  ],
  "categorias_principales": ["cat1", "cat2"]
}`;

const buildUserMessage = (payload: any): string => {
  const empresas = (payload?.empresas || []).filter((e: any) => e.precios && e.precios.length > 0);
  const simplified = empresas.map((e: any) => ({
    nombre: e.nombre,
    productos: e.precios.map((p: any) => ({
      nombre: p.producto,
      precio: p.precio,
    })),
  }));

  return `Analiza los siguientes productos y precios de ${simplified.length} empresas:\n\n${JSON.stringify(simplified, null, 2)}`;
};

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function processWithDeepSeek(payloads: any[]): Promise<DeepSeekResponse[]> {
  const results: DeepSeekResponse[] = [];

  for (const payload of payloads) {
    const userMessage = buildUserMessage(payload);

    const response = await deepseek.chat.completions.create({
      model: 'deepseek-v4-flash',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('DeepSeek response vacío');
    }

    try {
      const parsed = JSON.parse(content) as DeepSeekResponse;
      results.push(parsed);
    } catch {
      throw new Error(`DeepSeek response no es JSON válido: ${content.substring(0, 200)}`);
    }
  }

  return results;
}

export type { DeepSeekResponse, DeepSeekEmpresa, DeepSeekProduct };