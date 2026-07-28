'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { apiClient } from '@/src/lib/api-client';
import { BarChart3, TrendingUp, Package, Factory, ShoppingCart, ShoppingBag, FileDown } from 'lucide-react';

export default function ReportesPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiClient.reportes.dashboard().then((res) => setData(res.data)).catch(() => {});
  }, []);

  return (
    <RoleGuard roles={['ADMINISTRADOR', 'GERENTE', 'CONTADOR']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-2xl font-semibold text-on-surface">Reportes Gerenciales</h1>
            <p className="font-body text-sm text-on-surface-variant mt-1">Indicadores clave de rendimiento del negocio</p>
          </div>
          <button onClick={async () => {
            try {
              const res = await apiClient.reportes.exportPdf();
              const blob = new Blob([res.data], { type: 'application/pdf' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
              setTimeout(() => URL.revokeObjectURL(url), 60000);
            } catch {}
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-label text-sm hover:bg-primary/90">
            <FileDown className="w-4 h-4" /> Exportar PDF
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { label: 'Materias Primas', value: data?.resumen?.materiasPrimas ?? '--', icon: Package, color: 'text-primary' },
            { label: 'Productos Terminados', value: data?.resumen?.productos ?? '--', icon: Factory, color: 'text-tertiary' },
            { label: 'Ventas Totales', value: data ? `$${Number(data.resumen.ventas).toLocaleString()}` : '--', icon: TrendingUp, color: 'text-success' },
            { label: 'Compras Totales', value: data ? `$${Number(data.resumen.compras).toLocaleString()}` : '--', icon: ShoppingCart, color: 'text-secondary' },
            { label: 'Órdenes Activas', value: data?.resumen?.opsActivas ?? '--', icon: Factory, color: 'text-info' },
            { label: 'Stock Bajo', value: data?.resumen?.stockBajo ?? '--', icon: Package, color: data?.resumen?.stockBajo > 0 ? 'text-warning' : 'text-success' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">{s.label}</p>
                    <p className={`font-headline text-2xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${s.color} opacity-40`} />
                </div>
              </Card>
            );
          })}
        </div>

        {data?.ventasRecientes && data.ventasRecientes.length > 0 && (
          <Card>
            <h2 className="font-headline text-lg font-semibold mb-4">Ventas Recientes</h2>
            <div className="overflow-x-auto">
              <table className="w-full font-body text-sm">
                <thead><tr className="border-b border-outline-variant/20">
                  <th className="text-left py-2 font-label text-xs text-on-surface-variant uppercase">Cliente</th>
                  <th className="text-left py-2 font-label text-xs text-on-surface-variant uppercase">Factura</th>
                  <th className="text-left py-2 font-label text-xs text-on-surface-variant uppercase">Fecha</th>
                  <th className="text-right py-2 font-label text-xs text-on-surface-variant uppercase">Total</th>
                </tr></thead>
                <tbody>
                  {data.ventasRecientes.map((v: any) => (
                    <tr key={v.id} className="border-b border-outline-variant/10">
                      <td className="py-2">{v.cliente?.nombre || '—'}</td>
                      <td className="py-2 font-label text-xs">{v.factura?.numero || '—'}</td>
                      <td className="py-2 font-label text-xs">{new Date(v.fecha).toLocaleDateString()}</td>
                      <td className="py-2 text-right font-semibold">${Number(v.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </RoleGuard>
  );
}
