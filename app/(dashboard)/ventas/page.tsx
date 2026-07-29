'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { SearchableSelect } from '@/src/components/ui/SearchableSelect';
import { apiClient } from '@/src/lib/api-client';
import { api } from '@/src/lib/api';
import { ShoppingBag, Pencil, Trash2, XCircle } from 'lucide-react';

export default function VentasPage() {
  return (
    <RoleGuard roles={['ADMINISTRADOR', 'RESPONSABLE_VENTAS']}>
      <VentasContent />
    </RoleGuard>
  );
}

function VentasContent() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<{ id: string; nombre: string; codigo?: string }[]>([]);
  const [tab, setTab] = useState<'VENTAS' | 'CLIENTES'>('VENTAS');
  const [showForm, setShowForm] = useState(false);
  const [editingCliId, setEditingCliId] = useState<string | null>(null);
  const [form, setForm] = useState({ idCliente: '', observaciones: '', detalles: [{ idProducto: '', cantidad: 1, precioUnitario: 0 }] });
  const [cliForm, setCliForm] = useState({ nombre: '', nit: '', telefono: '' });

  const load = async () => {
    try {
      const [vRes, cRes, pRes] = await Promise.all([
        apiClient.ventas.list(),
        apiClient.clientes.list(),
        api.get('/producto').catch(() => ({ data: [] })),
      ]);
      setVentas(vRes.data);
      setClientes(cRes.data);
      setProductos((pRes.data || []).map((p: any) => ({ id: p.id, nombre: p.nombre, codigo: p.codigo })));
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const crearVenta = async () => {
    try { await apiClient.ventas.create(form); setShowForm(false); await load(); } catch {}
  };
  const handleEditCli = (c: any) => { setEditingCliId(c.id); setCliForm({ nombre: c.nombre, nit: c.nit ?? '', telefono: c.telefono ?? '' }); setShowForm(true); };

  const crearCliente = async () => {
    try {
      if (editingCliId) await apiClient.clientes.update(editingCliId, cliForm);
      else await apiClient.clientes.create(cliForm);
      setEditingCliId(null); setCliForm({ nombre: '', nit: '', telefono: '' }); setShowForm(false); await load();
    } catch {}
  };

  const statusColor: Record<string, string> = {
    PENDIENTE: 'bg-warning/10 text-warning',
    FACTURADA: 'bg-success/10 text-success',
    ANULADA: 'bg-error/10 text-error',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Ventas</h1>
        <Button onClick={() => setShowForm(!showForm)}><ShoppingBag className="w-4 h-4" /> Nuevo</Button>
      </div>

      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        <button onClick={() => setTab('VENTAS')} className={`px-4 py-2 rounded-lg font-label text-sm ${tab === 'VENTAS' ? 'bg-white shadow-soft' : ''}`}>Ventas</button>
        <button onClick={() => setTab('CLIENTES')} className={`px-4 py-2 rounded-lg font-label text-sm ${tab === 'CLIENTES' ? 'bg-white shadow-soft' : ''}`}>Clientes</button>
      </div>

      {tab === 'VENTAS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {ventas.map((v) => (
              <Card key={v.id}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-body font-medium">{v.cliente?.nombre || '-'}</h3>
                      <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${statusColor[v.estado] || ''}`}>{v.estado}</span>
                      {v.factura && <span className="font-label text-xs text-on-surface-variant">Fact: {v.factura.numero}</span>}
                      {v.estado === 'FACTURADA' && (
                        <button onClick={async () => { try { await apiClient.ventas.anular(v.id); await load(); } catch {} }}
                          className="ml-2 p-1 text-warning hover:bg-warning/10 rounded-lg" title="Anular venta"><XCircle className="w-4 h-4" /></button>
                      )}
                    </div>
                    <p className="font-label text-xs text-on-surface-variant">
                      ${Number(v.total).toFixed(2)} · {v.detalles?.length || 0} items · {new Date(v.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nueva Venta</h2>
              <div className="space-y-3">
                <label className="font-label text-xs text-on-surface-variant uppercase">Cliente</label>
                <select onChange={(e) => setForm({ ...form, idCliente: e.target.value })} className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-sm">
                  <option value="">Seleccionar...</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
                {form.detalles.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <SearchableSelect placeholder="Buscar producto..." items={productos} value={d.idProducto}
                        onChange={(v) => { const nd = [...form.detalles]; nd[i].idProducto = v; setForm({ ...form, detalles: nd }); }} />
                    </div>
                    <Input placeholder="Cant" type="number" className="w-20" value={d.cantidad}
                      onChange={(e) => { const nd = [...form.detalles]; nd[i].cantidad = Number(e.target.value); setForm({ ...form, detalles: nd }); }} />
                    <Input placeholder="P/U" type="number" className="w-24" value={d.precioUnitario}
                      onChange={(e) => { const nd = [...form.detalles]; nd[i].precioUnitario = Number(e.target.value); setForm({ ...form, detalles: nd }); }} />
                  </div>
                ))}
                <Button variant="ghost" onClick={() => setForm({ ...form, detalles: [...form.detalles, { idProducto: '', cantidad: 1, precioUnitario: 0 }] })}>+ Producto</Button>
                <Button className="w-full" onClick={crearVenta}>Facturar</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'CLIENTES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {clientes.map((c) => (
              <Card key={c.id}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-body font-medium">{c.nombre}</h3>
                    <p className="font-label text-xs text-on-surface-variant">{c.nit || 'Sin NIT'} · {c.telefono || ''}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditCli(c)} className="p-1.5 text-info hover:bg-info/10 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={async () => { try { await apiClient.clientes.remove(c.id); await load(); } catch {} }} className="p-1.5 text-on-surface-variant hover:text-error"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">{editingCliId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <div className="space-y-3">
                <Input label="Nombre" value={cliForm.nombre} onChange={(e) => setCliForm({ ...cliForm, nombre: e.target.value })} />
                <Input label="NIT" value={cliForm.nit} onChange={(e) => setCliForm({ ...cliForm, nit: e.target.value })} />
                <Input label="Teléfono" value={cliForm.telefono} onChange={(e) => setCliForm({ ...cliForm, telefono: e.target.value })} />
                <Button className="w-full" onClick={crearCliente}>{editingCliId ? 'Guardar cambios' : 'Guardar'}</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
