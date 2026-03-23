'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export function SkeletonCard({ className, lines = 3 }: SkeletonCardProps) {
  return (
    <div className={cn('rounded-card bg-bg-elevated border border-border-subtle p-6', className)}>
      {/* Title skeleton */}
      <div className="skeleton h-6 w-2/3 mb-4 rounded-lg" />

      {/* Lines skeleton */}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'skeleton h-4 rounded-lg mb-3',
            i === lines - 1 ? 'w-full' : i % 2 === 0 ? 'w-full' : 'w-4/5',
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-bg-muted rounded-lg">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-4 flex-1 rounded" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 p-4 bg-bg-elevated rounded-lg">
          {Array.from({ length: 6 }).map((_, colIdx) => (
            <div key={colIdx} className="skeleton h-4 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}
