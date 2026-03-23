'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OnboardingStep3() {
  const [income, setIncome] = useState('');
  const [situation, setSituation] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Conhecendo você</h2>
        <p className="text-text-secondary">Nos ajude a entender sua situação financeira</p>
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-2 block">Qual é sua renda mensal?</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          placeholder="R$ 0,00"
          className="w-full px-4 py-2 rounded-input bg-bg-subtle border border-border-default text-text-primary"
        />
      </div>

      <div>
        <label className="text-sm text-text-secondary mb-3 block">Qual é sua situação atual?</label>
        <div className="space-y-2">
          {['Poupo regularmente', 'Começo a poupar agora', 'Estou em dívida', 'Tenho emergências'].map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border-default hover:bg-bg-subtle transition-colors">
              <input type="radio" name="situation" value={opt} onChange={(e) => setSituation(e.target.value)} />
              <span className="text-sm text-text-primary">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      <Link
        href="/onboarding/step-4"
        className="block text-center px-8 py-3 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all"
      >
        Próximo
      </Link>
    </div>
  );
}
