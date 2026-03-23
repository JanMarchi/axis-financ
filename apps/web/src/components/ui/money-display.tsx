'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg' | 'hero';

interface MoneyDisplayProps {
  value: number | string;
  size?: Size;
  colored?: boolean;
  className?: string;
}

const sizeStyles: Record<Size, string> = {
  sm: 'text-sm font-medium',
  md: 'text-lg font-semibold',
  lg: 'text-2xl font-bold',
  hero: 'text-display-hero font-display',
};

export function MoneyDisplay({
  value,
  size = 'md',
  colored = false,
  className,
}: MoneyDisplayProps) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const isNegative = numValue < 0;
  const displayValue = Math.abs(numValue).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const colorClass = colored
    ? isNegative
      ? 'text-red-500'
      : 'text-emerald-500'
    : size === 'hero'
      ? 'text-brand-500'
      : 'text-text-primary';

  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        sizeStyles[size],
        colorClass,
        className,
      )}
    >
      {isNegative && '−'}
      {displayValue}
    </span>
  );
}
