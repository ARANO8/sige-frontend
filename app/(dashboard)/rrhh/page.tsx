'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { apiClient } from '@/src/lib/api-client';
import { Users, Clock, Briefcase } from 'lucide-react';

type Tab = 'empleados' | 'turnos' | 'horas';

export default function RRHHPage() {
  const [tab, setTab] = useState<Tab>('empleados');
  const [showForm, setShowForm] = useState(false);
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [turnos, setTurnos] = useState<any[]>([]);
  const [registros, setRegistros] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);

  const [empForm, setEmpForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', idCargo: '' });
  const [turnoForm, setTurnoForm] = useState({ nombre: '', horaInicio: '', horaFin: '' });
  const [horaForm, setHoraForm] = useState({ idEmpleado: '', idTurno: '', fecha: '', horaEntrada: '', horaSalida: '' });

  const load = async () => {
    try {
      const [eRes, tRes, rRes, cRes] = await Promise.all([
        apiClient.empleado.list(),
        apiClient.turno.list(),
        apiClient.registroHoras.list(),
        apiClient.cargo.list(),
      ]);
      setEmpleados(eRes.data);
      setTurnos(tRes.data);
      setRegistros(rRes.data);
      setCargos(cRes.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const crearEmpleado = async () => {
    try { await apiClient.empleado.create(empForm); setShowForm(false); await load(); } catch {}
  };
  const crearTurno = async () => {
    try { await apiClient.turno.create(turnoForm); setShowForm(false); await load(); } catch {}
  };
  const crearRegistro = async () => {
    try { await apiClient.registroHoras.create(horaForm); setShowForm(false); await load(); } catch {}
  };

  const tabs = [
    { id: 'empleados' as Tab, label: 'Empleados', icon: Users },
    { id: 'turnos' as Tab, label: 'Turnos', icon: Briefcase },
    { id: 'horas' as Tab, label: 'Registro Horas', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-semibold text-on-surface">Recursos Humanos</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Gestión del personal y registro de horas</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {tab === 'empleados' ? 'Nuevo Empleado' : tab === 'turnos' ? 'Nuevo Turno' : 'Registrar Horas'}
        </Button>
      </div>

      <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setShowForm(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-label text-sm transition-all ${
                tab === t.id ? 'bg-white shadow-soft text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'empleados' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {empleados.length === 0 ? (
              <Card><p className="font-body text-sm text-on-surface-variant">No hay empleados registrados</p></Card>
            ) : (
              empleados.map((e) => (
                <Card key={e.id}>
                  <div className="space-y-1">
                    <h3 className="font-body font-medium">{e.nombre} {e.apellido}</h3>
                    <p className="font-label text-xs text-on-surface-variant">{e.email || 'Sin email'} · {e.telefono || ''}</p>
                    {e.cargo && <span className="inline-block px-2 py-0.5 rounded-full bg-primary-container/10 text-primary font-label text-xs">{e.cargo.nombre}</span>}
                  </div>
                </Card>
              ))
            )}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nuevo Empleado</h2>
              <div className="space-y-3">
                <Input label="Nombre" value={empForm.nombre} onChange={(e) => setEmpForm({ ...empForm, nombre: e.target.value })} />
                <Input label="Apellido" value={empForm.apellido} onChange={(e) => setEmpForm({ ...empForm, apellido: e.target.value })} />
                <Input label="Email" type="email" value={empForm.email} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} />
                <Input label="Teléfono" value={empForm.telefono} onChange={(e) => setEmpForm({ ...empForm, telefono: e.target.value })} />
                <div>
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1 block">Cargo</label>
                  <select value={empForm.idCargo} onChange={(e) => setEmpForm({ ...empForm, idCargo: e.target.value })}
                    className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-sm">
                    <option value="">Sin cargo</option>
                    {cargos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <Button className="w-full" onClick={crearEmpleado}>Guardar</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'turnos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {turnos.length === 0 ? (
              <Card><p className="font-body text-sm text-on-surface-variant">No hay turnos registrados</p></Card>
            ) : (
              turnos.map((t) => (
                <Card key={t.id}>
                  <div className="space-y-1">
                    <h3 className="font-body font-medium">{t.nombre}</h3>
                    <p className="font-label text-xs text-on-surface-variant">{t.horaInicio} → {t.horaFin}</p>
                  </div>
                </Card>
              ))
            )}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Nuevo Turno</h2>
              <div className="space-y-3">
                <Input label="Nombre" value={turnoForm.nombre} onChange={(e) => setTurnoForm({ ...turnoForm, nombre: e.target.value })} />
                <Input label="Hora inicio (HH:mm)" value={turnoForm.horaInicio} onChange={(e) => setTurnoForm({ ...turnoForm, horaInicio: e.target.value })} />
                <Input label="Hora fin (HH:mm)" value={turnoForm.horaFin} onChange={(e) => setTurnoForm({ ...turnoForm, horaFin: e.target.value })} />
                <Button className="w-full" onClick={crearTurno}>Guardar</Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'horas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {registros.length === 0 ? (
              <Card><p className="font-body text-sm text-on-surface-variant">No hay registros de horas</p></Card>
            ) : (
              registros.map((r) => (
                <Card key={r.id}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-body font-medium">{r.empleado?.nombre} {r.empleado?.apellido}</h3>
                      <span className="font-label text-xs text-on-surface-variant">· {r.turno?.nombre}</span>
                    </div>
                    <p className="font-label text-xs text-on-surface-variant">
                      {new Date(r.fecha).toLocaleDateString()} · {new Date(r.horaEntrada).toLocaleTimeString()} → {r.horaSalida ? new Date(r.horaSalida).toLocaleTimeString() : '—'}
                      {r.horasTrabajadas ? ` · ${r.horasTrabajadas}h` : ''}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </div>

          {showForm && (
            <Card>
              <h2 className="font-headline text-lg font-semibold mb-4">Registrar Horas</h2>
              <div className="space-y-3">
                <div>
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1 block">Empleado</label>
                  <select value={horaForm.idEmpleado} onChange={(e) => setHoraForm({ ...horaForm, idEmpleado: e.target.value })}
                    className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-sm">
                    <option value="">Seleccionar...</option>
                    {empleados.map((e) => <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-label text-xs text-on-surface-variant uppercase tracking-wider mb-1 block">Turno</label>
                  <select value={horaForm.idTurno} onChange={(e) => setHoraForm({ ...horaForm, idTurno: e.target.value })}
                    className="neo-input w-full rounded-xl px-4 py-2.5 bg-surface-container-lowest text-sm">
                    <option value="">Seleccionar...</option>
                    {turnos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                  </select>
                </div>
                <Input label="Fecha" type="date" value={horaForm.fecha} onChange={(e) => setHoraForm({ ...horaForm, fecha: e.target.value })} />
                <Input label="Hora entrada" type="datetime-local" value={horaForm.horaEntrada} onChange={(e) => setHoraForm({ ...horaForm, horaEntrada: e.target.value })} />
                <Input label="Hora salida" type="datetime-local" value={horaForm.horaSalida} onChange={(e) => setHoraForm({ ...horaForm, horaSalida: e.target.value })} />
                <Button className="w-full" onClick={crearRegistro}>Registrar</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
