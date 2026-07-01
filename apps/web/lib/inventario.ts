export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  fechaCreacion: string;
}

export type NuevoProducto = Omit<Producto, "id" | "fechaCreacion">;

export interface ImportarResultado {
  importados: number;
  omitidos: number;
  errores?: string[];
}

export interface ProductosAPI {
  getProductos(): Promise<Producto[]>;
  crearProducto(data: NuevoProducto): Promise<Producto>;
  actualizarProducto(id: number, data: NuevoProducto): Promise<Producto>;
  eliminarProducto(id: number): Promise<void>;
  importarCSV(productos: NuevoProducto[]): Promise<ImportarResultado>;
}

interface ProductoDB {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  fechaAgregado: string | null;
}

function aProducto(db: ProductoDB): Producto {
  return {
    id: db.id,
    nombre: db.nombre,
    precio: db.precio,
    categoria: db.categoria,
    fechaCreacion: db.fechaAgregado
      ? new Date(db.fechaAgregado).toISOString().split("T")[0]
      : "",
  };
}

export function crearAPI(): ProductosAPI {
  return {
    async getProductos() {
      const res = await fetch("/api/inventario");
      if (!res.ok) throw new Error("Error al cargar productos");
      const json = await res.json();
      return (json.data as ProductoDB[]).map(aProducto);
    },
    async crearProducto(data) {
      const res = await fetch("/api/inventario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al crear producto");
      const json = await res.json();
      return aProducto(json.data);
    },
    async actualizarProducto(id, data) {
      const res = await fetch(`/api/inventario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error al actualizar producto");
      const json = await res.json();
      return aProducto(json.data);
    },
    async eliminarProducto(id) {
      const res = await fetch(`/api/inventario/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar producto");
    },
    async importarCSV(productos) {
      const res = await fetch("/api/inventario/importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al importar productos");
      }
      const json = await res.json();
      return json.data as ImportarResultado;
    },
  };
}

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CL")}`;
}
