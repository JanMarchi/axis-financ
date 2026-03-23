'use client';

import React from 'react';
import { Plus, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MoneyDisplay } from '@/components/ui/money-display';

export default function GoalsPage() {
  const goals = [
    { id: '1', emoji: '🏠', name: 'Fundo de Emergência', current: 4500, target: 10000, deadline: '2025-12-31' },
    { id: '2', emoji: '✈️', name: 'Viagem Europa', current: 2000, target: 8000, deadline: '2025-08-15' },
    { id: '3', emoji: '💻', name: 'Novo Notebook', current: 1200, target: 3500, deadline: '2025-06-30' },
  ];

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Alcance seus objetivos financeiros"
        action={{
          label: '+ Nova Meta',
          onClick: () => {},
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percent = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-bg-elevated border border-border-subtle rounded-card p-6">
              <div className="text-4xl mb-4">{goal.emoji}</div>

              <h3 className="text-lg font-bold text-text-primary mb-4">{goal.name}</h3>

              <div className="mb-4 pb-4 border-b border-border-subtle">
                <div className="flex items-baseline justify-between mb-2">
                  <MoneyDisplay value={goal.current} size="md" className="block" />
                  <span className="text-sm text-text-tertiary">de</span>
                  <MoneyDisplay value={goal.target} size="sm" className="block" />
                </div>
                <p className="text-xs text-text-tertiary">Até {goal.deadline}</p>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">Progresso</span>
                  <span className="text-sm font-bold text-brand-500">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <button className="w-full py-2 rounded-btn border border-border-default hover:bg-bg-subtle transition-colors text-sm font-medium text-text-primary">
                Adicionar Valor
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-8 bg-bg-elevated border border-border-subtle rounded-card text-center">
        <Plus className="w-8 h-8 mx-auto mb-4 text-text-tertiary" />
        <p className="text-text-secondary mb-4">Crie novas metas para estruturar seus objetivos financeiros</p>
        <button className="px-6 py-2 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all">
          Criar Primeira Meta
        </button>
      </div>
    </div>
  );
}
