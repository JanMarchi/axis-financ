'use client';

import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PremiumGateProps {
  children: ReactNode;
  isPremium: boolean;
  featureName?: string;
}

export function PremiumGate({ children, isPremium, featureName = 'Este recurso' }: PremiumGateProps) {
  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">{children}</div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <div className="text-center p-6">
          <h3 className="text-lg font-bold text-white mb-2">Recurso Premium</h3>
          <p className="text-gray-300 mb-4">{featureName} está disponível apenas para usuários premium.</p>
          <Link href="/billing">
            <Button className="bg-green-500 hover:bg-green-600 text-white">Fazer Upgrade</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
