'use client';

import { LineChart as Rechart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Serie {
  key: string;
  label: string;
  color: string;
  values: number[];
}

interface LineChartProps {
  labels: string[];
  series: Serie[];
  title?: string;
  height?: number;
}

export function LineChart({ labels, series, title, height = 300 }: LineChartProps) {
  if (!labels || labels.length === 0) return <div className="flex items-center justify-center h-48 font-body text-sm text-on-surface-variant">Sin datos disponibles</div>;

  const data = labels.map((label, i) => {
    const point: any = { label };
    for (const s of series) point[s.key] = s.values[i] ?? 0;
    return point;
  });

  const formatValue = (v: number) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
    return `$${v}`;
  };

  return (
    <div className="space-y-3">
      {title && <h3 className="font-headline text-base font-semibold text-on-surface">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <Rechart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e9ee" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: any) => formatValue(Number(v))} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            labelStyle={{ fontWeight: 600, fontSize: 13 }}
            formatter={(v: any) => [`$${Number(v).toFixed(2)}`, undefined]}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} strokeWidth={2.5} dot={{ r: 4, fill: s.color }} activeDot={{ r: 6 }} />
          ))}
        </Rechart>
      </ResponsiveContainer>
    </div>
  );
}
