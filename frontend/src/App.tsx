import { useEffect } from 'react';
import { AppRouter } from '@/routes/AppRouter';
import { Toast } from '@/shared/components/Toast';
import { useAuthStore } from '@/store/authStore';

function App() {
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}

export default App;