import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className = '', variant = 'default', size = 'md', ...props }: ButtonProps) {
  const baseClass = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClass = {
    default: 'bg-brand-500 text-white hover:bg-brand-600',
    outline: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  }[variant];

  return <button className={`${baseClass} ${variantClass} ${className}`} {...props} />;
}
