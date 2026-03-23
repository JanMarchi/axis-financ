'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Status = 'pending' | 'paid' | 'active' | 'completed' | 'canceled' | 'overdue' | 'success' | 'warning' | 'danger';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusStyles: Record<Status, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Pendente' },
  paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Pago' },
  active: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Ativo' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Concluído' },
  canceled: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: 'Cancelado' },
  overdue: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Vencido' },
  success: { bg: 'bg-success/10', text: 'text-success', label: 'Sucesso' },
  warning: { bg: 'bg-warning/10', text: 'text-warning', label: 'Aviso' },
  danger: { bg: 'bg-danger/10', text: 'text-danger', label: 'Erro' },
};

export function StatusBadge({
  status,
  label,
  size = 'sm',
  className,
}: StatusBadgeProps) {
  const style = statusStyles[status];
  const displayLabel = label || style.label;
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        style.bg,
        style.text,
        sizeClass,
        className,
      )}
    >
      {displayLabel}
    </span>
  );
}
