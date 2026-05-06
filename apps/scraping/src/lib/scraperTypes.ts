export interface LLMAnalysis {
  menuSelector: string | null;
  menuUrl: string | null;
  preciosReferencia: any[];
  razonamiento: string;
}

export interface ProductoPrecio {
  producto: string;
  precio: string;
  imagen_url: string | null;
}

export interface ScrapeResult {
  url: string;
  analisisInicial: LLMAnalysis;
  preciosExtraidos: ProductoPrecio[];
}

// ── Tipos para el output estructurado del pipeline ──

export interface CalificacionesEmpresa {
  rating: number | null;
  total_resenas: number | null;
  rango_precio_gmaps: string;
  ultimas_resenas: string[];
}

export interface EmpresaOutput {
  id: number;
  nombre: string;
  calificaciones: CalificacionesEmpresa;
  precios: ProductoPrecio[] | null;
  sitio_web: string | null;
  google_maps_url: string | null;
  ubicacion: string;
}

// ── Análisis comparativo cuando se proporciona tienda_base ──

export interface AnalisisTiendaBase {
  comparacion_precios: string;
  comparacion_general: string;
  conclusion: string;
}

export interface PipelineOutput {
  empresas: EmpresaOutput[];
  busqueda: {
    tema: string;
    ubicacion: string;
  };
  fecha: string;
  total_empresas: number;
  mas_valorado: string;
  mas_criticado: string;
  analisis_tienda_base: AnalisisTiendaBase | null;
}
