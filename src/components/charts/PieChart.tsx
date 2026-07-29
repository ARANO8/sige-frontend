'use client';

import { PieChart as RePie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PieData {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  title?: string;
  height?: number;
}

export function PieChart({ data, title, height = 300 }: PieChartProps) {
  if (!data || data.length === 0) return <div className="flex items-center justify-center h-48 font-body text-sm text-on-surface-variant">Sin datos disponibles</div>;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-3">
      {title && <h3 className="font-headline text-base font-semibold text-on-surface">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RePie>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            formatter={(v: any, name: any) => [`${v} (${((Number(v) / total) * 100).toFixed(1)}%)`, name]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: 11, paddingLeft: 16 }}
          />
        </RePie>
      </ResponsiveContainer>
    </div>
  );
}
