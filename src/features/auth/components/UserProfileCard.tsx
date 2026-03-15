import { Card } from '@/components/ui/Card';
import { getEnv } from '@/config/env';
import type { ParsedTokenInfo } from '@/features/auth/hooks/useAuth';

interface UserProfileCardProps {
  username: string;
  parsedTokenInfo: ParsedTokenInfo;
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-mono text-slate-800 text-right break-all">{value}</span>
    </div>
  );
}

export function UserProfileCard({ username, parsedTokenInfo }: UserProfileCardProps) {
  const env = getEnv();
  const profileUrl = `${env.KEYCLOAK_AUTH_SERVER_URL}/realms/${env.KEYCLOAK_REALM}/user-profile?return_uri=${encodeURIComponent(window.location.origin)}`;

  return (
    <Card title="사용자 정보">
      <div className="space-y-3">
        <InfoRow label="사용자명" value={username} />
        {parsedTokenInfo.sub && <InfoRow label="sub" value={parsedTokenInfo.sub} />}
        {parsedTokenInfo.email && <InfoRow label="email" value={parsedTokenInfo.email} />}
        {parsedTokenInfo.groups.length > 0 && (
          <InfoRow label="groups" value={parsedTokenInfo.groups.join(', ')} />
        )}
        <div className="pt-2 border-t border-slate-100">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            프로필 관리 &rarr;
          </a>
        </div>
      </div>
    </Card>
  );
}
