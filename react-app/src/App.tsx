import { BrowserRouter, Routes, Route, Navigate, replace } from 'react-router-dom';
import './App.css';
import Nav from './pages/Nav';
import DailyTrackerPage from './pages/daily-tracker/DailyTrackerPage';
import MonthlyTrackerPage from './pages/monthly-tracker/MonthlyTrackerPage';
import SignUp from './pages/user/SignUp';
import { useEffect } from 'react';
import Login from './pages/user/Login';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';

function App() {
  const userFromStore = useAuthStore(state => state.user);
  const isAuthLoadingFromStore = useAuthStore(state => state.isAuthLoading);
  const setUser = useAuthStore(state => state.setUser);
  const setIsAuthLoading = useAuthStore(state => state.setIsAuthLoading);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setUser(data.session?.user ?? null);
      setIsAuthLoading(false);
    };

    initAuth();

    // 로그인 상태가 바뀔 때마다 실행되는는 구독 코드
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsAuthLoading]);

  if (isAuthLoadingFromStore) {
    return <div>인증 상태 확인 중...</div>;
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Nav />

        <main className="flex-1 p-5">
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/login" element={userFromStore ? <Navigate to="/" replace /> : <Login />} />

            <Route path="/" element={userFromStore ? <DailyTrackerPage /> : <Navigate to="/login" replace />} />

            <Route
              path="/monthly"
              element={userFromStore ? <MonthlyTrackerPage /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
