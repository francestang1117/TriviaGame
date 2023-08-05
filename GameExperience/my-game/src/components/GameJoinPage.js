import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

const GameJoinPage = () => {
  const [teamName, setTeamName] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate()

  const handleJoinTeam = async () => {
    // Reference to the team in the Firestore
    const teamRef = doc(db, "teams", teamName);

    // Get current team document
    const teamDoc = await getDoc(teamRef);

    // If team exists, update members and score
    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      const members = teamData.members ? [...teamData.members, user] : [user];

      // Update the team's members and score
      await updateDoc(teamRef, {
        members: members
      });

    } else {
      await setDoc(teamRef, {
        members: [user],
        score: 0,
        categoryScores: {},
        timeStamp: Date.now()
      });
    }

    // Add user
    const userRef = doc(db, 'users', user);

    // Check if the user already exists
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log('User already exists. Skipping or you can update instead.');

      navigate(`/trivia-game/${user}/${teamName}`);
      return;
    }

    // Set the user data in the database
    await setDoc(userRef, {
      categoryScores: {},
      score: 0,
      timeStamp: Date.now()
    });

    navigate(`/trivia-game/${user}/${teamName}`);

  };

  return (
    <div className="game-join-container">
      <h2>Join the Game</h2>
      <div>
        <label>
          Team Name:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          User Email:
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button onClick={handleJoinTeam}>Join Team</button>
        </label>
      </div>


    </div>
  );

}

export default GameJoinPage;
