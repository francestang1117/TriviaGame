import React, { useState } from 'react';
import Axios from 'axios';

const TriviaGameLobby = () => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [timeFrameFilter, setTimeFrameFilter] = useState('');

  const handleFilterGames = async () => {
    try {
      const response = await Axios.post('https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/game', {
        category: categoryFilter,
        difficulty: difficultyFilter,
        timeframe: timeFrameFilter,
      });
      const responseData = JSON.parse(response.data.body);
      setFilteredGames(responseData.data || []); // Provide default value of empty array if response.data.data is undefined
      console.log("hey");
      console.log(filteredGames);
    } catch (error) {
      console.error('Error filtering trivia games:', error);
    }
  };

  const handleJoinLobby = (game_id) => {
    console.log('Joining Lobby for Game ID:', game_id);
    // You can implement the logic to join the lobby here based on the game_id
  };

  return (
    <div>
      <h2>Available Trivia Game Lobbies:</h2>
      <div>
        <label>Category:</label>
        <input type="text" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} />
      </div>
      <div>
        <label>Difficulty Level:</label>
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          {/* Add more difficulty levels if needed */}
        </select>
      </div>
      <div>
        <label>Time Frame:</label>
        <input type="text" value={timeFrameFilter} onChange={(e) => setTimeFrameFilter(e.target.value)} />
      </div>
      <button onClick={handleFilterGames}>Filter Games</button>
      {filteredGames.length > 0 ? (
        filteredGames.map((game) => (
          <div key={game.id}>
            <h3>{game.gameName}</h3>
            <p>Description: {game.gameDescription}</p>
            <p>Category: {game.gameCategory}</p>
            <p>Difficulty: {game.gameDifficulty}</p>
            {/* Additional game details can be displayed here */}
            <p>Number of Participants: {game.numberOfParticipants}</p>
            <p>Time Remaining: {game.timeRemaining}</p>
            {/* Render other game details as needed */}
            <button onClick={() => handleJoinLobby(game.id)}>Join Lobby</button>
          </div>
        ))
      ) : (
        <p>No games found matching the selected filters.</p>
      )}
    </div>
  );
};

export default TriviaGameLobby;
