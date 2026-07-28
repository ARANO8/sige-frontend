'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { useAuth } from '@/src/contexts/AuthContext';
import { apiClient } from '@/src/lib/api-client';
import { Package, Factory, ShoppingCart, ShoppingBag, AlertTriangle, TrendingUp, FileDown, Settings, PlusSquare, ClipboardList } from 'lucide-react';

const roleLabels: Record<string, string> = {
  ADMINISTRADOR: 'Administrador', JEFE_PRODUCCION: 'Jefe Producción',
  RESPONSABLE_INVENTARIOS: 'Resp. Inventarios', RESPONSABLE_COMPRAS: 'Resp. Compras',
  RESPONSABLE_VENTAS: 'Resp. Ventas', CONTADOR: 'Contador',
  RESPONSABLE_RRHH: 'Resp. RRHH', GERENTE: 'Gerente',
};

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
        <div className="flex gap-2 mt-4">
          <button
            onClick={async () => {
              try {
                const res = await apiClient.reportes.exportPdf();
                const blob = new Blob([res.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
                setTimeout(() => URL.revokeObjectURL(url), 60000);
              } catch {}
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-label text-sm hover:bg-primary/90 transition-colors"
          >
            <FileDown className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
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

      <Card className="!p-4">
        <h2 className="font-headline text-lg font-semibold mb-3">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-2">
          {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'JEFE_PRODUCCION'].includes(r.nombre)) && (
            <a href="/produccion" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary/10 text-tertiary font-label text-sm hover:bg-tertiary/20 transition-colors">
              <ClipboardList className="w-4 h-4" /> Nueva OP
            </a>
          )}
          {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'RESPONSABLE_COMPRAS'].includes(r.nombre)) && (
            <a href="/compras" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 text-secondary font-label text-sm hover:bg-secondary/20 transition-colors">
              <PlusSquare className="w-4 h-4" /> Nueva OC
            </a>
          )}
          {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'RESPONSABLE_VENTAS'].includes(r.nombre)) && (
            <a href="/ventas" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success font-label text-sm hover:bg-success/20 transition-colors">
              <ShoppingBag className="w-4 h-4" /> Nueva Venta
            </a>
          )}
          {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'RESPONSABLE_INVENTARIOS'].includes(r.nombre)) && (
            <a href="/inventarios" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-info/10 text-info font-label text-sm hover:bg-info/20 transition-colors">
              <Package className="w-4 h-4" /> Movimiento Inv.
            </a>
          )}
          {usuario?.roles?.some((r) => r.nombre === 'ADMINISTRADOR') && (
            <a href="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-label text-sm hover:bg-primary/20 transition-colors">
              <Settings className="w-4 h-4" /> Administración
            </a>
          )}
        </div>
      </Card>

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
