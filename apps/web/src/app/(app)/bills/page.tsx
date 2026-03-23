'use client';

import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useBills } from '@/hooks/useBills';

export default function BillsPage() {
  const { bills, isLoading } = useBills();

  return (
    <div>
      <PageHeader
        title="Contas a Pagar"
        description="Gerencie seus compromissos"
        action={{ label: '+ Adicionar', onClick: () => {} }}
      />
      <div className="space-y-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : bills.length > 0 ? (
          bills.map((bill) => (
            <div key={bill.id} className="p-4 bg-bg-elevated border border-border-subtle rounded-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{bill.name}</p>
                  <p className="text-xs text-text-tertiary">{new Date(bill.dueDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <MoneyDisplay value={bill.amount} size="md" />
                  <StatusBadge status={bill.status as any} size="sm" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">Nenhuma conta registrada</p>
        )}
      </div>
    </div>
  );
}
