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
  "#000000",
  "#555555",
  "#888888",
  "#aaaaaa",
  "#cccccc",
  "#e0e0e0",
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
      fontWeight="bold"
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function GraficoComposicionOferta({ data }: Props) {
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
                stroke="#000"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => [
              `${value} productos (${props.payload.porcentaje}%)`,
              name,
            ]}
            contentStyle={{ border: "2px solid black", borderRadius: 0 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, fontWeight: "bold" }}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}