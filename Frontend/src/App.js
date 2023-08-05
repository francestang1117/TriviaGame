import React from 'react';
// import HomePage from './components/HomePage';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signin from './components/Signin';
import SignupPage from './components/Signup';
import PasswordRecovery from './components/RecoverPassword';
import SecurityQuestionsPage from "./components/SignupSecurityQuestions";
import SigninSecurityQuestionPage from "./components/SinginSecurityQuestions";
import CreateGame from "./components/addGame";
import AddQuestions from "./components/addQuestions";
import FilterQuestions from "./components/FilterQuestions";
import Navbar from './components/Navbar';
import LexV2Chatbot from './components/LexChatBot';
import TeamGenerator from './components/TeamGenerator';

import TriviaGameLobby from './components/TriviaGameLobby';

import ProfilePage from "./components/HP";
import HomePage from "./components/HomePage";
import RegistrationPage from "./components/RegistrationPage";
import EditProfile from "./components/EditProfile";


function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/" element={<HomePage/>}/>
                <Route path='/signin' element={<Signin/>}/>
                <Route path='/signup' element={<SignupPage/>}/>
                <Route path='/password-recover' element={<PasswordRecovery/>}/>
                <Route path='/signup/security-questions' element={<SecurityQuestionsPage/>}/>
                <Route path='/signin/security-questions' element={<SigninSecurityQuestionPage/>}/>
                <Route path="/game" element={<CreateGame/>}/>
        		<Route path="/question/add" element={<AddQuestions/>}/>
                <Route path="/question/list" element={<FilterQuestions/>}/>
                <Route path='/bot' element={<LexV2Chatbot />} />
                <Route path='/teammanagment' element={<TeamGenerator/>} />

                <Route path='/trivia' element={<TriviaGameLobby/>} />

                <Route path='/CreateProfile' element={<RegistrationPage/>} />
                <Route path='/EditProfile' element={<EditProfile/>} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
