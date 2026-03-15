import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface TokenInfoCardProps {
  token: string | undefined;
  tokenExpiresAt: Date | undefined;
  isTokenExpired: () => boolean;
  onUpdateToken: () => Promise<void>;
}

export function TokenInfoCard({ token, tokenExpiresAt, isTokenExpired, onUpdateToken }: TokenInfoCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  const expired = isTokenExpired();

  const maskedToken = token ? `${token.slice(0, 20)}...` : '-';

  const handleCopy = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await onUpdateToken();
    } finally {
      setUpdating(false);
    }
  };

  const expiresLabel = tokenExpiresAt
    ? tokenExpiresAt.toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <Card title="토큰 상태">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">상태</span>
          <Badge variant={expired ? 'error' : 'success'}>
            {expired ? '만료됨' : '유효'}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">만료 시각</span>
          <span className="text-sm text-slate-700 font-mono">{expiresLabel}</span>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-xs text-slate-600 font-mono bg-slate-50 px-2 py-1 rounded flex-1 truncate">
              {revealed ? token : maskedToken}
            </code>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="text-xs py-1" onClick={() => setRevealed((v) => !v)}>
              {revealed ? '숨기기' : '토큰 보기'}
            </Button>
            <Button variant="secondary" className="text-xs py-1" onClick={handleCopy}>
              {copied ? '복사됨' : '복사'}
            </Button>
            <Button variant="secondary" className="text-xs py-1" loading={updating} onClick={handleUpdate}>
              갱신
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
