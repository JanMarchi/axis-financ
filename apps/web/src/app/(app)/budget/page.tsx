'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';

export default function BudgetPage() {
  const envelopes = [
    {
      name: 'Essencial',
      icon: '📌',
      budget: 3000,
      spent: 2500,
      color: '#3B82F6',
      categories: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação'],
    },
    {
      name: 'Não Essencial',
      icon: '🎉',
      budget: 1200,
      spent: 800,
      color: '#F97316',
      categories: ['Restaurante', 'Diversão', 'Compras'],
    },
    {
      name: 'Crescimento',
      icon: '📈',
      budget: 600,
      spent: 500,
      color: '#10B981',
      categories: ['Cursos', 'Livros', 'Desenvolvimento'],
    },
    {
      name: 'Investimento',
      icon: '💎',
      budget: 1500,
      spent: 1200,
      color: '#8B5CF6',
      categories: ['Renda Fixa', 'Ações', 'Fundos'],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <PageHeader title="Orçamento" description="Controle seus gastos por envelope" />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-border-default hover:bg-bg-subtle">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-text-primary font-semibold min-w-[200px] text-center">Março 2024</span>
          <button className="p-2 rounded-lg border border-border-default hover:bg-bg-subtle">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {envelopes.map((envelope) => {
          const percent = Math.round((envelope.spent / envelope.budget) * 100);
          const isOverBudget = envelope.spent > envelope.budget;

          return (
            <div key={envelope.name} className="bg-bg-elevated border border-border-subtle rounded-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{envelope.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{envelope.name}</h3>
                      <p className="text-xs text-text-tertiary">{percent}% utilizado</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-border-subtle">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-text-secondary">Gasto</span>
                  <MoneyDisplay value={envelope.spent} size="md" className="block" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-text-secondary">Orçado</span>
                  <MoneyDisplay value={envelope.budget} size="md" className="block text-text-tertiary" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="w-full h-3 bg-bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      isOverBudget
                        ? 'bg-danger'
                        : percent > 80
                          ? 'bg-warning'
                          : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                {envelope.categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary">{cat}</span>
                    <span className="text-text-tertiary">R$ XXX,XX</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
