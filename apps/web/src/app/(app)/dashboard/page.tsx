'use client';

import React from 'react';
import { BarChart3, TrendingUp, Target, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';
import { StatusBadge } from '@/components/ui/status-badge';
import { SkeletonCard } from '@/components/ui/skeleton-card';

export default function DashboardPage() {
  // Mock data - será substituído com dados reais da API
  const totalBalance = 15430.50;
  const monthlyChange = 2150.75;
  const monthlyChangePercent = 16.2;

  const envelopes = [
    { name: 'Essencial', value: 2500, budget: 3000, percent: 83 },
    { name: 'Não Essencial', value: 800, budget: 1200, percent: 67 },
    { name: 'Crescimento', value: 500, budget: 600, percent: 83 },
    { name: 'Investimento', value: 1200, budget: 1500, percent: 80 },
  ];

  const upcomingBills = [
    { name: 'Aluguel', value: 1500, daysUntil: 5 },
    { name: 'Internet', value: 99.90, daysUntil: 1 },
    { name: 'Seguro Carro', value: 350, daysUntil: 12 },
    { name: 'Netflix', value: 24.90, daysUntil: 3 },
    { name: 'Academia', value: 120, daysUntil: 8 },
  ];

  const goals = [
    { name: 'Fundo de Emergência', current: 4500, target: 10000, percent: 45 },
    { name: 'Viagem Europa', current: 2000, target: 8000, percent: 25 },
    { name: 'Novo Notebook', current: 1200, target: 3500, percent: 34 },
  ];

  const recentTransactions = [
    {
      id: '1',
      category: 'Alimentação',
      icon: '🍔',
      description: 'Mercado X',
      date: '2024-03-20',
      value: -145.30,
      status: 'paid',
    },
    {
      id: '2',
      category: 'Salário',
      icon: '💵',
      description: 'Salário Mensal',
      date: '2024-03-20',
      value: 5000,
      status: 'paid',
    },
    {
      id: '3',
      category: 'Transporte',
      icon: '🚗',
      description: 'Uber',
      date: '2024-03-19',
      value: -42.50,
      status: 'paid',
    },
    {
      id: '4',
      category: 'Restaurante',
      icon: '🍽️',
      description: 'Restaurante Premium',
      date: '2024-03-19',
      value: -98.00,
      status: 'pending',
    },
    {
      id: '5',
      category: 'Investimento',
      icon: '📈',
      description: 'Tesouro Direto',
      date: '2024-03-18',
      value: 1000,
      status: 'paid',
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Visão geral das suas finanças" />

      {/* Total Balance Card */}
      <div className="mb-8 bg-card-brand border border-border-brand rounded-card p-8 shadow-lg">
        <p className="text-sm text-text-tertiary uppercase tracking-widest mb-2">Patrimônio Total</p>
        <MoneyDisplay value={totalBalance} size="hero" className="block mb-4" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <MoneyDisplay value={monthlyChange} colored size="sm" />
          </div>
          <span className="text-sm text-emerald-500">+{monthlyChangePercent.toFixed(1)}% este mês</span>
        </div>
      </div>

      {/* Envelopes Grid */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-text-primary mb-4">Envelopes do Mês</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {envelopes.map((envelope) => (
            <div
              key={envelope.name}
              className="bg-bg-elevated border border-border-subtle rounded-card p-4"
            >
              <p className="text-sm text-text-secondary mb-3">{envelope.name}</p>
              <div className="flex items-baseline justify-between mb-3">
                <MoneyDisplay value={envelope.value} size="md" />
                <span className="text-xs text-text-tertiary">{envelope.percent}%</span>
              </div>
              <div className="w-full h-2 bg-bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${envelope.percent}%` }}
                />
              </div>
              <p className="text-xs text-text-tertiary mt-2">
                de <MoneyDisplay value={envelope.budget} />
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Upcoming Bills */}
        <div className="lg:col-span-1 bg-bg-elevated border border-border-subtle rounded-card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Próximas Contas
          </h3>
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
        </div>

        {/* Goals */}
        <div className="lg:col-span-1 bg-bg-elevated border border-border-subtle rounded-card p-6">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Metas
          </h3>
          <div className="space-y-4">
            {goals.map((goal) => (
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
        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg bg-bg-subtle hover:bg-bg-overlay transition-colors"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="text-2xl">{tx.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
                  <p className="text-xs text-text-tertiary">{tx.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <div className="text-right">
                  <MoneyDisplay value={tx.value} colored size="sm" />
                  <p className="text-xs text-text-tertiary">{tx.date}</p>
                </div>
                <StatusBadge status={tx.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
