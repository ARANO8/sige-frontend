'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/contexts/AuthContext';
import { apiClient } from '@/src/lib/api-client';
import { Package, Factory, ShoppingCart, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.reportes.dashboard().then((res) => setData(res.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Materias Primas', value: data?.resumen?.materiasPrimas ?? '--', icon: Package, color: 'text-primary' },
    { label: 'Productos', value: data?.resumen?.productos ?? '--', icon: Factory, color: 'text-tertiary' },
    { label: 'Ventas totales', value: data ? `$${Number(data.resumen.ventas).toLocaleString()}` : '--', icon: TrendingUp, color: 'text-success' },
    { label: 'Compras totales', value: data ? `$${Number(data.resumen.compras).toLocaleString()}` : '--', icon: ShoppingCart, color: 'text-secondary' },
    { label: 'OP Activas', value: data?.resumen?.opsActivas ?? '--', icon: Factory, color: 'text-info' },
    { label: 'Stock Bajo', value: data?.resumen?.stockBajo ?? '--', icon: AlertTriangle, color: data?.resumen?.stockBajo > 0 ? 'text-warning' : 'text-success' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-semibold text-on-surface">Dashboard Gerencial</h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">Bienvenido, {usuario?.nombre}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
                  <p className={`font-headline text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-40`} />
              </div>
            </Card>
          );
        })}
      </div>

      {data?.ventasRecientes && data.ventasRecientes.length > 0 && (
        <Card>
          <h2 className="font-headline text-lg font-semibold mb-4">Ventas Recientes</h2>
          <div className="space-y-3">
            {data.ventasRecientes.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="font-body font-medium text-sm">{v.cliente?.nombre || 'Cliente'}</p>
                  <p className="font-label text-xs text-on-surface-variant">{v.factura?.numero} · {new Date(v.fecha).toLocaleDateString()}</p>
                </div>
                <span className="font-body font-semibold text-sm">${Number(v.total).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
