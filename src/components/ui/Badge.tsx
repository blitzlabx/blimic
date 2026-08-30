import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'cyan' | 'amber' | 'emerald' | 'rose' | 'purple' | 'slate';
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
    default: 'bg-gray-800/80 text-gray-300 border-gray-700/60',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/50',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-800/50',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
    slate: 'bg-slate-900/80 text-slate-400 border-slate-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs tracking-wider',
    md: 'px-2.5 py-1 text-xs font-medium tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase rounded border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
