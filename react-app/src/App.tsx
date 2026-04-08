import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Nav from "./pages/Nav";
import MonthlyTrackerPage from "./pages/MonthlyTracker/MonthlyTrackerPage";
import DailyTrackerPage from "./pages/DailyTracker/DailyTrackerPage";
import type { UserId } from "./types/types";

const USER_ID: UserId = "test-user"

function App() {
  return(
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Navbar */}
        <Nav />

        {/* Main */}
        <main className="flex-1 p-5">
          <Routes>
            <Route path='/' element={<DailyTrackerPage userId={USER_ID}/>} />
            <Route path='/monthly' element={<MonthlyTrackerPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}

export default App
