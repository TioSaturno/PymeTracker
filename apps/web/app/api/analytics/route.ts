import { NextResponse } from 'next/server';
import { db } from '@pymetracker/db/create-client';
import { analisis } from '@pymetracker/db/schema';
import { eq } from 'drizzle-orm';

const isMainProduct = (name: string) => {
  if (!name) return false;
  const lowerName = name.toLowerCase();
  const excludeWords = [
    'agua', 'bebida', 'coca cola', 'sprite', 'fanta', 'jugo',
    'limonada', 'café', 'cafe', 'té', 'te ', 'cerveza', 'lata',
    'botella', 'pisco', 'red bull', 'monster', 'nectar', 'shop', 'schop'
  ];
  return !excludeWords.some(word => lowerName.includes(word));
};

const STOP_WORDS = new Set([
  'de', 'con', 'sin', 'en', 'el', 'la', 'los', 'las', 'un', 'una',
  'y', 'o', 'a', 'e', 'u', 'por', 'para', 'del', 'al', 'se', 'que',
  'más', 'mas', 'no', 'ni', 'extra', 'especial', 'doble', 'simple',
  'grande', 'mediano', 'pequeño', 'personal', 'familiar', 'chico',
  'pollo', 'res', 'camarón', 'camarones', 'salmón', 'atún', 'kanikama',
  'salmon', 'atun', 'paquete', 'combo', 'promo', 'promoción', 'promocion',
  'casa', 'surtido', 'variado', 'mixto', 'mixta', 'completo', 'completa',
]);

const extractMeaningfulTokens = (productName: string): string[] => {
  const words = productName.toLowerCase()
    .replace(/[^a-záéíóúñü]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  return words;
};

const findTopKeywords = (empresas: any[]): [string, string] | null => {
  const kwToCompanies = new Map<string, Set<number>>();

  empresas.forEach((empresa: any, idx: number) => {
    const precios = (empresa.precios || []).filter((p: any) => isMainProduct(p.producto));
    const companyKws = new Set<string>();

    for (const p of precios) {
      for (const t of extractMeaningfulTokens(p.producto)) {
        companyKws.add(t);
      }
    }

    for (const kw of companyKws) {
      if (!kwToCompanies.has(kw)) kwToCompanies.set(kw, new Set());
      kwToCompanies.get(kw)!.add(idx);
    }
  });

  const candidates = [...kwToCompanies.entries()].filter(([, s]) => s.size >= 2);

  if (candidates.length < 2) return null;

  let bestPair: [string, string] | null = null;
  let bestOverlap = 0;
  let bestTotal = 0;

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const [kw1, set1] = candidates[i];
      const [kw2, set2] = candidates[j];

      let overlap = 0;
      for (const idx of set1) {
        if (set2.has(idx)) overlap++;
      }

      const total = set1.size + set2.size;

      if (overlap > bestOverlap || (overlap === bestOverlap && total > bestTotal)) {
        bestOverlap = overlap;
        bestTotal = total;
        bestPair = [kw1, kw2];
      }
    }
  }

  return bestPair;
};

