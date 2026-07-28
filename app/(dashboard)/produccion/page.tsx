'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { apiClient } from '@/src/lib/api-client';
import { Factory, CheckCircle, XCircle, Package } from 'lucide-react';

export default function ProduccionPage() {
  return (
    <RoleGuard roles={['ADMINISTRADOR', 'JEFE_PRODUCCION']}>
      <ProduccionContent />
    </RoleGuard>
  );
}

function ProduccionContent() {
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [boms, setBoms] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'OP' | 'BOM'>('OP');
  const [form, setForm] = useState({ idProducto: '', idBOM: '', cantidadPlanificada: 1, observaciones: '' });
  const [bomForm, setBomForm] = useState({ idProducto: '', nombre: '', detalles: [{ idMateriaPrima: '', cantidad: 1, secuencia: 1 }] });

  const load = async () => {
    try {
      const [opRes, bomRes] = await Promise.all([apiClient.produccion.list(), apiClient.bom.list()]);
      setOrdenes(opRes.data);
      setBoms(bomRes.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const crearOP = async () => {
    try { await apiClient.produccion.create(form); setShowForm(false); await load(); } catch {}
  };

  const finalizar = async (id: string) => {
    try { await apiClient.produccion.finalizar(id); await load(); } catch {}
  };

  const cancelar = async (id: string) => {
    try { await apiClient.produccion.cancelar(id); await load(); } catch {}
  };

  const crearBOM = async () => {
    try { await apiClient.bom.create(bomForm); await load(); } catch {}
  };

  const statusColor: Record<string, string> = {
    PLANIFICADA: 'bg-warning/10 text-warning',
    EN_PROCESO: 'bg-info/10 text-info',
    COMPLETADA: 'bg-success/10 text-success',
    CANCELADA: 'bg-error/10 text-error',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-semibold">Producción</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Órdenes de producción y listas de materiales</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Factory className="w-4 h-4" /> {tab === 'OP' ? 'Nueva OP' : 'Nueva BOM'}</Button>
      </div>

      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        <button onClick={() => setTab('OP')} className={`px-4 py-2 rounded-lg font-label text-sm ${tab === 'OP' ? 'bg-white shadow-soft' : ''}`}>Órdenes</button>
        <button onClick={() => setTab('BOM')} className={`px-4 py-2 rounded-lg font-label text-sm ${tab === 'BOM' ? 'bg-white shadow-soft' : ''}`}>BOMs</button>
      </div>

      {tab === 'OP' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {ordenes.map((op) => (
              <Card key={op.id}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-body font-medium">{op.producto?.nombre || '-'}</h3>
                      <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${statusColor[op.estado] || ''}`}>{op.estado}</span>
                    </div>
                    <p className="font-label text-xs text-on-surface-variant">
                      Plan: {op.cantidadPlanificada} · Prod: {op.cantidadProducida || 0} · BOM: {op.bom?.nombre || 'N/A'}
                    </p>
                    {op.consumos && op.consumos.length > 0 && (
                      <p className="font-label text-xs text-on-surface-variant">Consumos: {op.consumos.length} MP</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {op.estado !== 'COMPLETADA' && op.estado !== 'CANCELADA' && (
                      <>
                        <button onClick={() => finalizar(op.id)} className="p-2 text-success hover:bg-success/10 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                        <button onClick={() => cancelar(op.id)} className="p-2 text-error hover:bg-error/10 rounded-lg"><XCircle className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {showForm && (
            <Card>
              <div className="space-y-4">
                <h2 className="font-headline text-lg font-semibold">Nueva OP</h2>
                <Input label="ID Producto" value={form.idProducto} onChange={(e) => setForm({ ...form, idProducto: e.target.value })} />
                <Input label="ID BOM (opcional)" value={form.idBOM} onChange={(e) => setForm({ ...form, idBOM: e.target.value })} />
                <Input label="Cantidad planificada" type="number" value={form.cantidadPlanificada} onChange={(e) => setForm({ ...form, cantidadPlanificada: Number(e.target.value) })} />
                <Input label="Observaciones" value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
                <Button className="w-full" onClick={crearOP}>Crear</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'BOM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {boms.map((bom) => (
              <Card key={bom.id}>
                <div className="space-y-1">
                  <h3 className="font-body font-medium">{bom.nombre}</h3>
                  <p className="font-label text-xs text-on-surface-variant">
                    Producto: {bom.producto?.nombre} · v{bom.version} · {bom.detalles?.length || 0} materiales
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bom.detalles?.map((det: any, i: number) => (
                      <span key={i} className="inline-flex px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-label text-xs">
                        {det.materiaPrima?.nombre || det.idMateriaPrima} x{det.cantidad}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {showForm && (
            <Card>
              <div className="space-y-4">
                <h2 className="font-headline text-lg font-semibold">Nueva BOM</h2>
                <Input label="ID Producto" value={bomForm.idProducto} onChange={(e) => setBomForm({ ...bomForm, idProducto: e.target.value })} />
                <Input label="Nombre BOM" value={bomForm.nombre} onChange={(e) => setBomForm({ ...bomForm, nombre: e.target.value })} />
                {bomForm.detalles.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="ID MP" value={d.idMateriaPrima} onChange={(e) => {
                      const nd = [...bomForm.detalles]; nd[i].idMateriaPrima = e.target.value; setBomForm({ ...bomForm, detalles: nd });
                    }} />
                    <Input placeholder="Cant" type="number" className="w-20" value={d.cantidad} onChange={(e) => {
                      const nd = [...bomForm.detalles]; nd[i].cantidad = Number(e.target.value); setBomForm({ ...bomForm, detalles: nd });
                    }} />
                  </div>
                ))}
                <Button variant="ghost" onClick={() => setBomForm({ ...bomForm, detalles: [...bomForm.detalles, { idMateriaPrima: '', cantidad: 1, secuencia: bomForm.detalles.length + 1 }] })}>+ Agregar MP</Button>
                <Button className="w-full" onClick={crearBOM}>Guardar BOM</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
