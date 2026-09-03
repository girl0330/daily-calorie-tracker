import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
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
  const isPasswordRecoveryFromStore = useAuthStore(state => state.isPasswordRecovery);
  const setUser = useAuthStore(state => state.setUser);
  const setIsAuthLoading = useAuthStore(state => state.setIsAuthLoading);
  const setIsPasswordRecovery = useAuthStore(state => state.setIsPasswordRecovery);
  useEffect(() => {
    let mounted = true;
    const recoveryStorageKey = 'passwordRecoveryUserId';

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      if (!mounted) return;

      const recoveryUserId = sessionStorage.getItem(recoveryStorageKey);

      const isPasswordRecovery = sessionUser !== null && recoveryUserId === sessionUser.id;

      // 세션이 없거나 다른 사용자의 복구 기록이면 제거
      if (recoveryUserId && !isPasswordRecovery) {
        sessionStorage.removeItem(recoveryStorageKey);
      }

      setUser(sessionUser);
      setIsPasswordRecovery(isPasswordRecovery);
      setIsAuthLoading(false);
    };

    initAuth();

    // 로그인 상태가 바뀔 때마다 실행되는는 구독 코드
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;

      setUser(user);

      if (event === 'PASSWORD_RECOVERY' && user) {
        sessionStorage.setItem(recoveryStorageKey, user.id);

        setIsPasswordRecovery(true);
      }

      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem(recoveryStorageKey);
        setIsPasswordRecovery(false);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setIsAuthLoading, setIsPasswordRecovery]);

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
        <Route
          element={
            isPasswordRecoveryFromStore ? (
              <Navigate to="/reset-password" replace />
            ) : userFromStore ? (
              <AppLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/" element={<DailyTrackerPage />} />
          <Route path="/monthly" element={<MonthlyTrackerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
