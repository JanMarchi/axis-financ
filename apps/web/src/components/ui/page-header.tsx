'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-4 h-4 opacity-50" />}
              <a href={crumb.href} className={crumb.href ? 'hover:text-text-primary transition' : ''}>
                {crumb.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Title and Action */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display-lg font-display font-bold text-text-primary mb-2">
            {title}
          </h1>
          {description && <p className="text-text-secondary text-base">{description}</p>}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'px-6 py-2 rounded-btn font-medium text-sm transition-all flex-shrink-0 mt-1',
              action.variant === 'secondary'
                ? 'border border-border-default bg-transparent text-text-primary hover:bg-bg-subtle'
                : 'bg-brand-500 text-black hover:bg-brand-400 active:bg-brand-600',
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
