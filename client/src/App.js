import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TheoryBoard from './pages/TheoryBoard';
import Login from './pages/Login'; // Import the Login component
import Register from './pages/Register'; // Import the Register component
import Comparison from './pages/Comparison'; // Import the Comparison component
import MCURoadmap from './pages/MCURoadmap';
import Casting from './pages/Casting';
import MovieDetails from './components/MovieDetails';
import Favorites from './pages/Favorites';
import AccountSettings from './pages/AccountSettings';
import ForgotPassword from './pages/ForgotPassword';

import ForgotUsername from './pages/ForgotUsername';
import ResetPassword from './pages/ResetPassword';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/theories" element={<TheoryBoard />} />
          <Route path="/login" element={<Login />} /> {/* Add this route for login */}  
          <Route path="/register" element={<Register />} /> {/* Add this route for registration */}
          <Route path="/comparison" element={<Comparison />} /> {/* Add this route for comparison page */}
          <Route path="/mcu" element={<MCURoadmap />} /> {/* Add this route for MCU roadmap */}
          <Route path="/casting" element={<Casting />} /> {/* Add this route for casting page */}
          <Route path="/movie/:id" element={<MovieDetails />} /> {/* Add this route for movie details */} 
          <Route path="/Favorites" element={<Favorites />} /> {/* Add this route for favorites page */}
          <Route path="/settings" element={<AccountSettings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/forgot-username" element={<ForgotUsername />} />
<Route path="/reset-password/:token" element={<ResetPassword />} /> 
 
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
