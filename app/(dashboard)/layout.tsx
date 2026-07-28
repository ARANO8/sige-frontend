'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar, SidebarToggle } from '@/src/components/ui/Sidebar';
import { useAuth } from '@/src/contexts/AuthContext';

const roleLabels: Record<string, string> = {
  ADMINISTRADOR: 'Administrador', JEFE_PRODUCCION: 'Jefe Producción',
  RESPONSABLE_INVENTARIOS: 'Resp. Inventarios', RESPONSABLE_COMPRAS: 'Resp. Compras',
  RESPONSABLE_VENTAS: 'Resp. Ventas', CONTADOR: 'Contador',
  RESPONSABLE_RRHH: 'Resp. RRHH', GERENTE: 'Gerente',
};
const roleColors: Record<string, string> = {
  ADMINISTRADOR: 'bg-primary/10 text-primary', JEFE_PRODUCCION: 'bg-tertiary/10 text-tertiary',
  RESPONSABLE_INVENTARIOS: 'bg-info/10 text-info', RESPONSABLE_COMPRAS: 'bg-secondary/10 text-secondary',
  RESPONSABLE_VENTAS: 'bg-success/10 text-success', CONTADOR: 'bg-warning/10 text-warning',
  RESPONSABLE_RRHH: 'bg-on-surface-variant/10 text-on-surface-variant', GERENTE: 'bg-primary-container/10 text-primary-container',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { usuario } = useAuth();

  const userRoles = usuario?.roles?.map((r) => r.nombre) ?? [];
  const primaryRole = userRoles.find((r) => r !== 'ADMINISTRADOR') || userRoles[0] || 'USUARIO';

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 glass border-b border-outline-variant/30">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <SidebarToggle onClick={() => setSidebarOpen(true)} />
              <h2 className="font-headline text-lg font-semibold text-on-surface">SIGE ERP</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full font-label text-[11px] uppercase font-bold ${roleColors[primaryRole] || ''}`}>
                {roleLabels[primaryRole] || primaryRole}
              </span>
              <span className="font-label text-xs text-on-surface-variant hidden md:inline">{usuario?.email}</span>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
