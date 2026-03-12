import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './views/pages/LandingPage'
import LoginPage from './views/pages/loginPage';
import DashboardPage from './views/pages/DashboardPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element={<LandingPage />}></Route>  
        <Route path= '/login' element={<LoginPage />}></Route>
        <Route path= '/dashboard' element= {<DashboardPage />}></Route>
      </Routes>     
    </BrowserRouter>
  )
}

export default App
