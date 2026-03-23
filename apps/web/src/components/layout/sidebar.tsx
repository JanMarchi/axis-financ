'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  CreditCard,
  Wallet,
  Target,
  FileText,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Transações', href: '/transactions', icon: Send },
  { label: 'Contas', href: '/accounts', icon: CreditCard },
  { label: 'Orçamento', href: '/budget', icon: Wallet },
  { label: 'Metas', href: '/goals', icon: Target },
  { label: 'Contas a Pagar', href: '/bills', icon: FileText },
  { label: 'Chat Na_th', href: '/chat', icon: MessageCircle },
  { label: 'Relatórios', href: '/reports', icon: BarChart3 },
  { label: 'Configurações', href: '/settings', icon: Settings },
];

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    plan: 'free' | 'premium';
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-bg-elevated border border-border-subtle text-text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-60 bg-bg-base border-r border-border-subtle z-40',
          'flex flex-col transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border-subtle">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-bold text-text-primary">
              Axis <span className="text-brand-500">Finance</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all',
                  'text-sm font-medium',
                  isActive
                    ? 'bg-bg-subtle border-l-2 border-brand-500 text-text-primary'
                    : 'text-text-secondary hover:bg-bg-overlay hover:text-text-primary',
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        {user && (
          <div className="border-t border-border-subtle p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">
                  {user.name
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="hidden sm:block flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-tertiary truncate">{user.email}</p>
              </div>
            </div>

            {user.plan === 'free' && (
              <button className="w-full py-2 px-3 rounded-btn bg-brand-500 text-black font-medium text-xs hover:bg-brand-400 transition-all animate-pulse-brand">
                Fazer Upgrade
              </button>
            )}

            {user.plan === 'premium' && (
              <div className="text-xs text-brand-500 font-medium text-center py-2">
                Premium Ativo
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main content offset */}
      <div className="hidden md:block w-60" />
    </>
  );
}
