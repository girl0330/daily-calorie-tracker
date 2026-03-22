import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Nav from "../pages/Nav.tsx";
import DailyPage from '../pages/DailyTracker.tsx'
import MonthlyPage from '../pages/MonthlyTracker.tsx'

function App() {
  return(
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Navbar */}
        <Nav />

        {/* Main */}
        <main className="flex-1 p-5">
          <Routes>
            <Route path='/' element={<DailyPage />} />
            <Route path='/monthly' element={<MonthlyPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}

export default App
