import { ToastProvider } from '@/components/ui/Toast';
import { LoadingPage } from '@/pages/LoadingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginScreen } from '@/features/auth/components/LoginScreen';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function App() {
  const auth = useAuth();

  if (!auth.isInitialized) {
    return <LoadingPage />;
  }

  if (!auth.isAuthenticated) {
    return <LoginScreen onLogin={auth.login} />;
  }

  return (
    <ToastProvider>
      <DashboardPage auth={auth} />
    </ToastProvider>
  );
}
