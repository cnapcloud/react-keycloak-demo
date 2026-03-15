import type { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';

interface PageLayoutProps {
  username: string;
  onLogout: () => void;
  children: ReactNode;
}

export function PageLayout({ username, onLogout, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header username={username} onLogout={onLogout} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
}
