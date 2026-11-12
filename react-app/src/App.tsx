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
import Toaster from './components/common/Toaster';
import WeeklyReportPage from './pages/weekly-report/WeeklyReportPage';
import MyPage from './pages/mypage/MyPage';
import ComponentsPreviewPage from './pages/dev/ComponentsPreviewPage';

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
        <Route
          path="/login"
          element={
            isPasswordRecoveryFromStore ? (
              <Navigate to="/reset-password" replace />
            ) : userFromStore ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/sign-up"
          element={
            isPasswordRecoveryFromStore ? (
              <Navigate to="/reset-password" replace />
            ) : userFromStore ? (
              <Navigate to="/" replace />
            ) : (
              <SignUp />
            )
          }
        />

        <Route
          path="/find-password"
          element={
            isPasswordRecoveryFromStore ? (
              <Navigate to="/reset-password" replace />
            ) : userFromStore ? (
              <Navigate to="/" replace />
            ) : (
              <FindPassword />
            )
          }
        />

        {/* 비밀번호 복구 페이지 */}
        <Route
          path="/reset-password"
          element={
            isPasswordRecoveryFromStore ? (
              <ResetPassword />
            ) : userFromStore ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

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
          <Route path="/weekly-report" element={<WeeklyReportPage />} />
          <Route path="/mypage" element={<MyPage />} />
          {/* 개발 서버에서만 생기는 공통 부품 확인 페이지 */}
          {import.meta.env.DEV && <Route path="/dev/components" element={<ComponentsPreviewPage />} />}
        </Route>
      </Routes>

      {/* 로그인 화면 등 모든 페이지에서 토스트를 띄울 수 있게 앱 맨 바깥에 둬요. */}
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
