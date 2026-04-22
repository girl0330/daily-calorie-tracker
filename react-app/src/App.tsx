import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './pages/Nav';
import DailyTrackerPage from './pages/daily-tracker/DailyTrackerPage';
import MonthlyTrackerPage from './pages/monthly-tracker/MonthlyTrackerPage';
import SignUp from './pages/user/SignUp';
import { useState } from 'react';
import Login from './pages/user/Login';

// const USER_ID: UserId = 'test-user';

function App() {
  const [user, setUser] = useState('');
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Navbar */}
        <Nav />

        {/* Main */}
        <main className="flex-1 p-5">
          <Routes>
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/" element={<DailyTrackerPage userId={user} />} />
            <Route path="/monthly" element={<MonthlyTrackerPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
