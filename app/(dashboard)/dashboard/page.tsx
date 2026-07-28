'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import { Card } from '@/src/components/ui/Card';

export default function DashboardPage() {
  const { usuario } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-semibold text-on-surface">Dashboard Gerencial</h1>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Bienvenido, {usuario?.nombre}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="space-y-2">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Inventario</p>
            <p className="font-headline text-3xl font-bold text-primary">--</p>
            <p className="font-body text-xs text-on-surface-variant">Productos en stock</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Producción</p>
            <p className="font-headline text-3xl font-bold text-tertiary">--</p>
            <p className="font-body text-xs text-on-surface-variant">Órdenes activas</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Compras</p>
            <p className="font-headline text-3xl font-bold text-secondary">--</p>
            <p className="font-body text-xs text-on-surface-variant">Órdenes pendientes</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-2">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Ventas</p>
            <p className="font-headline text-3xl font-bold text-success">--</p>
            <p className="font-body text-xs text-on-surface-variant">Ventas del mes</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
