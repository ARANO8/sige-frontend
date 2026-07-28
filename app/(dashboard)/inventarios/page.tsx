'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { inventariosApi, type MateriaPrima, type Producto, type Almacen, type Movimiento, type Categoria, type UnidadMedida } from '@/src/lib/inventarios-api';
import { Package, Plus, Trash2, Archive, ArrowUpDown, Factory } from 'lucide-react';

type Tab = 'materias-primas' | 'productos' | 'almacenes' | 'movimientos';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'materias-primas', label: 'Materias Primas', icon: Package },
  { id: 'productos', label: 'Productos', icon: Factory },
  { id: 'almacenes', label: 'Almacenes', icon: Archive },
  { id: 'movimientos', label: 'Movimientos', icon: ArrowUpDown },
];

export default function InventariosPage() {
  const [activeTab, setActiveTab] = useState<Tab>('materias-primas');
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-on-surface">Inventarios</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Gestión de existencias y almacenes</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> Nuevo
        </Button>
      </div>

      <div className="flex gap-1 bg-surface-container rounded-xl p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary shadow-soft'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'materias-primas' && <MateriasPrimasSection showForm={showForm} onClose={() => setShowForm(false)} />}
      {activeTab === 'productos' && <ProductosSection showForm={showForm} onClose={() => setShowForm(false)} />}
      {activeTab === 'almacenes' && <AlmacenesSection showForm={showForm} onClose={() => setShowForm(false)} />}
      {activeTab === 'movimientos' && <MovimientosSection showForm={showForm} onClose={() => setShowForm(false)} />}
    </div>
  );
}

