import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`px-4 py-2 rounded-lg border border-gray-300 focus:border-brand-500 focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}
