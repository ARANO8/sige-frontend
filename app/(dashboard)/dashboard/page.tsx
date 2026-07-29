'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/contexts/AuthContext';
import { apiClient } from '@/src/lib/api-client';
import { KpiCard, LineChart, BarChart, PieChart } from '@/src/components/charts';
import { Package, Factory, ShoppingCart, ShoppingBag, AlertTriangle, TrendingUp, FileDown, Settings, ClipboardList, PlusSquare } from 'lucide-react';

const periodos = [
  { value: 3, label: '3 meses' },
  { value: 6, label: '6 meses' },
  { value: 12, label: '12 meses' },
];

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [data, setData] = useState<any>(null);
  const [ventas, setVentas] = useState<any>(null);
  const [compras, setCompras] = useState<any>(null);
  const [topProd, setTopProd] = useState<any[]>([]);
  const [distribucion, setDistribucion] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [periodo, setPeriodo] = useState(6);

  const loadCharts = async (meses: number) => {
    try {
      const [d, v, c, tp, di, kc] = await Promise.all([
        apiClient.reportes.dashboard(),
        apiClient.reportes.ventasMensuales(meses),
        apiClient.reportes.comprasMensuales(meses),
        apiClient.reportes.topProductos(5),
        apiClient.reportes.distribucionInventario(),
        apiClient.reportes.kpiConfig(),
      ]);
      setData(d.data);
      setVentas(v.data);
      setCompras(c.data);
      setTopProd(tp.data);
      setDistribucion(di.data);
      setConfig(kc.data);
    } catch {}
  };

  useEffect(() => { loadCharts(periodo); }, [periodo]);

  const kpis = config?.kpisConfig;
  const charts = config?.chartsConfig;

  return (
    <RoleGuard roles={['ADMINISTRADOR', 'GERENTE', 'JEFE_PRODUCCION', 'RESPONSABLE_INVENTARIOS', 'RESPONSABLE_COMPRAS', 'RESPONSABLE_VENTAS', 'CONTADOR']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-2xl font-semibold text-on-surface">Dashboard Gerencial</h1>
            <p className="font-body text-sm text-on-surface-variant mt-1">Bienvenido, {usuario?.nombre}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container rounded-lg p-0.5">
              {periodos.map((p) => (
                <button key={p.value} onClick={() => setPeriodo(p.value)}
                  className={`px-3 py-1.5 rounded-lg font-label text-xs transition-all ${periodo === p.value ? 'bg-white shadow-soft text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  {p.label}
                </button>
              ))}
            </div>
            <button onClick={async () => {
              try { const r = await apiClient.reportes.exportPdf(); const b = new Blob([r.data], { type: 'application/pdf' }); window.open(URL.createObjectURL(b), '_blank'); } catch {}
            }} className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors">
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fila de KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {data && kpis?.ventas?.enabled && (
            <KpiCard label="Ventas" value={`$${Number(data.resumen.ventas).toLocaleString()}`} color="text-success" icon={TrendingUp} target={kpis.ventas.target} actual={data.resumen.ventas} />
          )}
          {data && kpis?.compras?.enabled && (
            <KpiCard label="Compras" value={`$${Number(data.resumen.compras).toLocaleString()}`} color="text-secondary" icon={ShoppingCart} target={kpis.compras.target} actual={data.resumen.compras} />
          )}
          {data && kpis?.opsActivas?.enabled && (
            <KpiCard label="OP Activas" value={data.resumen.opsActivas} color="text-info" icon={Factory} target={kpis.opsActivas.target} actual={data.resumen.opsActivas} />
          )}
          {data && kpis?.stockBajo?.enabled && (
            <KpiCard label="Stock Bajo" value={data.resumen.stockBajo} color={data.resumen.stockBajo > (kpis.stockBajo?.warningAt || 5) ? 'text-warning' : 'text-success'} icon={AlertTriangle} target={kpis.stockBajo.target} actual={data.resumen.stockBajo} />
          )}
          {data && kpis?.materiasPrimas?.enabled && (
            <KpiCard label="Materias Primas" value={data.resumen.materiasPrimas} color="text-primary" icon={Package} />
          )}
          {data && kpis?.productos?.enabled && (
            <KpiCard label="Productos" value={data.resumen.productos} color="text-tertiary" icon={Factory} />
          )}
        </div>

        {/* Acciones rápidas */}
        <Card className="!p-4">
          <h2 className="font-headline text-base font-semibold mb-3">Acciones Rápidas</h2>
          <div className="flex flex-wrap gap-2">
            {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'JEFE_PRODUCCION'].includes(r.nombre)) && (
              <a href="/produccion" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary/10 text-tertiary font-label text-sm hover:bg-tertiary/20"><ClipboardList className="w-4 h-4" /> Nueva OP</a>
            )}
            {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'RESPONSABLE_COMPRAS'].includes(r.nombre)) && (
              <a href="/compras" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 text-secondary font-label text-sm hover:bg-secondary/20"><PlusSquare className="w-4 h-4" /> Nueva OC</a>
            )}
            {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'RESPONSABLE_VENTAS'].includes(r.nombre)) && (
              <a href="/ventas" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success font-label text-sm hover:bg-success/20"><ShoppingBag className="w-4 h-4" /> Nueva Venta</a>
            )}
            {usuario?.roles?.some((r) => ['ADMINISTRADOR', 'RESPONSABLE_INVENTARIOS'].includes(r.nombre)) && (
              <a href="/inventarios" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-info/10 text-info font-label text-sm hover:bg-info/20"><Package className="w-4 h-4" /> Movimiento Inv.</a>
            )}
            {usuario?.roles?.some((r) => r.nombre === 'ADMINISTRADOR') && (
              <a href="/admin" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary font-label text-sm hover:bg-primary/20"><Settings className="w-4 h-4" /> Admin</a>
            )}
          </div>
        </Card>

        {/* Gráficas: Línea + Barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts?.ventasMensuales?.enabled && ventas && (
            <Card>
              <LineChart
                title={charts.ventasMensuales.title}
                labels={ventas.labels}
                series={[
                  { key: 'ventas', label: 'Ventas', color: '#16a34a', values: ventas.values },
                  ...(compras && charts.ventasMensuales.metrics?.includes('compras')
                    ? [{ key: 'compras', label: 'Compras', color: '#84cc16', values: compras.values }]
                    : []),
                ]}
              />
            </Card>
          )}
          {charts?.topProductos?.enabled && topProd.length > 0 && (
            <Card>
              <BarChart
                title="Top Productos más Vendidos"
                labels={topProd.map((p: any) => p.nombre.substring(0, 20))}
                values={topProd.map((p: any) => p.total)}
                color="#2563eb"
                format="currency"
              />
            </Card>
          )}
        </div>

        {/* Gráficas: Pie + Tabla */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {charts?.distribucion?.enabled && distribucion.length > 0 && (
            <Card>
              <PieChart title="Distribución de Inventario por Producto" data={distribucion} />
            </Card>
          )}
          {data?.ventasRecientes && data.ventasRecientes.length > 0 && (
            <Card>
              <h2 className="font-headline text-base font-semibold mb-4">Últimas Ventas</h2>
              <div className="space-y-3">
                {data.ventasRecientes.map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                    <div>
                      <p className="font-body text-sm font-medium text-on-surface">{v.cliente?.nombre || 'Cliente'}</p>
                      <p className="font-label text-xs text-on-surface-variant">{v.factura?.numero} · {new Date(v.fecha).toLocaleDateString()}</p>
                    </div>
                    <span className="font-body text-sm font-semibold text-on-surface">${Number(v.total).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
