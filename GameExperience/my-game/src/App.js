import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './components/Chat';
import TriviaGame from './components/TriviaGame';
import GameJoinPage from './components/GameJoinPage';
import DataPage from './components/DataPage';
import Leaderboard from './components/Leadboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/chat" element = {<Chat />} />
          <Route path = "/trivia-game/:user/:teamName" element = {<TriviaGame />} />
          <Route path="/join" element = {<GameJoinPage />} />
          <Route path="/dashboard/:gameId" element = {< DataPage/>} />
          <Route path="/leaderboard" element = {<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
