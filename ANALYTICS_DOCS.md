# Análisis de Precios - Documentación Técnica

## Resumen

Se han implementado dos gráficos interactivos en estilo **Neo-Brutalista** que visualizan datos de análisis de precios de restaurantes extraídos de la tabla `analisis` en la base de datos.

## Arquitectura Implementada

### 1. **Tipos TypeScript** (`apps/web/types/analytics.ts`)

Interfaces totalmente type-safe basadas en la estructura de `executed.json`:

```typescript
- Precio: { producto: string; precio: number }
- Empresa: { id, nombre, calificaciones, precios, ... }
- PayloadData: { empresas[], busqueda, fecha, total_empresas }
- PrecioPromedioPorRestaurante: datos procesados para gráfico 1
- ComparativaProductos: datos procesados para gráfico 2
```

### 2. **Server Action** (`apps/web/app/actions/analytics-actions.ts`)

Funciones async que se ejecutan en el servidor:

- **`obtenerPrimeraAnalisis()`**: Obtiene el primer registro de `analisis.payload_data` usando Drizzle ORM
- **`calcularPreciosPromedios()`**: Filtra empresas con precios != null y calcula promedios
- **`calcularComparativaProductos()`**: Compara productos tipo "Roll" vs "Gohan"

### 3. **Componentes Client** (con "use client")

#### `GraficoPromedioPrecio.tsx`
- Gráfico de barras simples
- Muestra precio promedio total por restaurante
- Tooltip personalizado con sombra y borde grueso
- Hover interactivo: barras cambian a amarillo (#FFFF00)

#### `GraficoComparativaProductos.tsx`
- Gráfico de barras agrupadas
- Compara precios promedio de Rolls vs Gohans
- Filtro automático: solo restaurantes con ambas categorías
- Diseño similar al primer gráfico

### 4. **Página Principal** (`apps/web/app/analisis/page.tsx`)

Server Component que:
- Obtiene datos de la BD
- Calcula gráficos
- Renderiza interfaz completa con:
  - Header con información del análisis
  - Caja de info (total empresas, precios mín/máx)
  - Dos gráficos lado a lado
  - Tabla detallada de restaurantes

## Diseño Visual (Neo-Brutalista)

### Estética Aplicada

```css
/* Contenedores */
- Fondo: blanco (#FFFFFF)
- Borde: 2px sólido negro
- Border-radius: 0 (sin esquinas redondeadas)
- Sombra: 4px offset, 4px vertical, negro 100%
  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]

/* Elementos Gráficos */
- Barras: fondo blanco, stroke negro 2px
- Hover: cambio a amarillo vibrante (#FFFF00)
- Líneas de grid: negras, opacidad reducida
- Ejes: negros, 2px de grosor

/* Typography */
- Títulos: uppercase, font-bold
- Datos: font-bold, negro
- Todo en familia monoespaciada (compatible con Recharts)
```

### Componentes de UI

- **Tooltip**: Cuadro de diálogo con borde grueso y sombra sólida
- **Tabla**: Bordes 2px, alternancia de filas gris/blanco
- **Botones**: Inversión de color en hover

## Estructura de Carpetas

```
apps/web/
├── app/
│   ├── actions/
│   │   └── analytics-actions.ts       # Server actions
│   ├── analisis/
│   │   └── page.tsx                   # Página principal
│   └── globals.css
├── components/
│   └── analytics/
│       ├── GraficoPromedioPrecio.tsx
│       └── GraficoComparativaProductos.tsx
├── types/
│   └── analytics.ts                   # Tipos TypeScript
└── package.json                       # Recharts agregado
```

## Dependencias Agregadas

```json
{
  "dependencies": {
    "recharts": "^2.12.7"
  }
}
```

## Flujo de Datos

```
obtenerPrimeraAnalisis()
    ↓
PayloadData { empresas[] }
    ├─→ filtrarEmpresasConPrecios()
    │   ├─→ calcularPreciosPromedios() → GraficoPromedioPrecio
    │   └─→ calcularComparativaProductos() → GraficoComparativaProductos
    └─→ Tabla de restaurantes
```

## Características de Seguridad

- ✅ Types totalmente tipados (TypeScript strict)
- ✅ Server Actions validadas como async
- ✅ Null checks en payload_data
- ✅ Filtrado seguro de datos con precios
- ✅ Manejo de errores en queries de BD

## Cómo Usar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Levantar base de datos
```bash
npm run db:local
```

### 3. Ejecutar migraciones
```bash
npm run db:migrate
```

### 4. Insertar datos de prueba

Insertar un registro en `analisis` con estructura:
```sql
INSERT INTO analisis (tienda_id, usuario_id, status, payload_data)
VALUES (1, 1, 'completed', '<JSON con estructura de executed.json>');
```

### 5. Ejecutar dev
```bash
npm run dev:web
```

Acceder a: `http://localhost:3000/analisis`

## Filtrado de Datos

### Empresas mostradas
- **Gráfico 1**: Solo restaurantes con `precios != null`
- **Gráfico 2**: Solo restaurantes con AMBOS "Roll" y "Gohan" en nombres de productos
- **Tabla**: Todas las empresas con precios

### Productos filtrados

- **Rolls**: Nombres que incluyan "roll" (case-insensitive)
- **Gohans**: Nombres que incluyan "gohan" (case-insensitive)
- **Filtro**: Solo se cuentan productos con `precio > 0`

## Ejemplo de Datos Procesados

**Input** (executed.json):
```json
{
  "empresas": [
    {
      "nombre": "Yako Sushi",
      "precios": [
        { "producto": "Kuro Rolls", "precio": 11990 },
        { "producto": "Gohan de Pollo", "precio": 8990 }
      ]
    }
  ]
}
```

**Output** (Gráfico 1):
```
Yako Sushi: $10,490 (2 productos)
```

**Output** (Gráfico 2):
```
Yako Sushi:
  - Rolls: $11,990
  - Gohans: $8,990
```

## Validación de Build

✅ Compilación: **Exitosa**
✅ TypeScript: **Sin errores**
✅ Recharts: **Integrado correctamente**
✅ Tailwind CSS: **Activo**

## Notas Técnicas

1. **Server Components**: La página usa `async` para fetching de datos
2. **Client Components**: Gráficos usando `"use client"` para interactividad
3. **Recharts**: Customización de tooltips y estilos con clases Tailwind
4. **Drizzle ORM**: Queries type-safe sin SQL crudo
5. **Monorepo**: Imports desde `@pymetracker/db` para compartir tipos

## Próximos Pasos (Opcional)

- [ ] Agregar filtro por tiendaID en lugar de primer registro
- [ ] Paginar tabla de restaurantes
- [ ] Exportar datos a CSV/Excel
- [ ] Cache de resultados con revalidateTag
- [ ] Gráficos adicionales (líneas, pie charts)
- [ ] Comparativa temporal entre análisis
