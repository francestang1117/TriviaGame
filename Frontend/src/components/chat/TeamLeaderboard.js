import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot } from 'firebase/firestore'

const TeamLeaderboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Create a reference 
    const teamsRef = collection(db, "teams");
  
    // Listen 
    const unsubscribe = onSnapshot(teamsRef, (querySnapshot) => {
      const teamsArray = [];
  
      querySnapshot.forEach((doc) => {
        const teamData = doc.data();
        teamsArray.push({
          name: doc.id, 
          score: teamData.score,
          categoryScores: teamData.categoryScores, 
        });
      });
  
      // Sort teams by score in descending order
      const sortedTeams = teamsArray.sort((a, b) => b.score - a.score);
  
      setTeams(sortedTeams);
    });
  
    // Clean up the listener 
    return () => {
      unsubscribe(); 
    };
  }, []);
  

  return (
    <div className="team-leaderboard">
      <h2>Team Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team.name}>
              <td>{index + 1}</td>
              <td>{team.name}</td>
              <td>{team.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamLeaderboard;
