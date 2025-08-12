import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './Components/MainPage';

import LandingPage from './Pages/LandingPage/LandingPage';
import LoginForm from './Pages/Authentication/LoginForm';
import SignupForm from './Pages/Authentication/SignupForm';
import Stocks from './Pages/Stocks/Stocks';
import Portfolio from './Pages/Portfolio/Portfolio';
import StockDetails from './Pages/StockDetails/StockDetails';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path='/stocks' element={<ProtectedRoute><MainPage children={<Stocks />} /></ProtectedRoute>} />
          <Route path='/stock/:symbol' element={<ProtectedRoute><MainPage children={<StockDetails />} /></ProtectedRoute>}/>
          <Route path='/portfolio' element={<ProtectedRoute><MainPage children={<Portfolio />} /></ProtectedRoute>} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
