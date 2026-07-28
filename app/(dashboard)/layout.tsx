'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar, SidebarToggle } from '@/src/components/ui/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 glass border-b border-outline-variant/30">
          <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
            <SidebarToggle onClick={() => setSidebarOpen(true)} />
            <h2 className="font-headline text-lg font-semibold text-on-surface">SIGE ERP</h2>
          </div>
        </header>

        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
