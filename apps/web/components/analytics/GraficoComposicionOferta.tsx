"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#725950",
  "#575f6b",
  "#5d5f5f",
  "#e0c0b4",
  "#bfc7d4",
  "#c6c6c7",
];

interface Props {
  data: {
    categoria: string;
    cantidad: number;
    porcentaje: number;
  }[];
}

interface LabelRenderProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: LabelRenderProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function GraficoComposicionOferta({ data }: Props) {
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
        <PieChart>
          <Pie
            data={data}
            dataKey="cantidad"
            nameKey="categoria"
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="75%"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fbf9f8"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value} productos (${props.payload.porcentaje}%)`,
              name,
            ]}
            contentStyle={{
              border: "1px solid #e4e2e2",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontWeight: "600", color: "#4f4441" }}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
