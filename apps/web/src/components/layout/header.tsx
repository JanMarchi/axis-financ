'use client';

import React from 'react';
import { Bell, LogOut } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Header({ user }: HeaderProps) {
  const now = new Date();
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-30 bg-bg-base border-b border-border-subtle">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Left: Greeting */}
        <div className="md:ml-0">
          <h2 className="text-lg md:text-xl font-semibold text-text-primary">
            {greeting}, {user?.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-xs md:text-sm text-text-tertiary">{formatDate(now, 'long')}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
          </button>

          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-subtle rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
