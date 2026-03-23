'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user data - será substituído por auth real na Fase 2
  const mockUser = {
    name: 'João Silva',
    email: 'joao@example.com',
    plan: 'free' as const,
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <Sidebar user={mockUser} />

      <div className="md:ml-60 flex flex-col min-h-screen">
        <Header user={mockUser} />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
