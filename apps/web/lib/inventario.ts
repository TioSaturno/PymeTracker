export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  descripcion?: string;
  fechaCreacion: string;
}

export type NuevoProducto = Omit<Producto, "id" | "fechaCreacion">;

export interface ProductosAPI {
  getProductos(): Promise<Producto[]>;
  crearProducto(data: NuevoProducto): Promise<Producto>;
  actualizarProducto(id: number, data: NuevoProducto): Promise<Producto>;
  eliminarProducto(id: number): Promise<void>;
}

const mockProductos: Producto[] = [
  { id: 1, nombre: "Café Americano", precio: 2500, categoria: "Bebidas Calientes", descripcion: "Café americano tradicional 12oz", fechaCreacion: "2026-05-01" },
  { id: 2, nombre: "Café Latte", precio: 3200, categoria: "Bebidas Calientes", descripcion: "Espresso con leche vaporizada", fechaCreacion: "2026-05-01" },
  { id: 3, nombre: "Tostado Jamón Queso", precio: 4900, categoria: "Sándwiches", descripcion: "Pan de miga tostado con jamón y queso", fechaCreacion: "2026-05-02" },
  { id: 4, nombre: "Sándwich Vegetal", precio: 5200, categoria: "Sándwiches", descripcion: "Pan integral con vegetales frescos y queso", fechaCreacion: "2026-05-02" },
  { id: 5, nombre: "Jugo Natural Naranja", precio: 2800, categoria: "Bebidas Frías", descripcion: "Jugo de naranja natural 400ml", fechaCreacion: "2026-05-03" },
  { id: 6, nombre: "Limonada Menta", precio: 3000, categoria: "Bebidas Frías", descripcion: "Limonada natural con menta y hielo", fechaCreacion: "2026-05-03" },
  { id: 7, nombre: "Pastel de Zanahoria", precio: 3500, categoria: "Repostería", descripcion: "Porción de pastel de zanahoria con frosting", fechaCreacion: "2026-05-04" },
  { id: 8, nombre: "Brownie", precio: 2900, categoria: "Repostería", descripcion: "Brownie de chocolate con nueces", fechaCreacion: "2026-05-04" },
];

export function crearAPI(): ProductosAPI {
  let productos = [...mockProductos];
  let nextId = 100;

  const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

  return {
    async getProductos() {
      await delay();
      return [...productos];
    },
    async crearProducto(data) {
      await delay();
      const nuevo: Producto = {
        ...data,
        id: nextId++,
        fechaCreacion: new Date().toISOString().split("T")[0],
      };
      productos.push(nuevo);
      return nuevo;
    },
    async actualizarProducto(id, data) {
      await delay();
      const idx = productos.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Producto no encontrado");
      productos[idx] = { ...productos[idx], ...data };
      return productos[idx];
    },
    async eliminarProducto(id) {
      await delay();
      const idx = productos.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Producto no encontrado");
      productos.splice(idx, 1);
    },
  };
}

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CL")}`;
}
