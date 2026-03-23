'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const step = parseInt(pathname.split('step-')[1]?.charAt(0) || '1');
  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col p-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-secondary">Etapa {step} de {totalSteps}</p>
          <p className="text-sm text-text-secondary">{Math.round((step / totalSteps) * 100)}%</p>
        </div>
        <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Axis Finance</h1>
        <p className="text-text-secondary">Configure sua jornada financeira</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  );
}
