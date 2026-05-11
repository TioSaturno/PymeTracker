// Workaround para arreglar tipos de recharts con React 19
// Este archivo corrige un error pre-existente en el proyecto
declare module "recharts" {
  export const BarChart: any;
  export const Bar: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const Legend: any;
  export const ResponsiveContainer: any;
  export const LineChart: any;
  export const Line: any;
  export const PieChart: any;
  export const Pie: any;
  export const Cell: any;
  export const ComposedChart: any;
}