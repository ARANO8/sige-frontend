'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { apiClient } from '@/src/lib/api-client';
import { KpiCard, LineChart, BarChart, PieChart } from '@/src/components/charts';
import { FileDown } from 'lucide-react';

const periodos = [
  { value: 3, label: '3 meses' },
  { value: 6, label: '6 meses' },
  { value: 12, label: '12 meses' },
];

export default function ReportesPage() {
  const [data, setData] = useState<any>(null);
  const [ventas, setVentas] = useState<any>(null);
  const [compras, setCompras] = useState<any>(null);
  const [produccion, setProduccion] = useState<any>(null);
  const [topProd, setTopProd] = useState<any[]>([]);
  const [distribucion, setDistribucion] = useState<any[]>([]);
  const [periodo, setPeriodo] = useState(6);

  const loadAll = async (meses: number) => {
    try {
      const [d, v, c, p, tp, di] = await Promise.all([
        apiClient.reportes.dashboard(),
        apiClient.reportes.ventasMensuales(meses),
        apiClient.reportes.comprasMensuales(meses),
        apiClient.reportes.produccionMensual(meses),
        apiClient.reportes.topProductos(10),
        apiClient.reportes.distribucionInventario(),
      ]);
      setData(d.data); setVentas(v.data); setCompras(c.data); setProduccion(p.data); setTopProd(tp.data); setDistribucion(di.data);
    } catch {}
  };

  useEffect(() => { loadAll(periodo); }, [periodo]);

  return (
    <RoleGuard roles={['ADMINISTRADOR', 'GERENTE', 'CONTADOR']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-2xl font-semibold text-on-surface">Reportes Gerenciales</h1>
            <p className="font-body text-sm text-on-surface-variant mt-1">Análisis completo con indicadores y gráficas</p>
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
            }} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-label text-sm hover:bg-primary/90">
              <FileDown className="w-4 h-4" /> Exportar PDF
            </button>
          </div>
        </div>

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <KpiCard label="Ventas" value={`$${Number(data.resumen.ventas).toLocaleString()}`} color="text-success" target={100000} actual={data.resumen.ventas} />
            <KpiCard label="Compras" value={`$${Number(data.resumen.compras).toLocaleString()}`} color="text-secondary" target={80000} actual={data.resumen.compras} />
            <KpiCard label="OP Activas" value={data.resumen.opsActivas} color="text-info" target={10} actual={data.resumen.opsActivas} />
            <KpiCard label="Stock Bajo" value={data.resumen.stockBajo} color={data.resumen.stockBajo > 5 ? 'text-warning' : 'text-success'} target={0} actual={data.resumen.stockBajo} />
            <KpiCard label="Materias Primas" value={data.resumen.materiasPrimas} color="text-primary" />
            <KpiCard label="Productos" value={data.resumen.productos} color="text-tertiary" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ventas && (
            <Card>
              <LineChart
                title="Ventas vs Compras"
                labels={ventas.labels}
                series={[
                  { key: 'ventas', label: 'Ventas', color: '#16a34a', values: ventas.values },
                  ...(compras ? [{ key: 'compras', label: 'Compras', color: '#84cc16', values: compras.values }] : []),
                ]}
              />
            </Card>
          )}
          {produccion && (
            <Card>
              <BarChart
                title="Unidades Producidas"
                labels={produccion.labels}
                values={produccion.values}
                color="#06b6d4"
                format="number"
              />
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {distribucion.length > 0 && (
            <Card>
              <PieChart title="Distribución del Inventario" data={distribucion} />
            </Card>
          )}
          {topProd.length > 0 && (
            <Card>
              <BarChart
                title="Top 10 Productos más Vendidos"
                labels={topProd.map((p: any) => p.nombre.substring(0, 22))}
                values={topProd.map((p: any) => p.total)}
                color="#9333ea"
                format="currency"
              />
            </Card>
          )}
        </div>

        {data?.ventasRecientes && data.ventasRecientes.length > 0 && (
          <Card>
            <h2 className="font-headline text-lg font-semibold mb-4">Últimas Ventas</h2>
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
