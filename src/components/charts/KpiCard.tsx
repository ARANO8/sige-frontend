'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  color: string;
  icon?: any;
  target?: number;
  actual?: number;
  format?: 'currency' | 'number';
}

export function KpiCard({ label, value, color, icon: Icon, target, actual, format = 'number' }: KpiCardProps) {
  const numActual = actual ?? (typeof value === 'string' ? 0 : Number(value));
  const pct = target && target > 0 ? Math.round((numActual / target) * 100) : null;
  const trend = pct !== null ? (pct >= 100 ? 'up' : pct >= 50 ? 'mid' : 'down') : null;

  return (
    <div className="bento-card space-y-2">
      <div className="flex items-start justify-between">
        <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">{label}</p>
        {Icon && <Icon className={`w-5 h-5 ${color} opacity-50`} />}
      </div>
      <p className={`font-headline text-2xl font-bold ${color}`}>{value}</p>
      {pct !== null && (
        <div className="flex items-center gap-1.5">
          {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-success" />}
          {trend === 'mid' && <Minus className="w-3.5 h-3.5 text-warning" />}
          {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-error" />}
          <span className={`font-label text-xs ${
            trend === 'up' ? 'text-success' : trend === 'mid' ? 'text-warning' : 'text-error'
          }`}>
            {pct}% del objetivo
          </span>
        </div>
      )}
      {target && (
        <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1">
          <div
            className={`h-1.5 rounded-full transition-all ${pct && pct >= 100 ? 'bg-success' : pct && pct >= 50 ? 'bg-warning' : 'bg-error'}`}
            style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
