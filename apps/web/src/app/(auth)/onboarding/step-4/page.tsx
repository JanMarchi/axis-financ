'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function OnboardingStep4() {
  const [accountType, setAccountType] = useState('');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Suas Contas</h2>
        <p className="text-text-secondary">Como você quer adicionar suas contas?</p>
      </div>

      <div className="space-y-3">
        <label
          className={`flex items-center gap-4 p-4 rounded-card border-2 cursor-pointer transition-all ${
            accountType === 'manual'
              ? 'border-brand-500 bg-bg-subtle'
              : 'border-border-subtle hover:border-border-default'
          }`}
        >
          <input
            type="radio"
            name="account"
            value="manual"
            checked={accountType === 'manual'}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-5 h-5"
          />
          <div>
            <p className="font-medium text-text-primary">Adicionar Manualmente</p>
            <p className="text-sm text-text-tertiary">Eu vou digitar os dados das minhas contas</p>
          </div>
        </label>

        <label
          className={`flex items-center gap-4 p-4 rounded-card border-2 cursor-pointer transition-all ${
            accountType === 'pluggy'
              ? 'border-brand-500 bg-bg-subtle'
              : 'border-border-subtle hover:border-border-default'
          }`}
        >
          <input
            type="radio"
            name="account"
            value="pluggy"
            checked={accountType === 'pluggy'}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-5 h-5"
          />
          <div>
            <p className="font-medium text-text-primary">Conectar Meu Banco</p>
            <p className="text-sm text-text-tertiary">Sincronizar automaticamente com Open Finance</p>
          </div>
        </label>
      </div>

      <Link
        href="/onboarding/step-5"
        className="block text-center px-8 py-3 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all disabled:opacity-50"
      >
        Próximo
      </Link>
    </div>
  );
}
