'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useTransactions } from '@/hooks/useTransactions';
import { CreateTransactionForm } from '@/components/forms/CreateTransactionForm';

export default function TransactionsPage() {
  const [filters, setFilters] = useState({});
  const { transactions, isLoading, refetch } = useTransactions(filters);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <PageHeader
        title="Transações"
        description="Controle todas as suas transações"
        action={{
          label: '+ Adicionar',
          onClick: () => {},
        }}
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm"
          placeholder="Data inicial"
          onChange={(e) => handleFilterChange({ ...filters, startDate: e.target.value })}
        />
        <input
          type="date"
          className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm"
          placeholder="Data final"
          onChange={(e) => handleFilterChange({ ...filters, endDate: e.target.value })}
        />
        <select
          className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm"
          onChange={(e) => handleFilterChange({ ...filters, accountId: e.target.value || undefined })}
        >
          <option value="">Todas as contas</option>
        </select>
        <select
          className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm"
          onChange={(e) => handleFilterChange({ ...filters, categoryId: e.target.value || undefined })}
        >
          <option value="">Todas as categorias</option>
        </select>
      </div>

      <div className="mb-6 flex justify-end">
        <CreateTransactionForm onSuccess={refetch} />
      </div>

      {/* Table */}
      <div className="bg-bg-elevated border border-border-subtle rounded-card overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <SkeletonCard />
          </div>
        ) : transactions.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-muted">
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Tipo</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border-subtle hover:bg-bg-overlay transition-colors">
                  <td className="px-6 py-4 text-sm text-text-secondary">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">{tx.description}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{tx.type}</td>
                  <td className="px-6 py-4 text-right text-sm font-mono">
                    <MoneyDisplay value={tx.amount} colored size="sm" />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={tx.status as any} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-text-secondary">Nenhuma transação encontrada</div>
        )}
      </div>

      {/* FAB Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-brand-500 text-black shadow-lg hover:bg-brand-400 transition-all flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
