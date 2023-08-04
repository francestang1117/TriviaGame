import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import { db } from '../firebase';

const GameJoinPage = () => {
    const [teamName, setTeamName] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamScore, setTeamScore] = useState(0);
    const [user, setUser] = useState("");
    const navigate = useNavigate()

    // const user = "jane";

    const handleJoinTeam = () => {
        // Add the user to the team in the database
        const teamRef = ref(db, `teams/${teamName}/members`);
        push(teamRef, user);
    
        // Fetch team members and team score from the database
        const teamMembersRef = ref(db, `teams/${teamName}/members`);
        onValue(teamMembersRef, (snapshot) => {
          const members = snapshot.val();
          if (members) {
            setTeamMembers(Object.values(members));
          }
        });
    
        const teamScoreRef = ref(db, `teams/${teamName}/score`);
        onValue(teamScoreRef, (snapshot) => {
          const score = snapshot.val();
          // If the score is null, set it to 0
          setTeamScore(score || 0);
        });

        navigate(`/trivia-game/${user}/${teamName}`);  
    };

    return (
        <div className="game-join-container">
          <h2>Join the Game</h2>
          <label>
            Team Name:
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            User Email:
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <button onClick={handleJoinTeam}>Join Team</button>
          </label>
        </div>
    );

}

export default GameJoinPage;
