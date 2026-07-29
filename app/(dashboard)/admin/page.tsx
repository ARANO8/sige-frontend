'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { apiClient } from '@/src/lib/api-client';
import { useAuth } from '@/src/contexts/AuthContext';
import { Shield, Users, Building2, BarChart3, Trash2, Check, X } from 'lucide-react';

type Tab = 'usuarios' | 'roles' | 'empresa' | 'kpis';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('usuarios');
  const [showForm, setShowForm] = useState(false);
  const { usuario: currentUser } = useAuth();

  return (
    <RoleGuard roles={['ADMINISTRADOR']}>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-on-surface">Administración</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Gestión de usuarios, roles, KPIs y configuración del sistema</p>
        </div>

        <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit flex-wrap">
          {[
            { id: 'usuarios' as Tab, label: 'Usuarios', icon: Users },
            { id: 'roles' as Tab, label: 'Roles', icon: Shield },
            { id: 'kpis' as Tab, label: 'KPIs', icon: BarChart3 },
            { id: 'empresa' as Tab, label: 'Empresa', icon: Building2 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => { setTab(t.id); setShowForm(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label text-sm transition-all ${tab === t.id ? 'bg-white shadow-soft text-primary' : 'text-on-surface-variant'}`}>
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'usuarios' && <UsersTab showForm={showForm} onToggle={() => setShowForm(!showForm)} onClose={() => setShowForm(false)} />}
        {tab === 'roles' && <RolesTab showForm={showForm} onToggle={() => setShowForm(!showForm)} />}
        {tab === 'kpis' && <KpisTab />}
        {tab === 'empresa' && <EmpresaTab />}
      </div>
    </RoleGuard>
  );
}

function UsersTab({ showForm, onToggle, onClose }: { showForm: boolean; onToggle: () => void; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', email: '', password: '', roles: [] as string[] });

  const load = async () => {
    try { const [u, r] = await Promise.all([apiClient.usuarios.list(), apiClient.rolesAdmin.list()]); setItems(u.data); setRoles(r.data); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try { await apiClient.usuarios.create(form); onClose(); await load(); } catch (e: any) { alert('Error: ' + (e.response?.data?.message || e.message)); }
  };

  const remove = async (id: string) => { try { await apiClient.usuarios.remove(id); await load(); } catch {} };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {loading ? <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card> : items.length === 0 ? <Card><p className="font-body text-sm text-on-surface-variant">No hay usuarios</p></Card> : (
          items.map((u) => (
            <Card key={u.id}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-body font-medium text-on-surface">{u.nombre}</h3>
                  <p className="font-label text-xs text-on-surface-variant">{u.email}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {u.usuarioRoles?.map((ur: any) => (
                      <span key={ur.id || ur.rol?.id} className="inline-flex px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-label text-[10px]">{ur.rol?.nombre}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${u.estado === 'ACTIVO' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>{u.estado}</span>
                  <button onClick={() => remove(u.id)} className="p-1 text-on-surface-variant hover:text-error"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="font-headline text-lg font-semibold mb-4">Nuevo Usuario</h2>
          <div className="space-y-3">
            <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Contraseña" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div>
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 block">Roles</label>
              <div className="space-y-1.5">
                {roles.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 font-body text-sm text-on-surface cursor-pointer">
                    <input type="checkbox" checked={form.roles.includes(r.id)} onChange={(e) => {
                      if (e.target.checked) setForm({ ...form, roles: [...form.roles, r.id] });
                      else setForm({ ...form, roles: form.roles.filter((id) => id !== r.id) });
                    }} className="rounded border-outline-variant text-primary focus:ring-primary" />
                    {r.nombre}
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={create}>Crear Usuario</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function RolesTab({ showForm, onToggle }: { showForm: boolean; onToggle: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [permisos, setPermisos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nombre: '', descripcion: '', permisos: [] as string[] });

  const load = async () => {
    try { const [r, p] = await Promise.all([apiClient.rolesAdmin.list(), apiClient.permisos.list()]); setItems(r.data); setPermisos(p.data); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try { await apiClient.rolesAdmin.create(form); onToggle(); await load(); } catch (e: any) { alert('Error: ' + (e.response?.data?.message || e.message)); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {loading ? <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card> : items.length === 0 ? <Card><p className="font-body text-sm text-on-surface-variant">No hay roles</p></Card> : (
          items.map((r) => (
            <Card key={r.id}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-body font-medium text-on-surface">{r.nombre}</h3>
                  <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${r.estado === 'ACTIVO' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>{r.estado}</span>
                </div>
                {r.descripcion && <p className="font-label text-xs text-on-surface-variant">{r.descripcion}</p>}
                {r.rolPermisos && r.rolPermisos.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="font-label text-[10px] text-on-surface-variant">{r.rolPermisos.length} permisos:</span>
                    {r.rolPermisos.slice(0, 6).map((rp: any) => (
                      <span key={rp.permiso?.id || rp.id} className="inline-flex px-1.5 py-0.5 rounded bg-surface-container-higher font-label text-[10px] text-on-surface-variant">{rp.permiso?.codigo || rp.id?.slice(0, 8)}</span>
                    ))}
                    {r.rolPermisos.length > 6 && <span className="font-label text-[10px] text-on-surface-variant">+{r.rolPermisos.length - 6} más</span>}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="font-headline text-lg font-semibold mb-4">Nuevo Rol</h2>
          <div className="space-y-3">
            <Input label="Nombre del rol" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
            <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
            <div>
              <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1.5 block">Permisos ({form.permisos.length} seleccionados)</label>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {permisos.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 font-body text-sm text-on-surface cursor-pointer py-0.5">
                    <input type="checkbox" checked={form.permisos.includes(p.id)} onChange={(e) => {
                      if (e.target.checked) setForm({ ...form, permisos: [...form.permisos, p.id] });
                      else setForm({ ...form, permisos: form.permisos.filter((id) => id !== p.id) });
                    }} className="rounded border-outline-variant text-primary focus:ring-primary" />
                    <span className="font-label text-xs">{p.codigo}</span>
                    <span className="font-label text-[10px] text-on-surface-variant">— {p.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={create}>Crear Rol</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

function KpisTab() {
  const [config, setConfig] = useState<any>(null);
  const [updateKey, setUpdateKey] = useState(0);

  const load = async () => {
    try { const r = await apiClient.reportes.kpiConfig(); setConfig(r.data); } catch (e) { console.error('Error loading KPI config:', e); }
  };

  useEffect(() => { load(); }, [updateKey]);

  const saveKpis = async (newKpis: any) => {
    try {
      const r = await apiClient.reportes.updateKpiConfig({ kpisConfig: newKpis });
      setConfig(r.data);
      setUpdateKey(k => k + 1);
    } catch (e) { console.error('Error saving KPI config:', e); }
  };

  const saveCharts = async (newCharts: any) => {
    try {
      const r = await apiClient.reportes.updateKpiConfig({ chartsConfig: newCharts });
      setConfig(r.data);
      setUpdateKey(k => k + 1);
    } catch (e) { console.error('Error saving chart config:', e); }
  };

  const toggleKpi = (key: string) => {
    if (!config) return;
    const updated = JSON.parse(JSON.stringify(config.kpisConfig));
    updated[key] = { ...updated[key], enabled: !updated[key]?.enabled };
    saveKpis(updated);
  };

  const updateKpiField = (key: string, field: string, value: any) => {
    if (!config) return;
    const updated = JSON.parse(JSON.stringify(config.kpisConfig));
    updated[key] = { ...updated[key], [field]: value };
    saveKpis(updated);
  };

  const toggleChart = (key: string) => {
    if (!config) return;
    const updated = JSON.parse(JSON.stringify(config.chartsConfig));
    updated[key] = { ...updated[key], enabled: !updated[key]?.enabled };
    saveCharts(updated);
  };

  const colorOptions = ['#16a34a', '#84cc16', '#06b6d4', '#ea580c', '#6366f1', '#2563eb', '#9333ea', '#ec4899', '#eab308'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="font-headline text-lg font-semibold text-on-surface">Indicadores (KPIs)</h2>
        <p className="font-body text-sm text-on-surface-variant mb-2">Activa o desactiva cada indicador y ajusta sus objetivos</p>
        {!config ? (
          <Card><p className="font-body text-sm text-on-surface-variant">Cargando configuración...</p></Card>
        ) : (
          Object.entries(config.kpisConfig || {}).map(([key, kpi]: [string, any]) => (
            <Card key={key}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleKpi(key)}
                      className={`w-10 h-6 rounded-full transition-colors ${kpi.enabled ? 'bg-primary' : 'bg-outline-variant'} relative`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-soft ${kpi.enabled ? 'left-5' : 'left-1'}`} />
                    </button>
                    <div>
                      <h3 className="font-body font-medium text-sm text-on-surface">{kpi.label || key}</h3>
                      <p className="font-label text-[10px] text-on-surface-variant uppercase">{kpi.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${kpi.enabled ? 'bg-success/10 text-success' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {kpi.enabled ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {kpi.enabled && (
                  <div className="grid grid-cols-3 gap-3 pl-[3.25rem]">
                    <div>
                      <label className="font-label text-[10px] text-on-surface-variant uppercase">Objetivo $</label>
                      <input type="number" value={kpi.target ?? ''}
                        onChange={(e) => updateKpiField(key, 'target', Number(e.target.value))}
                        className="neo-input w-full rounded-lg px-3 py-1.5 text-sm bg-surface-container-lowest mt-0.5" />
                    </div>
                    <div>
                      <label className="font-label text-[10px] text-on-surface-variant uppercase">Alerta</label>
                      <input type="number" value={kpi.warningAt ?? ''}
                        onChange={(e) => updateKpiField(key, 'warningAt', Number(e.target.value))}
                        className="neo-input w-full rounded-lg px-3 py-1.5 text-sm bg-surface-container-lowest mt-0.5" />
                    </div>
                    <div>
                      <label className="font-label text-[10px] text-on-surface-variant uppercase">Color</label>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {colorOptions.map((c) => (
                          <button key={c} onClick={() => updateKpiField(key, 'color', c)}
                            className={`w-5 h-5 rounded-full border-2 ${kpi.color === c ? 'border-on-surface scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }} title={c} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-headline text-lg font-semibold text-on-surface">Gráficas del Dashboard</h2>
        <p className="font-body text-sm text-on-surface-variant mb-2">Muestra u oculta cada gráfica en el dashboard y reportes</p>
        {!config ? (
          <Card><p className="font-body text-sm text-on-surface-variant">Cargando...</p></Card>
        ) : (
          Object.entries(config.chartsConfig || {}).map(([key, chart]: [string, any]) => (
            <Card key={key}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleChart(key)}
                    className={`w-10 h-6 rounded-full transition-colors ${chart.enabled ? 'bg-primary' : 'bg-outline-variant'} relative`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-soft ${chart.enabled ? 'left-5' : 'left-1'}`} />
                  </button>
                  <div>
                    <h3 className="font-body font-medium text-sm text-on-surface">{chart.title || key}</h3>
                    <p className="font-label text-[10px] text-on-surface-variant">Tipo: {chart.type} | {chart.enabled ? 'Visible en dashboard' : 'Oculto'}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-label text-[10px] ${chart.enabled ? 'bg-success/10 text-success' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  {chart.enabled ? 'Visible' : 'Oculto'}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function EmpresaTab() {
  const [empresa, setEmpresa] = useState<any>(null);

  useEffect(() => {
    apiClient.empresaAdmin.get().then((res) => {
      if (res.data?.length > 0) setEmpresa(res.data[0]);
    }).catch(() => {});
  }, []);

  if (!empresa) return <Card><p className="font-body text-sm text-on-surface-variant">Cargando información de la empresa...</p></Card>;

  return (
    <Card>
      <div className="max-w-lg space-y-4">
        <h2 className="font-headline text-lg font-semibold">{empresa.razonSocial}</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'NIT', value: empresa.nit },
            { label: 'Dirección', value: empresa.direccion || '—' },
            { label: 'Teléfono', value: empresa.telefono || '—' },
            { label: 'Email', value: empresa.email || '—' },
            { label: 'Estado', value: empresa.estado },
            { label: 'Creado', value: new Date(empresa.createdAt).toLocaleDateString() },
          ].map((f) => (
            <div key={f.label}>
              <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">{f.label}</p>
              <p className="font-body text-sm text-on-surface mt-0.5">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
