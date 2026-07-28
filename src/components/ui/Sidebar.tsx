'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Factory,
  ShoppingCart,
  ShoppingBag,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  roles: string[];
  readonly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMINISTRADOR', 'GERENTE', 'JEFE_PRODUCCION', 'RESPONSABLE_INVENTARIOS', 'RESPONSABLE_COMPRAS', 'RESPONSABLE_VENTAS', 'CONTADOR', 'RESPONSABLE_RRHH'] },
  { href: '/inventarios', label: 'Inventarios', icon: Package, roles: ['ADMINISTRADOR', 'RESPONSABLE_INVENTARIOS', 'JEFE_PRODUCCION', 'RESPONSABLE_COMPRAS', 'RESPONSABLE_VENTAS', 'GERENTE'] },
  { href: '/produccion', label: 'Producción', icon: Factory, roles: ['ADMINISTRADOR', 'JEFE_PRODUCCION', 'GERENTE'] },
  { href: '/compras', label: 'Compras', icon: ShoppingCart, roles: ['ADMINISTRADOR', 'RESPONSABLE_COMPRAS', 'GERENTE'] },
  { href: '/ventas', label: 'Ventas', icon: ShoppingBag, roles: ['ADMINISTRADOR', 'RESPONSABLE_VENTAS', 'GERENTE'] },
  { href: '/contabilidad', label: 'Contabilidad', icon: FileText, roles: ['ADMINISTRADOR', 'CONTADOR', 'GERENTE'] },
  { href: '/rrhh', label: 'RRHH', icon: Users, roles: ['ADMINISTRADOR', 'RESPONSABLE_RRHH'] },
  { href: '/reportes', label: 'Reportes', icon: BarChart3, roles: ['ADMINISTRADOR', 'GERENTE', 'CONTADOR'] },
];

const roleLabels: Record<string, string> = {
  ADMINISTRADOR: 'Administrador',
  JEFE_PRODUCCION: 'Jefe de Producción',
  RESPONSABLE_INVENTARIOS: 'Resp. Inventarios',
  RESPONSABLE_COMPRAS: 'Resp. Compras',
  RESPONSABLE_VENTAS: 'Resp. Ventas',
  CONTADOR: 'Contador',
  RESPONSABLE_RRHH: 'Resp. RRHH',
  GERENTE: 'Gerente',
};

const roleColors: Record<string, string> = {
  ADMINISTRADOR: 'bg-primary/10 text-primary',
  JEFE_PRODUCCION: 'bg-tertiary/10 text-tertiary',
  RESPONSABLE_INVENTARIOS: 'bg-info/10 text-info',
  RESPONSABLE_COMPRAS: 'bg-secondary/10 text-secondary',
  RESPONSABLE_VENTAS: 'bg-success/10 text-success',
  CONTADOR: 'bg-warning/10 text-warning',
  RESPONSABLE_RRHH: 'bg-on-surface-variant/10 text-on-surface-variant',
  GERENTE: 'bg-primary-container/10 text-primary-container',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const userRoles = usuario?.roles?.map((r) => r.nombre) ?? [];
  const primaryRole = userRoles.find((r) => r !== 'ADMINISTRADOR') || userRoles[0] || 'USUARIO';

  const visibleItems = navItems.filter(
    (item) => item.roles.some((r) => userRoles.includes(r)) || userRoles.includes('ADMINISTRADOR'),
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline text-lg font-semibold text-primary">Nexu Fabrik</h1>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">ERP · {usuario?.idEmpresa?.slice(0, 8) || ''}</p>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-surface-container-higher">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${
                active
                  ? 'bg-primary-container/10 text-primary font-medium shadow-soft'
                  : 'text-on-surface-variant hover:bg-surface-container-hover hover:text-on-surface'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {userRoles.includes('ADMINISTRADOR') && (
          <>
            <div className="border-t border-outline-variant/20 my-3" />
            <Link
              href="/admin"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${
                pathname === '/admin' || pathname.startsWith('/admin/')
                  ? 'bg-primary-container/10 text-primary font-medium shadow-soft'
                  : 'text-on-surface-variant hover:bg-surface-container-hover hover:text-on-surface'
              }`}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Administración</span>
            </Link>
          </>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-outline-variant/30 space-y-2">
        <div className="px-4 py-2">
          <p className="font-body text-sm text-on-surface font-medium truncate">{usuario?.nombre}</p>
          <p className="font-label text-xs text-on-surface-variant truncate">{usuario?.email}</p>
          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full font-label text-[10px] uppercase font-bold ${roleColors[primaryRole] || 'bg-surface-container text-on-surface-variant'}`}>
            {roleLabels[primaryRole] || primaryRole}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-on-surface-variant hover:text-error hover:bg-error-container/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 h-screen fixed left-0 top-0 sidebar-glass z-30">
        {sidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-surface shadow-bento z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-xl hover:bg-surface-container-higher transition-colors"
    >
      <Menu className="w-5 h-5 text-on-surface" />
    </button>
  );
}
