"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    nombre: string;
    categoria1: number;
    categoria2: number;
  }[];
  labels: {
    categoria1: string;
    categoria2: string;
  };
}

export default function GraficoComparativaProductos({ data, labels }: Props) {
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
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 80,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e2" />
          <XAxis dataKey="nombre" tick={{ fontSize: 11, fill: "#4f4441" }} angle={-35} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 12, fill: "#4f4441" }} />
          <Tooltip
            contentStyle={{
              border: "1px solid #e4e2e2",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontWeight: "600", color: "#4f4441" }} />
          <Bar dataKey="categoria1" fill="#725950" name={labels.categoria1} radius={[6, 6, 0, 0]} />
          <Bar dataKey="categoria2" fill="#575f6b" name={labels.categoria2} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
