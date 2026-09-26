import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
}) => {
  const variantStyles = {
    primary: 'bg-brand-primary text-white',
    secondary: 'bg-brand-accentLight text-brand-accent border border-brand-accent/20',
    success: 'bg-green-50 text-status-success border border-green-200',
    warning: 'bg-amber-50 text-status-warning border border-amber-200',
    danger: 'bg-red-50 text-status-danger border border-red-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};
