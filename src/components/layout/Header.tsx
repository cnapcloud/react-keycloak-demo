import { Button } from '@/components/ui/Button';

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg tracking-tight">Keycloak Demo</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-300 text-sm">{username}</span>
        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700" onClick={onLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  );
}
