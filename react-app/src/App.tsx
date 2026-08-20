import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Nav from './pages/Nav';
import DailyTrackerPage from './pages/daily-tracker/DailyTrackerPage';
import MonthlyTrackerPage from './pages/monthly-tracker/MonthlyTrackerPage';
import SignUp from './pages/user/SignUp';
import { useEffect } from 'react';
import Login from './pages/user/Login';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import FindPassword from './pages/user/FindPassword';
import ResetPassword from './pages/user/ResetPassword';
import AppLayout from './layout/AppLayout';

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
      <Routes>
        {/* 로그인 전 페이지 */}
        <Route path="/login" element={userFromStore ? <Navigate to="/" replace /> : <Login />} />

        <Route path="/sign-up" element={userFromStore ? <Navigate to="/" replace /> : <SignUp />} />

        <Route path="/find-password" element={userFromStore ? <Navigate to="/" replace /> : <FindPassword />} />

        {/* 비밀번호 복구 페이지 */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 로그인 후 공통 Layout */}
        <Route element={userFromStore ? <AppLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<DailyTrackerPage />} />
          <Route path="/monthly" element={<MonthlyTrackerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
