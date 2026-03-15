import type { ReactNode } from 'react';

interface BadgeProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
}

const variantClasses: Record<BadgeProps['variant'], string> = {
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
