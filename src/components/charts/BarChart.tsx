'use client';

import { BarChart as ReBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  labels: string[];
  values: number[];
  color?: string;
  title?: string;
  height?: number;
  format?: 'currency' | 'number';
}

export function BarChart({ labels, values, color = '#2563eb', title, height = 300, format = 'currency' }: BarChartProps) {
  if (!labels || labels.length === 0) return <div className="flex items-center justify-center h-48 font-body text-sm text-on-surface-variant">Sin datos disponibles</div>;

  const data = labels.map((label, i) => ({ label, value: values[i] ?? 0 }));

  const formatValue = (v: number) => {
    if (format === 'currency') {
      if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
      if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
      return `$${v}`;
    }
    return v.toString();
  };

  return (
    <div className="space-y-3">
      {title && <h3 className="font-headline text-base font-semibold text-on-surface">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ReBar data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e9ee" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: any) => formatValue(Number(v))} tick={{ fontSize: 11, fill: '#737686' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            formatter={(v: any) => [format === 'currency' ? `$${Number(v).toFixed(2)}` : v, undefined]}
          />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={50} />
        </ReBar>
      </ResponsiveContainer>
    </div>
  );
}
