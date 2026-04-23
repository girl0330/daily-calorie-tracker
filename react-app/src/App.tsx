import { BrowserRouter, Routes, Route, Navigate, replace } from 'react-router-dom';
import './App.css';
import Nav from './pages/Nav';
import DailyTrackerPage from './pages/daily-tracker/DailyTrackerPage';
import MonthlyTrackerPage from './pages/monthly-tracker/MonthlyTrackerPage';
import SignUp from './pages/user/SignUp';
import { useEffect, useState } from 'react';
import Login from './pages/user/Login';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('세션 확인 실패:', error.message);
        setUser(null);
      } else {
        setUser(data.session?.user ?? null);
      }

      setIsAuthLoading(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isAuthLoading) {
    return <div>인증 상태 확인 중...</div>;
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Nav setUser={setUser} user={user} />

        <main className="flex-1 p-5">
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login setUser={setUser} />} />

            <Route path="/" element={user ? <DailyTrackerPage userId={user.id} /> : <Navigate to="/login" replace />} />

            <Route path="/monthly" element={user ? <MonthlyTrackerPage /> : <Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
