import React from 'react';
import HomePage from './HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './Signin';
import SignupPage from './Signup';
import PasswordRecovery from './RecoverPassword';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/password-recover' element={<PasswordRecovery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
