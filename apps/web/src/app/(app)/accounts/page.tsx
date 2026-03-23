'use client';

import React from 'react';
import { Plus, Wallet, CreditCard } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useAccounts } from '@/hooks/useAccounts';
import { CreateAccountForm } from '@/components/forms/CreateAccountForm';

export default function AccountsPage() {
  const { accounts, isLoading, refetch } = useAccounts();

  return (
    <div>
      <PageHeader
        title="Minhas Contas"
        description="Gerencies suas contas bancárias e cartões"
        action={{
          label: '+ Adicionar Conta',
          onClick: () => {},
        }}
      />

      <div className="mb-6 flex justify-end">
        <CreateAccountForm onSuccess={refetch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : accounts.length > 0 ? (
          accounts.map((account) => (
            <div key={account.id} className="bg-bg-elevated border border-border-subtle rounded-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-text-tertiary mb-1">{account.type === 'credit_card' ? 'Cartão de Crédito' : 'Conta Bancária'}</p>
                  <h3 className="text-lg font-semibold text-text-primary">{account.name}</h3>
                </div>
                {account.type === 'credit_card' ? (
                  <CreditCard className="w-6 h-6 text-text-secondary" />
                ) : (
                  <Wallet className="w-6 h-6 text-text-secondary" />
                )}
              </div>

              <div className="mb-4 pb-4 border-b border-border-subtle">
                <p className="text-xs text-text-tertiary mb-1">Saldo</p>
                <MoneyDisplay value={account.balance} size="lg" className="block" />
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge status="active" label="Ativo" size="sm" />
                <button className="text-brand-500 text-sm font-medium hover:text-brand-400 transition-colors">
                  Editar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full mt-8 p-8 bg-bg-elevated border border-border-subtle rounded-card text-center">
            <Plus className="w-8 h-8 mx-auto mb-4 text-text-tertiary" />
            <p className="text-text-secondary mb-4">Nenhuma conta criada ainda</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-8 bg-bg-elevated border border-border-subtle rounded-card text-center">
        <Plus className="w-8 h-8 mx-auto mb-4 text-text-tertiary" />
        <p className="text-text-secondary mb-4">Conecte seu banco para sincronizar transações automaticamente</p>
        <button className="px-6 py-2 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all">
          Conectar Banco
        </button>
      </div>
    </div>
  );
}
