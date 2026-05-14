"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    nombre: string;
    precioPromedio: number;
    totalProductos: number;
  }[];
}

export default function GraficoPromedioPrecio({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-gray-50 h-full">
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Sin datos
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ border: "2px solid black", borderRadius: 0 }}
          />
          <Bar dataKey="precioPromedio" fill="#000000" name="Precio Promedio" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
