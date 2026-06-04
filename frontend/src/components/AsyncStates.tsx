import { AlertCircle, Inbox } from 'lucide-react';

export function LoadingSkeleton({ rows = 5, title = false }: { rows?: number; title?: boolean }) {
  return <div className="loading-skeleton" aria-label="loading">{title && <div className="skeleton-title" />}{Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton-row" />)}</div>;
}
export function EmptyState({ title = '데이터가 없습니다.', description = '표시할 항목이 생기면 여기에 나타납니다.', action }: { title?: string; description?: string; action?: any }) {
  return <div className="empty-state"><Inbox size={34}/><strong>{title}</strong><p>{description}</p>{action}</div>;
}
export function ErrorState({ message = '데이터를 불러오지 못했습니다.', onRetry }: { message?: string; onRetry?: () => void }) {
  return <div className="error-state"><AlertCircle size={34}/><strong>문제가 발생했습니다</strong><p>{message}</p>{onRetry && <button className="btn btn-outline btn-sm" onClick={onRetry}>다시 시도</button>}</div>;
}
