'use client';

import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';

export default function BillsPage() {
  const bills = [
    { id: '1', name: 'Aluguel', value: 1500, dueDate: '2024-03-25', status: 'pending' },
    { id: '2', name: 'Internet', value: 99.90, dueDate: '2024-03-22', status: 'pending' },
    { id: '3', name: 'Netflix', value: 24.90, dueDate: '2024-03-20', status: 'paid' },
  ];

  return (
    <div>
      <PageHeader
        title="Contas a Pagar"
        description="Gerencie seus compromissos"
        action={{ label: '+ Adicionar', onClick: () => {} }}
      />
      <div className="space-y-3">
        {bills.map((bill) => (
          <div key={bill.id} className="p-4 bg-bg-elevated border border-border-subtle rounded-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-text-primary">{bill.name}</p>
                <p className="text-xs text-text-tertiary">{bill.dueDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <MoneyDisplay value={bill.value} size="md" />
                <StatusBadge status={bill.status} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
