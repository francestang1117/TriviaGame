import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import RegistrationPage from './Pages/RegistartionPage';
import HomePage from './Pages/HomePage';
import EditProfile from './Pages/EditProfile.js';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Home" element={<HomePage />} />
      <Route path="/CreateProfile" element={<RegistrationPage />} />
      <Route path="/EditProfile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
