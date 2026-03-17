import './App.css'
import Nav from "../pages/Nav.tsx";

function App() {
  return <div style={{ display: 'flex', minHeight: '100vh' }}>

    {/* Navbar */}
    <Nav />

    {/* Main */}
    <main className="flex-1 p-5 bg-[#f5f5f5]">
      {/* daily-tracker */}
      {/* monthly-tracker */}
    </main>

  </div>
}

export default App
