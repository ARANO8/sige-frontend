'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { apiClient } from '@/src/lib/api-client';
import { FileText, BookOpen, Plus } from 'lucide-react';

type Tab = 'asientos' | 'cuentas';

export default function ContabilidadPage() {
  return (
    <RoleGuard roles={['ADMINISTRADOR', 'CONTADOR']}>
      <ContabilidadContent />
    </RoleGuard>
  );
}

function ContabilidadContent() {
  const [tab, setTab] = useState<Tab>('asientos');
  const [showForm, setShowForm] = useState(false);
  const [asientos, setAsientos] = useState<any[]>([]);
  const [cuentas, setCuentas] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [asientoForm, setAsientoForm] = useState({
    descripcion: '', referencia: '',
    detalles: [{ idCuentaContable: '', tipo: 'DEBE' as 'DEBE' | 'HABER', monto: 0 }],
  });
  const [cuentaForm, setCuentaForm] = useState({ codigo: '', nombre: '', tipo: '', nivel: 1, idPadre: '' });

  const load = async () => {
    try {
      const [aRes, cRes] = await Promise.all([
        apiClient.asientos.list(page),
        apiClient.cuentasContables.list(),
      ]);
      setAsientos(aRes.data.data);
      setTotal(aRes.data.total);
      setCuentas(cRes.data);
    } catch {}
  };

  useEffect(() => { load(); }, [page]);

  const crearAsiento = async () => {
    try { await apiClient.asientos.create(asientoForm); setShowForm(false); await load(); } catch {}
  };
  const crearCuenta = async () => {
    try { await apiClient.cuentasContables.create(cuentaForm); setShowForm(false); await load(); } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-on-surface">Contabilidad</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Libro mayor y plan de cuentas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> {tab === 'asientos' ? 'Nuevo Asiento' : 'Nueva Cuenta'}
        </Button>
      </div>

      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        <button onClick={() => setTab('asientos')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label text-sm ${tab === 'asientos' ? 'bg-white shadow-soft text-primary' : ''}`}>
          <BookOpen className="w-4 h-4" /> Asientos
        </button>
        <button onClick={() => setTab('cuentas')} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label text-sm ${tab === 'cuentas' ? 'bg-white shadow-soft text-primary' : ''}`}>
          <FileText className="w-4 h-4" /> Plan de Cuentas
        </button>
      </div>

      {tab === 'asientos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {asientos.length === 0 ? (
              <Card><p className="font-body text-sm text-on-surface-variant">No hay asientos registrados</p></Card>
            ) : (
              <>
                {asientos.map((a) => (
                  <Card key={a.id}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-body font-medium text-on-surface">{a.descripcion}</h3>
                        <span className="font-label text-xs text-on-surface-variant">{new Date(a.fecha).toLocaleDateString()}</span>
                      </div>
                      {a.referencia && <p className="font-label text-xs text-on-surface-variant">Ref: {a.referencia}</p>}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/20">
                        {a.detalles?.map((d: any, i: number) => (
                          <div key={i} className="flex justify-between font-label text-xs">
                            <span className="text-on-surface-variant truncate">{d.cuenta?.nombre || d.idCuentaContable}</span>
                            <span className={`font-medium ${d.tipo === 'DEBE' ? 'text-error' : 'text-success'}`}>
                              {d.tipo} ${Number(d.monto).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-label text-xs pt-1">
                        <span className="text-on-surface-variant">DEBE: ${a.detalles?.filter((d: any) => d.tipo === 'DEBE').reduce((s: number, d: any) => s + Number(d.monto), 0).toFixed(2)}</span>
                        <span className="text-on-surface-variant">HABER: ${a.detalles?.filter((d: any) => d.tipo === 'HABER').reduce((s: number, d: any) => s + Number(d.monto), 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
                <div className="flex items-center justify-between">
                  <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
                  <span className="font-label text-xs text-on-surface-variant">Pág {page} · {total} total</span>
                  <Button variant="ghost" disabled={asientos.length < 50} onClick={() => setPage(page + 1)}>Siguiente</Button>
                </div>
              </>
            )}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nuevo Asiento</h2>
              <div className="space-y-3">
                <Input label="Descripción" value={asientoForm.descripcion} onChange={(e) => setAsientoForm({ ...asientoForm, descripcion: e.target.value })} />
                <Input label="Referencia (opcional)" value={asientoForm.referencia} onChange={(e) => setAsientoForm({ ...asientoForm, referencia: e.target.value })} />
                {asientoForm.detalles.map((d, i) => (
                  <div key={i} className="space-y-2 p-3 rounded-xl bg-surface-container/50">
                    <div className="flex gap-2">
                      <select value={d.idCuentaContable} onChange={(e) => {
                        const nd = [...asientoForm.detalles]; nd[i].idCuentaContable = e.target.value;
                        setAsientoForm({ ...asientoForm, detalles: nd });
                      }} className="neo-input flex-1 rounded-xl px-3 py-2 bg-surface-container-lowest text-sm">
                        <option value="">Cuenta...</option>
                        {cuentas.map((c) => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
                      </select>
                      <select value={d.tipo} onChange={(e) => {
                        const nd = [...asientoForm.detalles]; nd[i].tipo = e.target.value as 'DEBE' | 'HABER';
                        setAsientoForm({ ...asientoForm, detalles: nd });
                      }} className="neo-input w-20 rounded-xl px-3 py-2 bg-surface-container-lowest text-sm">
                        <option value="DEBE">DEBE</option>
                        <option value="HABER">HABER</option>
                      </select>
                      <Input type="number" className="w-24" value={d.monto} onChange={(e) => {
                        const nd = [...asientoForm.detalles]; nd[i].monto = Number(e.target.value);
                        setAsientoForm({ ...asientoForm, detalles: nd });
                      }} />
                    </div>
                    {i > 0 && (
                      <button onClick={() => {
                        const nd = asientoForm.detalles.filter((_, idx) => idx !== i);
                        setAsientoForm({ ...asientoForm, detalles: nd });
                      }} className="font-label text-xs text-error">Eliminar</button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" onClick={() => setAsientoForm({
                  ...asientoForm,
                  detalles: [...asientoForm.detalles, { idCuentaContable: '', tipo: 'HABER' as const, monto: 0 }],
                })}>+ Línea</Button>
                <Button className="w-full" onClick={crearAsiento}>Registrar Asiento</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'cuentas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {cuentas.length === 0 ? (
              <Card><p className="font-body text-sm text-on-surface-variant">No hay cuentas contables</p></Card>
            ) : (
              cuentas.sort((a, b) => a.codigo.localeCompare(b.codigo)).map((c) => (
                <Card key={c.id} className={`${c.nivel === 1 ? 'border-l-4 border-primary' : ''} ${c.hijas?.length ? 'bg-surface-container-lowest' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-label text-xs text-primary font-bold">{c.codigo}</span>
                        <h3 className="font-body font-medium text-on-surface">{c.nombre}</h3>
                      </div>
                      {c.tipo && <span className="font-label text-xs text-on-surface-variant">{c.tipo} · Nivel {c.nivel || 1}{c.hijas?.length ? ` · ${c.hijas.length} subcuentas` : ''}</span>}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nueva Cuenta</h2>
              <div className="space-y-3">
                <Input label="Código" value={cuentaForm.codigo} onChange={(e) => setCuentaForm({ ...cuentaForm, codigo: e.target.value })} />
                <Input label="Nombre" value={cuentaForm.nombre} onChange={(e) => setCuentaForm({ ...cuentaForm, nombre: e.target.value })} />
                <Input label="Tipo (activo/pasivo/ingreso/gasto)" value={cuentaForm.tipo} onChange={(e) => setCuentaForm({ ...cuentaForm, tipo: e.target.value })} />
                <Input label="Nivel" type="number" value={cuentaForm.nivel} onChange={(e) => setCuentaForm({ ...cuentaForm, nivel: Number(e.target.value) })} />
                <div>
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1 block">Cuenta padre</label>
                  <select value={cuentaForm.idPadre} onChange={(e) => setCuentaForm({ ...cuentaForm, idPadre: e.target.value })}
                    className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-sm">
                    <option value="">Sin padre (raíz)</option>
                    {cuentas.map((c) => <option key={c.id} value={c.id}>{c.codigo} - {c.nombre}</option>)}
                  </select>
                </div>
                <Button className="w-full" onClick={crearCuenta}>Guardar</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
