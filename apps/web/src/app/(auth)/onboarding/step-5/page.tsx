'use client';

import React from 'react';
import Link from 'next/link';

export default function OnboardingStep5() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Os Envelopes</h2>
        <p className="text-text-secondary">Organize seu dinheiro com a metodologia dos envelopes</p>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Essencial', percent: 50, color: '#3B82F6', desc: 'Necessidades básicas' },
          { name: 'Não Essencial', percent: 30, color: '#F97316', desc: 'Diversão e lazer' },
          { name: 'Crescimento', percent: 15, color: '#10B981', desc: 'Desenvolvimento pessoal' },
          { name: 'Investimento', percent: 5, color: '#8B5CF6', desc: 'Seu futuro' },
        ].map((envelope) => (
          <div key={envelope.name} className="p-4 rounded-card bg-bg-elevated border border-border-subtle">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-text-primary">{envelope.name}</h3>
              <span className="text-sm font-bold text-text-secondary">{envelope.percent}%</span>
            </div>
            <p className="text-xs text-text-tertiary mb-3">{envelope.desc}</p>
            <div className="w-full h-2 bg-bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${envelope.percent}%`, backgroundColor: envelope.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="block text-center px-8 py-3 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all"
      >
        Começar
      </Link>
    </div>
  );
}
