'use client';

import React from 'react';
import Link from 'next/link';

export default function OnboardingStep1() {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl mb-6">🎯</div>
      <h2 className="text-3xl font-bold text-text-primary">Bem-vindo ao Axis Finance</h2>
      <p className="text-text-secondary text-lg">
        Organize suas finanças, economize inteligentemente e invista para o futuro.
      </p>
      <p className="text-text-tertiary">Vamos começar configurando sua conta em poucos passos.</p>

      <Link
        href="/onboarding/step-2"
        className="inline-block mt-8 px-8 py-3 rounded-btn bg-brand-500 text-black font-medium hover:bg-brand-400 transition-all"
      >
        Próximo
      </Link>
    </div>
  );
}
