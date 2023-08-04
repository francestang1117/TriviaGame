// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import { ref, onValue, off} from "firebase/database";


// const PlayerLeaderboard = () => {
//   const [players, setPlayers] = useState([]);

//   useEffect(() => {
//     // Fetch player data from the database
//     const playersRef = ref(db, 'users');
//     onValue(playersRef, (snapshot) => {
//       const playersData = snapshot.val();
//       if (playersData) {
//         // Convert the object of players into an array
//         // const playersArray = Object.entries(playersData).map(([member,playersData]) => ({
//         //   name: member,
//         //   score: playersData.score,
//         // }));
//           if (playersData) {
//               let usersArray = [];
//               for (let user in usersData) {
//                 usersArray.push({
//                   name: user,
//                   score: playersData[user].score,
//                 });
//               }
//               // Sort players by score in descending order
//               const sortedPlayers = playersArray.sort((a, b) => b.score - a.score).map((user, index) => ({
//                 ...user,
//                 rank: index + 1 // rank is index + 1 because array indices start at 0
//               }));
//               setPlayers(sortedPlayers);
//       }
//     }

//     return () => off("value"); 
//   }, []);

//   return (
//     <div className="player-leaderboard">
//       <h2>Player Leaderboard</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Rank</th>
//             <th>Player Name</th>
//             <th>Score</th>
//           </tr>
//         </thead>
//         <tbody>
//           {players.map((player, index) => (
//             <tr key={player.name}>
//               <td>{index + 1}</td>
//               <td>{player.name}</td>
//               <td>{player.score}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PlayerLeaderboard;
