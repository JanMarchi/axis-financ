'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';

export default function TransactionsPage() {
  const transactions = [
    {
      id: '1',
      date: '2024-03-20',
      description: 'Mercado X',
      category: 'Alimentação',
      account: 'Conta Corrente',
      value: -145.30,
      status: 'paid',
    },
    {
      id: '2',
      date: '2024-03-20',
      description: 'Salário Mensal',
      category: 'Salário',
      account: 'Conta Corrente',
      value: 5000,
      status: 'paid',
    },
    {
      id: '3',
      date: '2024-03-19',
      description: 'Uber',
      category: 'Transporte',
      account: 'Cartão Crédito',
      value: -42.50,
      status: 'paid',
    },
    {
      id: '4',
      date: '2024-03-19',
      description: 'Restaurante Premium',
      category: 'Restaurante',
      account: 'Cartão Crédito',
      value: -98.00,
      status: 'pending',
    },
  ];

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
        />
        <input
          type="date"
          className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm"
          placeholder="Data final"
        />
        <select className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm">
          <option>Todas as contas</option>
          <option>Conta Corrente</option>
          <option>Cartão Crédito</option>
        </select>
        <select className="px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary text-sm">
          <option>Todas as categorias</option>
          <option>Alimentação</option>
          <option>Transporte</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-bg-elevated border border-border-subtle rounded-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-bg-muted">
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Data</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Conta</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-text-secondary">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border-subtle hover:bg-bg-overlay transition-colors">
                <td className="px-6 py-4 text-sm text-text-secondary">{tx.date}</td>
                <td className="px-6 py-4 text-sm font-medium text-text-primary">{tx.description}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{tx.category}</td>
                <td className="px-6 py-4 text-sm text-text-secondary">{tx.account}</td>
                <td className="px-6 py-4 text-right text-sm font-mono">
                  <MoneyDisplay value={tx.value} colored size="sm" />
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge status={tx.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAB Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-brand-500 text-black shadow-lg hover:bg-brand-400 transition-all flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
