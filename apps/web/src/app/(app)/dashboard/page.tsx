'use client';

import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { useAccounts } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { useBills } from '@/hooks/useBills';
import { useGoals } from '@/hooks/useGoals';

export default function DashboardPage() {
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { bills, isLoading: billsLoading } = useBills();
  const { goals, isLoading: goalsLoading } = useGoals();

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [accounts]);

  const upcomingBills = useMemo(() => {
    if (!bills || bills.length === 0) return [];
    const today = new Date();
    return bills
      .filter((bill) => bill.status === 'pending')
      .map((bill) => {
        const dueDate = new Date(bill.dueDate);
        const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          name: bill.name,
          value: bill.amount,
          daysUntil,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);
  }, [bills]);

  const displayedGoals = useMemo(() => {
    return goals.slice(0, 3).map((goal) => {
      const percent = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;
      return {
        name: goal.name,
        current: goal.currentAmount,
        target: goal.targetAmount,
        percent,
      };
    });
  }, [goals]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  const isLoading = accountsLoading || transactionsLoading || billsLoading || goalsLoading;

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral das suas finanças" />

      {/* Total Balance Card */}
      <div className="mb-8 bg-card-brand border border-border-brand rounded-card p-8 shadow-lg">
        <p className="text-sm text-text-tertiary uppercase tracking-widest mb-2">Patrimônio Total</p>
        {accountsLoading ? (
          <SkeletonCard />
        ) : (
          <>
            <MoneyDisplay value={totalBalance} size="hero" className="block mb-4" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-sm text-text-tertiary">Saldo consolidado de {accounts.length} conta(s)</span>
            </div>
          </>
        )}
      </div>

      {/* Envelopes Grid - Placeholder */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-primary mb-4">Resumo Financeiro</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : accounts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-text-secondary">Nenhuma conta criada ainda</div>
          ) : (
            accounts.slice(0, 4).map((account) => (
              <div key={account.id} className="bg-bg-elevated border border-border-subtle rounded-card p-4">
                <p className="text-sm text-text-secondary mb-3">{account.name}</p>
                <MoneyDisplay value={account.balance} size="md" />
                <p className="text-xs text-text-tertiary mt-2">{account.type}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Upcoming Bills */}
        <div className="lg:col-span-1 bg-bg-elevated border border-border-subtle rounded-card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Próximas Contas
          </h3>
          {billsLoading ? (
            <SkeletonCard />
          ) : upcomingBills.length > 0 ? (
            <div className="space-y-3">
              {upcomingBills.map((bill) => (
                <div key={bill.name} className="flex items-center justify-between pb-3 border-b border-border-subtle last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{bill.name}</p>
                    <p
                      className={`text-xs ${
                        bill.daysUntil <= 2 ? 'text-danger' : 'text-text-tertiary'
                      }`}
                    >
                      {bill.daysUntil} dia{bill.daysUntil > 1 ? 's' : ''}
                    </p>
                  </div>
                  <MoneyDisplay value={bill.value} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Nenhuma conta próxima</p>
          )}
        </div>

        {/* Goals */}
        <div className="lg:col-span-1 bg-bg-elevated border border-border-subtle rounded-card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Metas
          </h3>
          {goalsLoading ? (
            <SkeletonCard />
          ) : displayedGoals.length > 0 ? (
            <div className="space-y-4">
              {displayedGoals.map((goal) => (
                <div key={goal.name}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-text-primary">{goal.name}</p>
                    <span className="text-xs text-text-tertiary">{goal.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all"
                      style={{ width: `${goal.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-text-tertiary mt-1">
                    <MoneyDisplay value={goal.current} /> de <MoneyDisplay value={goal.target} />
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Nenhuma meta criada</p>
          )}
        </div>

        {/* Na_th Card */}
        <div className="lg:col-span-1 bg-bg-elevated border border-border-subtle rounded-card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4">Na_th</h3>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center mx-auto mb-4 text-3xl">
              🤖
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Copilota financeira. Ajudando você a tomar melhores decisões.
            </p>
            <button className="w-full py-2 px-4 rounded-btn bg-brand-500 text-black font-medium text-sm hover:bg-brand-400 transition-all">
              Conversar
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-bg-elevated border border-border-subtle rounded-card p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Transações Recentes
        </h3>
        {transactionsLoading ? (
          <SkeletonCard />
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle hover:bg-bg-overlay transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-sm">
                    {tx.type === 'income' ? '↓' : '↑'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
                    <p className="text-xs text-text-tertiary">{tx.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <div className="text-right">
                    <MoneyDisplay value={tx.amount} colored size="sm" />
                    <p className="text-xs text-text-tertiary">{new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <StatusBadge status={tx.status as any} size="sm" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Nenhuma transação registrada</p>
        )}
      </div>
    </div>
  );
}
