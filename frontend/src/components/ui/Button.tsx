/**
 * COMPONENT: Button
 * shadcn/ui 기반 버튼 컴포넌트
 * variants: default, secondary, destructive, outline, ghost
 * sizes: sm, md, lg
 */
import React from 'react';

type ButtonVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  default: 'btn-primary',
  secondary: 'btn-secondary',
  destructive: 'btn-destructive',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export function Button({
  variant = 'default',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
