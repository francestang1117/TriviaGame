import React from 'react';
import HomePage from './components/HomePage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from './components/Signin';
import SignupPage from './components/Signup';
import PasswordRecovery from './components/RecoverPassword';
import SecurityQuestionsPage from "./components/SignupSecurityQuestions";
import SigninSecurityQuestionPage from "./components/SinginSecurityQuestions";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/password-recover' element={<PasswordRecovery />} />
          <Route path='/signup/security-questions' element={<SecurityQuestionsPage />} />
          <Route path='/signin/security-questions' element={<SigninSecurityQuestionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