function MateriasPrimasSection({ showForm, onClose }: { showForm: boolean; onClose: () => void }) {
  const [items, setItems] = useState<MateriaPrima[]>([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', costoUnitario: 0, stockMinimo: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await inventariosApi.materiasPrimas.list();
      setItems(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await inventariosApi.materiasPrimas.create(form);
      setForm({ codigo: '', nombre: '', costoUnitario: 0, stockMinimo: 0 });
      onClose();
      await load();
    } catch {}
  };

  const remove = async (id: string) => {
    try {
      await inventariosApi.materiasPrimas.remove(id);
      await load();
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card>
        ) : items.length === 0 ? (
          <Card><p className="font-body text-sm text-on-surface-variant">No hay materias primas registradas</p></Card>
        ) : (
          items.map((mp) => (
            <Card key={mp.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-body font-medium text-on-surface">{mp.nombre}</h3>
                <p className="font-label text-xs text-on-surface-variant">
                  {mp.codigo} · Costo: ${Number(mp.costoUnitario).toFixed(2)} · Stock mín: {Number(mp.stockMinimo)}
                </p>
                {mp.categoria && <span className="inline-block px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-label text-xs">{mp.categoria.nombre}</span>}
              </div>
              <button onClick={() => remove(mp.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Card className="lg:col-span-1">
          <div className="space-y-4">
            <h2 className="font-headline text-lg font-semibold">Nueva MP</h2>
            <Input label="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Costo unitario" type="number" value={form.costoUnitario} onChange={(e) => setForm({ ...form, costoUnitario: Number(e.target.value) })} />
            <Input label="Stock mínimo" type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: Number(e.target.value) })} />
            <Button className="w-full" onClick={create}>Guardar</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function ProductosSection({ showForm, onClose }: { showForm: boolean; onClose: () => void }) {
  const [items, setItems] = useState<Producto[]>([]);
  const [form, setForm] = useState({ codigo: '', nombre: '', precioVenta: 0, stockMinimo: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await inventariosApi.productos.list();
      setItems(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await inventariosApi.productos.create(form);
      setForm({ codigo: '', nombre: '', precioVenta: 0, stockMinimo: 0 });
      onClose();
      await load();
    } catch {}
  };

  const remove = async (id: string) => {
    try { await inventariosApi.productos.remove(id); await load(); } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card>
        ) : items.length === 0 ? (
          <Card><p className="font-body text-sm text-on-surface-variant">No hay productos registrados</p></Card>
        ) : (
          items.map((p) => (
            <Card key={p.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-body font-medium text-on-surface">{p.nombre}</h3>
                <p className="font-label text-xs text-on-surface-variant">
                  {p.codigo} · Precio: ${Number(p.precioVenta).toFixed(2)} · Stock mín: {Number(p.stockMinimo)}
                </p>
                {p.stocks && p.stocks.length > 0 && (
                  <p className="font-label text-xs text-success">Stock total: {p.stocks.reduce((a, s) => a + Number(s.cantidad), 0)}</p>
                )}
              </div>
              <button onClick={() => remove(p.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Card className="lg:col-span-1">
          <div className="space-y-4">
            <h2 className="font-headline text-lg font-semibold">Nuevo Producto</h2>
            <Input label="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Precio venta" type="number" value={form.precioVenta} onChange={(e) => setForm({ ...form, precioVenta: Number(e.target.value) })} />
            <Input label="Stock mínimo" type="number" value={form.stockMinimo} onChange={(e) => setForm({ ...form, stockMinimo: Number(e.target.value) })} />
            <Button className="w-full" onClick={create}>Guardar</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function AlmacenesSection({ showForm, onClose }: { showForm: boolean; onClose: () => void }) {
  const [items, setItems] = useState<Almacen[]>([]);
  const [form, setForm] = useState({ nombre: '', ubicacion: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await inventariosApi.almacenes.list();
      setItems(res.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await inventariosApi.almacenes.create(form);
      setForm({ nombre: '', ubicacion: '' });
      onClose();
      await load();
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card>
        ) : items.length === 0 ? (
          <Card><p className="font-body text-sm text-on-surface-variant">No hay almacenes registrados</p></Card>
        ) : (
          items.map((a) => (
            <Card key={a.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-body font-medium text-on-surface">{a.nombre}</h3>
                <p className="font-label text-xs text-on-surface-variant">{a.ubicacion || 'Sin ubicación'} · {a._count?.stocks ?? 0} items</p>
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Card className="lg:col-span-1">
          <div className="space-y-4">
            <h2 className="font-headline text-lg font-semibold">Nuevo Almacén</h2>
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Ubicación" value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })} />
            <Button className="w-full" onClick={create}>Guardar</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function MovimientosSection({ showForm, onClose }: { showForm: boolean; onClose: () => void }) {
  const [items, setItems] = useState<Movimiento[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ idAlmacen: '', idProducto: '', idMateriaPrima: '', tipo: 'ENTRADA' as Movimiento['tipo'], cantidad: 0, referencia: '' });
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);

  const load = async () => {
    try {
      const [movRes, almRes] = await Promise.all([
        inventariosApi.movimientos.list(page),
        inventariosApi.almacenes.list(),
      ]);
      setItems(movRes.data.data);
      setTotal(movRes.data.total);
      setAlmacenes(almRes.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const create = async () => {
    try {
      await inventariosApi.movimientos.create(form);
      setForm({ idAlmacen: '', idProducto: '', idMateriaPrima: '', tipo: 'ENTRADA', cantidad: 0, referencia: '' });
      onClose();
      await load();
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {loading ? (
          <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card>
        ) : items.length === 0 ? (
          <Card><p className="font-body text-sm text-on-surface-variant">No hay movimientos registrados</p></Card>
        ) : (
          <>
            {items.map((m) => (
              <Card key={m.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-0.5 rounded-full font-label text-[10px] uppercase font-bold ${
                      m.tipo === 'ENTRADA' ? 'bg-success/10 text-success' :
                      m.tipo === 'SALIDA' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                    }`}>{m.tipo}</span>
                    <span className="font-body font-medium text-on-surface">{m.producto?.nombre || m.materiaPrima?.nombre || '-'}</span>
                  </div>
                  <p className="font-label text-xs text-on-surface-variant">
                    Cant: {m.cantidad} · {m.almacen?.nombre} · {new Date(m.fecha).toLocaleDateString()} {m.referencia && `· Ref: ${m.referencia}`}
                  </p>
                </div>
              </Card>
            ))}
            <div className="flex items-center justify-between">
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
              <span className="font-label text-xs text-on-surface-variant">Pág {page} · {total} total</span>
              <Button variant="ghost" disabled={items.length < 50} onClick={() => setPage(page + 1)}>Siguiente</Button>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <Card className="lg:col-span-1">
          <div className="space-y-4">
            <h2 className="font-headline text-lg font-semibold">Nuevo Movimiento</h2>
            <div>
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1 block">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value as Movimiento['tipo'] })}
                className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-on-surface font-body text-sm"
              >
                <option value="ENTRADA">Entrada</option>
                <option value="SALIDA">Salida</option>
                <option value="AJUSTE">Ajuste</option>
              </select>
            </div>
            <div>
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1 block">Almacén</label>
              <select
                value={form.idAlmacen}
                onChange={(e) => setForm({ ...form, idAlmacen: e.target.value })}
                className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-on-surface font-body text-sm"
              >
                <option value="">Seleccionar...</option>
                {almacenes.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <Input label="ID Producto (opcional)" value={form.idProducto} onChange={(e) => setForm({ ...form, idProducto: e.target.value })} />
            <Input label="ID Materia Prima (opcional)" value={form.idMateriaPrima} onChange={(e) => setForm({ ...form, idMateriaPrima: e.target.value })} />
            <Input label="Cantidad" type="number" value={form.cantidad} onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })} />
            <Input label="Referencia" value={form.referencia} onChange={(e) => setForm({ ...form, referencia: e.target.value })} />
            <Button className="w-full" onClick={create}>Registrar</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
