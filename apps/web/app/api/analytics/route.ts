import { NextResponse } from 'next/server';
import { db } from '@pymetracker/db/create-client';
import { analisis } from '@pymetracker/db/schema';
import { eq } from 'drizzle-orm';
import { processWithDeepSeek, type DeepSeekResponse } from '../../../services/deepseek';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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

    const unprocessed = records.filter((r: any) => !r.procesado);

    if (unprocessed.length > 0) {
      try {
        const batch = unprocessed.slice(0, 10);
        const payloads = batch.map((r: any) => r.payloadData as any).filter(p => p && p.empresas);

        if (payloads.length > 0) {
          const llmResults = await processWithDeepSeek(payloads);

          for (let i = 0; i < batch.length; i++) {
            const record = batch[i];
            const llmResult = llmResults[i] || null;

            await db.update(analisis)
              .set({
                payloadProcesado: llmResult,
                procesado: true,
              })
              .where(eq(analisis.id, record.id));
          }
        }
      } catch (llmError) {
        console.error('DeepSeek processing failed:', llmError);
        return NextResponse.json(
          { error: 'Procesamiento con IA en progreso. Intenta nuevamente en unos segundos.' },
          { status: 503 }
        );
      }
    }

    const allRecords = await db.select()
      .from(analisis)
      .where(eq(analisis.tiendaId, tiendaId));

    const processedRecords = allRecords.filter((r: any) => r.procesado && r.payloadProcesado);

    if (processedRecords.length === 0) {
      return NextResponse.json(
        { error: 'No hay datos procesados disponibles.' },
        { status: 404 }
      );
    }

    const processedPayloads = processedRecords.map((r: any) => r.payloadProcesado as DeepSeekResponse);
    const result = computeFromProcessed(processedPayloads, allRecords);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function computeFromProcessed(processed: DeepSeekResponse[], records: any[]) {
  const empresaMap = new Map<string, Map<string, { preciosLista: number[]; preciosUnitarios: number[]; unidad: string }>>();

  for (const p of processed) {
    for (const empresa of p.empresas) {
      if (!empresaMap.has(empresa.nombre)) {
        empresaMap.set(empresa.nombre, new Map());
      }
      const catMap = empresaMap.get(empresa.nombre)!;
      for (const prod of empresa.productos) {
        if (!catMap.has(prod.categoria)) {
          catMap.set(prod.categoria, { preciosLista: [], preciosUnitarios: [], unidad: prod.unidad });
        }
        const entry = catMap.get(prod.categoria)!;
        entry.preciosLista.push(prod.precio_lista);
        entry.preciosUnitarios.push(prod.precio_unitario);
      }
    }
  }

  const categorias = [...new Set(processed.flatMap(p => p.categorias_principales))];
  const categoriaUnidades = new Map<string, string>();
  for (const p of processed) {
    for (const empresa of p.empresas) {
      for (const prod of empresa.productos) {
        if (!categoriaUnidades.has(prod.categoria)) {
          categoriaUnidades.set(prod.categoria, prod.unidad);
        }
      }
    }
  }

  const preciosPromedios = [...empresaMap.entries()].map(([nombre, catMap]) => {
    const allPricesLista = [...catMap.values()].flatMap(c => c.preciosLista);
    const avg = allPricesLista.length > 0 ? allPricesLista.reduce((a, b) => a + b, 0) / allPricesLista.length : 0;
    return {
      nombre,
      precioPromedio: Math.round(avg),
      totalProductos: allPricesLista.length,
    };
  }).filter(e => e.totalProductos > 0);

  const cat1 = categorias.length > 0 ? categorias[0] : null;
  const cat2 = categorias.length > 1 ? categorias[1] : null;

  let comparativaProductos: any[];
  let labels: { categoria1: string; categoria2: string };

  const fmtLabel = (cat: string) => {
    const u = categoriaUnidades.get(cat);
    return u ? `${capitalize(cat)} (${u})` : capitalize(cat);
  };

  if (cat1 && cat2) {
    comparativaProductos = [...empresaMap.entries()].map(([nombre, catMap]) => {
      const prices1 = catMap.get(cat1)?.preciosUnitarios || [];
      const prices2 = catMap.get(cat2)?.preciosUnitarios || [];
      if (prices1.length === 0 && prices2.length === 0) return null;
      const avg1 = prices1.length > 0 ? Math.round(prices1.reduce((a, b) => a + b, 0) / prices1.length) : 0;
      const avg2 = prices2.length > 0 ? Math.round(prices2.reduce((a, b) => a + b, 0) / prices2.length) : 0;
      return { nombre, categoria1: avg1, categoria2: avg2 };
    }).filter(Boolean);

    labels = { categoria1: fmtLabel(cat1), categoria2: fmtLabel(cat2) };
  } else {
    comparativaProductos = [...empresaMap.entries()].map(([nombre, catMap]) => {
      const allPricesUnit = [...catMap.values()].flatMap(c => c.preciosUnitarios);
      if (allPricesUnit.length === 0) return null;
      return { nombre, categoria1: Math.max(...allPricesUnit), categoria2: Math.min(...allPricesUnit) };
    }).filter(Boolean);
    labels = { categoria1: 'Más caro', categoria2: 'Más barato' };
  }

  const categoryTotals = new Map<string, number>();
  for (const p of processed) {
    for (const empresa of p.empresas) {
      for (const prod of empresa.productos) {
        categoryTotals.set(prod.categoria, (categoryTotals.get(prod.categoria) || 0) + 1);
      }
    }
  }
  const totalProducts = [...categoryTotals.values()].reduce((a, b) => a + b, 0);
  const composicionOferta = [...categoryTotals.entries()]
    .map(([categoria, cantidad]) => ({
      categoria: capitalize(categoria),
      cantidad,
      porcentaje: totalProducts > 0 ? Math.round((cantidad / totalProducts) * 100) : 0,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);

  let evolucionPrecios: any = null;

  if (cat1 && cat2) {
    const sortedRecords = [...records]
      .filter((r: any) => r.fechaEjecucion)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.fechaEjecucion).getTime();
        const dateB = new Date(b.fechaEjecucion).getTime();
        return dateA - dateB;
      });

    const serie1: { fecha: string; precioPromedio: number }[] = [];
    const serie2: { fecha: string; precioPromedio: number }[] = [];

    for (const record of sortedRecords) {
      const proc = record.payloadProcesado as DeepSeekResponse | null;
      if (!proc) continue;

      const fecha = record.fechaEjecucion
        ? new Date(record.fechaEjecucion).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' })
        : 'Sin fecha';

      const prices1: number[] = [];
      const prices2: number[] = [];

      for (const empresa of proc.empresas) {
        for (const prod of empresa.productos) {
          if (prod.categoria === cat1) prices1.push(prod.precio_unitario);
          if (prod.categoria === cat2) prices2.push(prod.precio_unitario);
        }
      }

      if (prices1.length > 0) {
        serie1.push({ fecha, precioPromedio: Math.round(prices1.reduce((a, b) => a + b, 0) / prices1.length) });
      }
      if (prices2.length > 0) {
        serie2.push({ fecha, precioPromedio: Math.round(prices2.reduce((a, b) => a + b, 0) / prices2.length) });
      }
    }

    evolucionPrecios = {
      categoria1: { label: fmtLabel(cat1), data: serie1 },
      categoria2: { label: fmtLabel(cat2), data: serie2 },
    };
  }

  return { preciosPromedios, comparativaProductos, labels, composicionOferta, evolucionPrecios };
}