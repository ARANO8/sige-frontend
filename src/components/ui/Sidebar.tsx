'use client';

import { type ReactNode } from 'react';
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
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMINISTRADOR', 'GERENTE'] },
  { href: '/inventarios', label: 'Inventarios', icon: Package, roles: ['ADMINISTRADOR', 'RESPONSABLE_INVENTARIOS'] },
  { href: '/produccion', label: 'Producción', icon: Factory, roles: ['ADMINISTRADOR', 'JEFE_PRODUCCION'] },
  { href: '/compras', label: 'Compras', icon: ShoppingCart, roles: ['ADMINISTRADOR', 'RESPONSABLE_COMPRAS'] },
  { href: '/ventas', label: 'Ventas', icon: ShoppingBag, roles: ['ADMINISTRADOR', 'RESPONSABLE_VENTAS'] },
  { href: '/contabilidad', label: 'Contabilidad', icon: FileText, roles: ['ADMINISTRADOR', 'CONTADOR'] },
  { href: '/rrhh', label: 'RRHH', icon: Users, roles: ['ADMINISTRADOR'] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  const userRoles = usuario?.roles?.map((r) => r.nombre) ?? [];

  const visibleItems = navItems.filter(
    (item) => item.roles.some((r) => userRoles.includes(r)) || userRoles.includes('ADMINISTRADOR'),
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline text-lg font-semibold text-primary">Nexu Fabrik</h1>
          <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider">ERP</p>
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
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-outline-variant/30">
        <div className="px-4 py-2 mb-2">
          <p className="font-body text-sm text-on-surface font-medium truncate">{usuario?.nombre}</p>
          <p className="font-label text-xs text-on-surface-variant truncate">{usuario?.email}</p>
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
