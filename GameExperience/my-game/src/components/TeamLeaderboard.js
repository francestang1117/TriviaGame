import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue} from "firebase/database";

const TeamLeaderboard = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Create a reference to the "teams" data in the database
    const teamsRef = ref(db, "teams");

    // Listen for changes to the "teams" data
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const teamsData = snapshot.val();
      if (teamsData) {
        // Convert the object of teams into an array
        const teamsArray = Object.entries(teamsData).map(([teamName, teamData]) => ({
          name: teamName,
          score: teamData.score,
        }));
        // Sort teams by score in descending order
        const sortedTeams = teamsArray.sort((a, b) => b.score - a.score);
        setTeams(sortedTeams);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe(); // This will remove the listener
    };
  }, []); // Pass an empty dependency array to run this effect only once

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






// import React, { useState, useEffect } from "react";
// import { db } from '../firebase';
// import { ref, onValue, runTransaction } from "firebase/database";

// const Dashboard = () => {
//     const [teams, setTeams] = useState([]);

//     useEffect(() => {
//         // Fetch team data from the database
//         const teamsRef = ref(db, "teams");
//         onValue(teamsRef, (snapshot) => {
//           const teamsData = snapshot.val();
//           if (teamsData) {
//             // Convert the object of teams into an array
//             const teamsArray = Object.entries(teamsData).map(([teamName, teamData]) => ({
//                 name: teamName,
//                 members: teamData.members,
//                 score: teamData.score,
//             }));
//             setTeams(teamsArray);
//           }
//         });
//     }, []);

//     return (
//         <div className="dashboard-container">
//           <h1>Team Scores</h1>
//           <table>
//             <thead>
//               <tr>
//                 <th>Team Name</th>
//                 <th>Team Members</th>
//                 <th>Team Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teams.map((team) => (
//                 <tr key={team.name}>
//                   <td>{team.name}</td>
//                   <td>{team.members.join(", ")}</td>
//                   <td>{team.score}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//     );
// };
    
// export default Dashboard;

