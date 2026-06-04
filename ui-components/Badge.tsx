/**
 * COMPONENT: Badge
 * shadcn/ui 기반 뱃지 컴포넌트
 * variants: default, secondary, success, warning, destructive, outline
 */
import React from 'react';

type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'badge-default',
  secondary: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  destructive: 'badge-destructive',
  outline: 'badge-outline',
};

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  return (
    <span className={`badge ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

// 게시글 상태 뱃지 (CMS 전용)
type ArticleStatus = 'PUBLISHED' | 'DRAFT' | 'OFFLINE';

const statusVariant: Record<ArticleStatus, BadgeVariant> = {
  PUBLISHED: 'success',
  DRAFT: 'secondary',
  OFFLINE: 'destructive',
};

export function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status}
    </Badge>
  );
}
