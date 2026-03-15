import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ResponseViewer } from '@/features/api-explorer/components/ResponseViewer';
import { useApiCall } from '@/features/api-explorer/hooks/useApiCall';
import { getEnv } from '@/config/env';

export function ApiExplorerCard() {
  const [endpoint, setEndpoint] = useState('/ip');
  const { data, status, duration, loading, error, call } = useApiCall();
  const backendUrl = getEnv().API_BACKEND_URL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void call(endpoint);
  };

  return (
    <Card title="API Explorer" className="col-span-full">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-slate-400">Backend</span>
        <code className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded">{backendUrl}</code>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-3 items-center">
        <span className="text-sm text-slate-500 shrink-0">Endpoint</span>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="/ip"
        />
        <Button type="submit" loading={loading}>
          요청 보내기
        </Button>
      </form>
      <ResponseViewer data={data} status={status} duration={duration} error={error} />
    </Card>
  );
}
