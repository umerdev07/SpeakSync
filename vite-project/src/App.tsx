import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage   from './views/pages/LandingPage'
import LoginPage     from './views/pages/loginPage';
import DashboardPage from './views/pages/DashboardPage';
import MeetingRoom   from './views/pages/MeetingRoom';   // ← add

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'                element={<LandingPage />} />
        <Route path='/login'           element={<LoginPage />} />
        <Route path='/dashboard'       element={<DashboardPage />} />
        <Route path='/room/:roomId'    element={<MeetingRoom />} />  {/* ← add */}
      </Routes>     
    </BrowserRouter>
  )
}

export default App