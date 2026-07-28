'use client';

import { useState, useEffect } from 'react';
import { RoleGuard } from '@/src/components/ui/RoleGuard';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { apiClient } from '@/src/lib/api-client';
import { useAuth } from '@/src/contexts/AuthContext';
import { Shield, UserPlus, Users, Building2, Trash2 } from 'lucide-react';

type Tab = 'usuarios' | 'roles' | 'empresa';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('usuarios');
  const [showForm, setShowForm] = useState(false);
  const { usuario: currentUser } = useAuth();

  return (
    <RoleGuard roles={['ADMINISTRADOR']}>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-on-surface">Administración</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Gestión de usuarios, roles y configuración del sistema</p>
        </div>

        <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
          {[
            { id: 'usuarios' as Tab, label: 'Usuarios', icon: Users },
            { id: 'roles' as Tab, label: 'Roles', icon: Shield },
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
