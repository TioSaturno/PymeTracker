"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { fecha: string; precioPromedio: number }[];
  label: string;
  color?: string;
}

export default function GraficoEvolucionPrecio({ data, label, color = "#000000" }: Props) {
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
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ border: "2px solid black", borderRadius: 0 }}
            formatter={(value: number) => [`$${value}`, label]}
          />
          <Line
            type="monotone"
            dataKey="precioPromedio"
            stroke={color}
            strokeWidth={3}
            dot={{ r: 5, fill: color, strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 7 }}
            name={label}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}