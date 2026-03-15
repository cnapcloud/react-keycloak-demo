import { PageLayout } from '@/components/layout/PageLayout';
import { UserProfileCard } from '@/features/auth/components/UserProfileCard';
import { TokenInfoCard } from '@/features/auth/components/TokenInfoCard';
import { ApiExplorerCard } from '@/features/api-explorer/components/ApiExplorerCard';
import { useToast } from '@/components/ui/Toast';
import type { UseAuthReturn } from '@/features/auth/hooks/useAuth';

interface DashboardPageProps {
  auth: UseAuthReturn;
}

export function DashboardPage({ auth }: DashboardPageProps) {
  const { addToast } = useToast();

  const handleUpdateToken = async () => {
    try {
      const result = await auth.updateToken();
      if (result.refreshed) {
        addToast('토큰이 갱신되었습니다.', 'success');
      } else {
        addToast('토큰이 아직 유효합니다.', 'info');
      }
    } catch {
      addToast('토큰 갱신에 실패했습니다.', 'error');
    }
  };

  return (
    <PageLayout username={auth.username ?? ''} onLogout={auth.logout}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserProfileCard username={auth.username ?? ''} parsedTokenInfo={auth.parsedTokenInfo} />
        <TokenInfoCard
          token={auth.token}
          tokenExpiresAt={auth.tokenExpiresAt}
          isTokenExpired={auth.isTokenExpired}
          onUpdateToken={handleUpdateToken}
        />
        <ApiExplorerCard />
      </div>
    </PageLayout>
  );
}
