import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'emerald' | 'amber' | 'rose' | 'purple' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-surface-elevated text-secondary border-subtle',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
    emerald: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
    rose: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
    purple: 'bg-purple-950/40 text-purple-300 border-purple-800/40',
    slate: 'bg-surface text-secondary border-subtle',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] tracking-wide',
    md: 'px-2 py-0.5 text-[10px] tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center font-mono border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};