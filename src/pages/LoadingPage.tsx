import { Spinner } from '@/components/ui/Spinner';

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <Spinner size="lg" />
        <p className="text-sm">초기화 중...</p>
      </div>
    </div>
  );
}
