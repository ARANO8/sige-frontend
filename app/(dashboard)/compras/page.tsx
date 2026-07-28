'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { apiClient } from '@/src/lib/api-client';
import { ShoppingCart, CheckCircle, Truck, XCircle } from 'lucide-react';

export default function ComprasPage() {
  return (
    <RoleGuard roles={['ADMINISTRADOR', 'RESPONSABLE_COMPRAS']}>
      <ComprasContent />
    </RoleGuard>
  );
}

function ComprasContent() {
  const [ocs, setOcs] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tab, setTab] = useState<'OC' | 'PROV'>('OC');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ idProveedor: '', fechaEntrega: '', detalles: [{ idMateriaPrima: '', cantidad: 1, precioUnitario: 0 }] });
  const [provForm, setProvForm] = useState({ nombre: '', nit: '', telefono: '' });

  const load = async () => {
    try {
      const [ocRes, provRes] = await Promise.all([apiClient.ordenCompra.list(), apiClient.proveedores.list()]);
      setOcs(ocRes.data);
      setProveedores(provRes.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const crearOC = async () => {
    try { await apiClient.ordenCompra.create(form); setShowForm(false); await load(); } catch {}
  };

  const recibir = async (id: string) => {
    try { await apiClient.ordenCompra.recibir(id); await load(); } catch {}
  };

  const aprobar = async (id: string) => {
    try { await apiClient.ordenCompra.aprobar(id); await load(); } catch {}
  };

  const crearProv = async () => {
    try { await apiClient.proveedores.create(provForm); setShowForm(false); await load(); } catch {}
  };

  const statusColor: Record<string, string> = {
    SOLICITADA: 'bg-warning/10 text-warning',
    APROBADA: 'bg-info/10 text-info',
    RECIBIDA: 'bg-success/10 text-success',
    CANCELADA: 'bg-error/10 text-error',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Compras</h1>
        <Button onClick={() => setShowForm(!showForm)}><ShoppingCart className="w-4 h-4" /> Nuevo</Button>
      </div>

      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        <button onClick={() => setTab('OC')} className={`px-4 py-2 rounded-lg font-label text-sm ${tab === 'OC' ? 'bg-white shadow-soft' : ''}`}>Órdenes</button>
        <button onClick={() => setTab('PROV')} className={`px-4 py-2 rounded-lg font-label text-sm ${tab === 'PROV' ? 'bg-white shadow-soft' : ''}`}>Proveedores</button>
      </div>

      {tab === 'OC' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {ocs.map((oc) => (
              <Card key={oc.id}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-body font-medium">{oc.proveedor?.nombre || '-'}</h3>
                      <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${statusColor[oc.estado] || ''}`}>{oc.estado}</span>
                    </div>
                    <p className="font-label text-xs text-on-surface-variant">
                      ${Number(oc.total).toFixed(2)} · {oc.detalles?.length || 0} items · {new Date(oc.fecha).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {oc.estado === 'SOLICITADA' && (
                      <button onClick={() => aprobar(oc.id)} className="p-2 text-info hover:bg-info/10 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                    )}
                    {oc.estado === 'APROBADA' && (
                      <button onClick={() => recibir(oc.id)} className="p-2 text-success hover:bg-success/10 rounded-lg"><Truck className="w-4 h-4" /></button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nueva OC</h2>
              <div className="space-y-3">
                <table>
                  <tbody>
                    <tr>
                      <td><select onChange={(e) => setForm({ ...form, idProveedor: e.target.value })} className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-sm"><option value="">Proveedor...</option>{proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}</select></td>
                      <td><Input type="date" value={form.fechaEntrega} onChange={(e) => setForm({ ...form, fechaEntrega: e.target.value })} /></td>
                    </tr>
                  </tbody>
                </table>
                {form.detalles.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="ID MP" value={d.idMateriaPrima} onChange={(e) => { const nd = [...form.detalles]; nd[i].idMateriaPrima = e.target.value; setForm({ ...form, detalles: nd }); }} />
                    <Input placeholder="Cant" type="number" className="w-20" value={d.cantidad} onChange={(e) => { const nd = [...form.detalles]; nd[i].cantidad = Number(e.target.value); setForm({ ...form, detalles: nd }); }} />
                    <Input placeholder="Precio" type="number" className="w-24" value={d.precioUnitario} onChange={(e) => { const nd = [...form.detalles]; nd[i].precioUnitario = Number(e.target.value); setForm({ ...form, detalles: nd }); }} />
                  </div>
                ))}
                <Button variant="ghost" onClick={() => setForm({ ...form, detalles: [...form.detalles, { idMateriaPrima: '', cantidad: 1, precioUnitario: 0 }] })}>+ Item</Button>
                <Button className="w-full" onClick={crearOC}>Crear OC</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'PROV' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {proveedores.map((p) => (
              <Card key={p.id}>
                <h3 className="font-body font-medium">{p.nombre}</h3>
                <p className="font-label text-xs text-on-surface-variant">{p.nit || 'Sin NIT'} · {p.telefono || ''}</p>
              </Card>
            ))}
          </div>
          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nuevo Proveedor</h2>
              <div className="space-y-3">
                <Input label="Nombre" value={provForm.nombre} onChange={(e) => setProvForm({ ...provForm, nombre: e.target.value })} />
                <Input label="NIT" value={provForm.nit} onChange={(e) => setProvForm({ ...provForm, nit: e.target.value })} />
                <Input label="Teléfono" value={provForm.telefono} onChange={(e) => setProvForm({ ...provForm, telefono: e.target.value })} />
                <Button className="w-full" onClick={crearProv}>Guardar</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
