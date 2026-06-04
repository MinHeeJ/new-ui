import { LoadingSkeleton, EmptyState, ErrorState } from './AsyncStates';

type Column = { key: string; label: string; render?: (value: any, row: any, index: number) => any; className?: string };
export default function DataTable({ columns, data, loading, error, onRetry, onRowClick, emptyTitle = '항목이 없습니다.' }: { columns: Column[]; data: any[]; loading?: boolean; error?: string | null; onRetry?: () => void; onRowClick?: (row: any) => void; emptyTitle?: string }) {
  if (loading) return <div className="table-container"><LoadingSkeleton rows={6}/></div>;
  if (error) return <div className="table-container"><ErrorState message={error} onRetry={onRetry}/></div>;
  if (!data || data.length === 0) return <div className="table-container"><EmptyState title={emptyTitle}/></div>;
  return <div className="table-container"><table className="data-table"><thead><tr>{columns.map(c => <th key={c.key} className={c.className}>{c.label}</th>)}</tr></thead><tbody>{data.map((row, i) => <tr key={row.articleCode || row.folderCode || i} className={onRowClick ? 'table-row clickable' : 'table-row'} onClick={() => onRowClick?.(row)}>{columns.map(c => <td key={c.key} className={c.className}>{c.render ? c.render(row[c.key], row, i) : row[c.key]}</td>)}</tr>)}</tbody></table></div>;
}
