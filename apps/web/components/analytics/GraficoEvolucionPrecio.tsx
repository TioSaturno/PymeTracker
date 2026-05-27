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

export default function GraficoEvolucionPrecio({ data, label, color = "#725950" }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f5f3f3]/30 h-full">
        <p className="text-[#817470] font-semibold tracking-wider text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e2" />
          <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#4f4441" }} angle={-25} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12, fill: "#4f4441" }} />
          <Tooltip
            contentStyle={{
              border: "1px solid #e4e2e2",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
            formatter={(value: number) => [`$${value}`, label]}
          />
          <Line
            type="monotone"
            dataKey="precioPromedio"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: color, strokeWidth: 2, stroke: "#fbf9f8" }}
            activeDot={{ r: 6 }}
            name={label}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