const mergeEmpresas = (allPayloads: any[]) => {
  const EmpresaMap = new Map<string, any>();

  for (const payload of allPayloads) {
    const empresas = payload?.empresas || [];
    for (const empresa of empresas) {
      const nombre = empresa.nombre;
      if (!EmpresaMap.has(nombre)) {
        EmpresaMap.set(nombre, {
          nombre,
          calificaciones: empresa.calificaciones || {},
          precios: [...(empresa.precios || [])],
        });
      } else {
        const existing = EmpresaMap.get(nombre);
        const mergedPrecios = [...existing.precios, ...(empresa.precios || [])];
        const seen = new Set<string>();
        const deduped = mergedPrecios.filter((p: any) => {
          const key = `${p.producto}|${p.precio}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        existing.precios = deduped;
        if (empresa.calificaciones) {
          existing.calificaciones = empresa.calificaciones;
        }
      }
    }
  }

  return Array.from(EmpresaMap.values());
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tiendaIdParam = searchParams.get('tiendaId');
    const tiendaId = tiendaIdParam ? parseInt(tiendaIdParam, 10) : 1;

    const records = await db.select()
      .from(analisis)
      .where(eq(analisis.tiendaId, tiendaId));

    if (records.length === 0) {
      return NextResponse.json({ error: 'No analysis data found' }, { status: 404 });
    }

    const validPayloads = records
      .map(r => r.payloadData as any)
      .filter(p => p && p.empresas);

    if (validPayloads.length === 0) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }

    const empresas = mergeEmpresas(validPayloads);

    const preciosPromedios = empresas.map((empresa: any) => {
      const precios = empresa.precios || [];
      const mainProducts = precios.filter((p: any) => isMainProduct(p.producto));

      const total = mainProducts.reduce((acc: number, p: any) => acc + (Number(p.precio) || 0), 0);
      const promedio = mainProducts.length > 0 ? total / mainProducts.length : 0;

      return {
        nombre: empresa.nombre,
        precioPromedio: Math.round(promedio),
        totalProductos: mainProducts.length
      };
    }).filter((e: any) => e.totalProductos > 0);

    const topKeywords = findTopKeywords(empresas);

    let comparativaProductos: any[];
    let labels: { categoria1: string; categoria2: string };

    if (topKeywords) {
      const [kw1, kw2] = topKeywords;

      comparativaProductos = empresas.map((empresa: any) => {
        const precios = (empresa.precios || []).filter((p: any) => isMainProduct(p.producto));

        const matchesKw1 = precios.filter((p: any) =>
          p.producto.toLowerCase().includes(kw1)
        );
        const matchesKw2 = precios.filter((p: any) =>
          p.producto.toLowerCase().includes(kw2)
        );

        if (matchesKw1.length === 0 && matchesKw2.length === 0) return null;

        const avgKw1 = matchesKw1.length > 0
          ? Math.round(matchesKw1.reduce((s: number, p: any) => s + (Number(p.precio) || 0), 0) / matchesKw1.length)
          : 0;
        const avgKw2 = matchesKw2.length > 0
          ? Math.round(matchesKw2.reduce((s: number, p: any) => s + (Number(p.precio) || 0), 0) / matchesKw2.length)
          : 0;

        return {
          nombre: empresa.nombre,
          categoria1: avgKw1,
          categoria2: avgKw2,
        };
      }).filter(Boolean);

      const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      labels = { categoria1: capitalize(kw1), categoria2: capitalize(kw2) };
    } else {
      comparativaProductos = empresas.map((empresa: any) => {
        const precios = (empresa.precios || []).filter((p: any) => isMainProduct(p.producto));
        const prices = precios.map((p: any) => Number(p.precio) || 0).filter((p: number) => p > 0);

        if (prices.length === 0) return null;

        return {
          nombre: empresa.nombre,
          categoria1: Math.max(...prices),
          categoria2: Math.min(...prices),
        };
      }).filter(Boolean);

      labels = { categoria1: 'Más caro', categoria2: 'Más barato' };
    }

    const allMainProducts = empresas.flatMap((empresa: any) =>
      (empresa.precios || []).filter((p: any) => isMainProduct(p.producto))
    );

    const productKwFreq = new Map<string, number>();
    for (const p of allMainProducts) {
      for (const t of extractMeaningfulTokens(p.producto)) {
        productKwFreq.set(t, (productKwFreq.get(t) || 0) + 1);
      }
    }

    const topKws = [...productKwFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([kw]) => kw);

    const classifyProduct = (name: string): string => {
      const lower = name.toLowerCase();
      const tokens = extractMeaningfulTokens(name);
      for (const topKw of topKws) {
        if (lower.includes(topKw) || tokens.includes(topKw)) {
          return topKw.charAt(0).toUpperCase() + topKw.slice(1);
        }
      }
      return 'Otros';
    };

    const categoryTotals = new Map<string, number>();
    for (const p of allMainProducts) {
      const cat = classifyProduct(p.producto);
      categoryTotals.set(cat, (categoryTotals.get(cat) || 0) + 1);
    }

    const totalProducts = allMainProducts.length;
    const composicionOferta = [...categoryTotals.entries()]
      .map(([categoria, cantidad]) => ({
        categoria,
        cantidad,
        porcentaje: totalProducts > 0 ? Math.round((cantidad / totalProducts) * 100) : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad);

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    let evolucionPrecios: any = null;

    if (topKeywords) {
      const [kw1, kw2] = topKeywords;

      const sortedRecords = [...records]
        .filter(r => r.payloadData && (r.payloadData as any).empresas)
        .sort((a, b) => {
          const dateA = a.fechaEjecucion ? new Date(a.fechaEjecucion).getTime() : 0;
          const dateB = b.fechaEjecucion ? new Date(b.fechaEjecucion).getTime() : 0;
          return dateA - dateB;
        });

      const serie1: { fecha: string; precioPromedio: number }[] = [];
      const serie2: { fecha: string; precioPromedio: number }[] = [];

      for (const record of sortedRecords) {
        const payload = record.payloadData as any;
        const empresasList = payload.empresas || [];
        const fecha = record.fechaEjecucion
          ? new Date(record.fechaEjecucion).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' })
          : 'Sin fecha';

        const prices1: number[] = [];
        const prices2: number[] = [];

        for (const empresa of empresasList) {
          const precios = (empresa.precios || []).filter((p: any) => isMainProduct(p.producto));
          const matches1 = precios.filter((p: any) => p.producto.toLowerCase().includes(kw1));
          const matches2 = precios.filter((p: any) => p.producto.toLowerCase().includes(kw2));
          for (const p of matches1) prices1.push(Number(p.precio) || 0);
          for (const p of matches2) prices2.push(Number(p.precio) || 0);
        }

        if (prices1.length > 0) {
          serie1.push({
            fecha,
            precioPromedio: Math.round(prices1.reduce((a, b) => a + b, 0) / prices1.length),
          });
        }
        if (prices2.length > 0) {
          serie2.push({
            fecha,
            precioPromedio: Math.round(prices2.reduce((a, b) => a + b, 0) / prices2.length),
          });
        }
      }

      evolucionPrecios = {
        categoria1: { label: capitalize(kw1), data: serie1 },
        categoria2: { label: capitalize(kw2), data: serie2 },
      };
    }

    return NextResponse.json({
      preciosPromedios,
      comparativaProductos,
      labels,
      composicionOferta,
      evolucionPrecios
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}