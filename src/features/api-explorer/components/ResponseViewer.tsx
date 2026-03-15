import { Badge } from '@/components/ui/Badge';

interface ResponseViewerProps {
  data: unknown;
  status: number | null;
  duration: number | null;
  error: string | null;
}

function statusVariant(status: number | null): 'success' | 'error' | 'warning' | 'info' {
  if (!status) return 'error';
  if (status < 300) return 'success';
  if (status < 500) return 'warning';
  return 'error';
}

export function ResponseViewer({ data, status, duration, error }: ResponseViewerProps) {
  if (error) {
    return (
      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="error">오류</Badge>
          {duration !== null && <span className="text-xs text-slate-400">{duration}ms</span>}
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (data === null) return null;

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={statusVariant(status)}>{status ?? '-'}</Badge>
        {duration !== null && <span className="text-xs text-slate-400">{duration}ms</span>}
      </div>
      <pre className="bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-700 overflow-auto max-h-64">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
