/**
 * COMPONENT: Dialog
 * shadcn/ui 기반 모달 다이얼로그
 * 서브컴포넌트: Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter
 */
import React, { useEffect } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={`dialog-content dialog-${size}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface DialogSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className = '' }: DialogSectionProps) {
  return <div className={`dialog-header ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = '' }: DialogSectionProps) {
  return <h2 className={`dialog-title ${className}`}>{children}</h2>;
}

export function DialogDescription({ children, className = '' }: DialogSectionProps) {
  return <p className={`dialog-description ${className}`}>{children}</p>;
}

export function DialogFooter({ children, className = '' }: DialogSectionProps) {
  return <div className={`dialog-footer ${className}`}>{children}</div>;
}
