import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import TriviaGame from './components/TriviaGame';
import GameJoinPage from './components/GameJoinPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/chat" element = {<Chat />} />
          <Route path = "/trivia-game/:user/:teamName" element = {<TriviaGame />} />
          <Route path="/join" element = {<GameJoinPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
