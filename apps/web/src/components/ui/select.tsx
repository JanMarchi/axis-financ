import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export function Select({ onValueChange, ...props }: SelectProps) {
  return <select onChange={(e) => onValueChange?.(e.target.value)} {...props} />;
}

export function SelectTrigger({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>;
}

export function SelectContent({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export function SelectItem({ children, value, ...props }: React.HTMLAttributes<HTMLOptionElement> & { value: string }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
