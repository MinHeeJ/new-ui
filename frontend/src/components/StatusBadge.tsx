import { Badge } from './ui/Badge';

export default function StatusBadge({ status }: { status?: 'PUBLISHED' | 'DRAFT' | 'OFFLINE' | string }) {
  const map: Record<string, any> = { PUBLISHED: 'success', DRAFT: 'secondary', OFFLINE: 'destructive' };
  const labels: Record<string, string> = { PUBLISHED: 'Published', DRAFT: 'Draft', OFFLINE: 'Offline' };
  return <Badge variant={map[status || 'DRAFT'] || 'outline'}>{labels[status || 'DRAFT'] || status}</Badge>;
}
