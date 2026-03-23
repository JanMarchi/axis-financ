'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('fluxo');

  const tabs = [
    { id: 'fluxo', label: 'Fluxo de Caixa' },
    { id: 'categorias', label: 'Por Categoria' },
    { id: 'patrimonio', label: 'Patrimônio' },
    { id: 'envelopes', label: 'Envelopes' },
  ];

  return (
    <div>
      <PageHeader
        title="Relatórios"
        description="Análise detalhada de suas finanças"
        action={{
          label: 'Exportar',
          onClick: () => {},
        }}
      />

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-border-subtle">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-500 font-medium'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-bg-elevated border border-border-subtle rounded-card p-8 h-96 flex items-center justify-center text-center">
        <div>
          <p className="text-text-secondary mb-4">Gráfico de {tabs.find((t) => t.id === activeTab)?.label}</p>
          <p className="text-xs text-text-tertiary">Será renderizado com Recharts na integração com a API</p>
        </div>
      </div>
    </div>
  );
}
