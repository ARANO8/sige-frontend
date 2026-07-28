'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { Card } from './Card';

interface RoleGuardProps {
  roles: string[];
  children: ReactNode;
  redirect?: boolean;
}

export function RoleGuard({ roles, children, redirect = false }: RoleGuardProps) {
  const { usuario, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) return null;

  const userRoles = usuario?.roles?.map((r) => r.nombre) ?? [];

  const hasAccess =
    roles.some((r) => userRoles.includes(r)) || userRoles.includes('ADMINISTRADOR');

  if (!hasAccess) {
    if (redirect) return null;
    return (
      <Card className="text-center py-12">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-error-container/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-error">!</span>
          </div>
          <h2 className="font-headline text-xl font-semibold text-on-surface">Acceso denegado</h2>
          <p className="font-body text-sm text-on-surface-variant max-w-md mx-auto">
            No tienes permisos para acceder a esta sección.
            Tu rol actual ({usuario?.roles?.map((r) => r.nombre).join(', ')}) no tiene los permisos necesarios.
          </p>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
}
