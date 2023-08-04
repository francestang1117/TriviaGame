/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
// import { db } from './config';
import axios from "axios";
import cors from 'cors';
// import { ref, push } from 'firebase/database';

import admin from "firebase-admin";
admin.initializeApp();
// Enable CORS
const corsHandler = cors({ origin: true });

export const getQuestions = onRequest( async(req, res) => {
    corsHandler(req, res, async () => {
        try {
            const {category, difficulty} = req.body;
            const data = {
                category: category,
                difficulty: difficulty
            }
            const apiUrl = 'https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/question';
            const response = await axios.post(apiUrl, data);
            const fetchQuestions = JSON.parse(response.data.body).data;

            // Store the questions into the firebase real time database
            // const questionsRef = ref(db, 'triviaQuestions');
            const questionsRef = admin.database().ref('triviaQuestions');
            fetchQuestions.forEach((question) => {
                const childRef = questionsRef.push();
                childRef.set(question);
            });

            res.status(200).json({status: 200, message: 'Trivia questions fetched and stored successfully.'});
        }catch (error) {
            console.error('Fetching and storing questions failed with error ', error);
            res.status(500).json({status: 500, error: error.message});
        }
    })
});

// exports.createGameRoom = onRequest(async(req, res) => {

//     try {
//         const roomId = generateUniqueRoomId();

//         // Create a new game room entry in the Firebase Realtime Database
//         await admin.database().ref("gameRooms").child(roomId).set({
//             teams: {},
//         // Add other game room data as needed
//         });

//         res.status(201).json({ roomId });
//     } catch (error) {
//         console.error("Error creating game room:", error);
//         res.status(500).json({ error: "Failed to create game room" });
//     }
    
// });

// function generateUniqueRoomId() {
//     const length = 6;
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let roomId = "";
  
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       roomId += characters.charAt(randomIndex);
//     }
  
//     return roomId;
// }
  

// exports.joinGameRoom = onRequest(async(req, res) => {
//     try {
//         const { roomId, teamId } = req.body;
    
//         // Check if the game room exists in the Firebase Realtime Database
//         const roomSnapshot = await admin.database().ref("gameRooms").child(roomId).once("value");
//         const roomData = roomSnapshot.val();
    
//         if (!roomData) {
//           return res.status(404).json({ error: "Game room not found" });
//         }
    
//         // Check if the team exists in the game room
//         if (!roomData.teams || !roomData.teams[teamId]) {
//           return res.status(404).json({ error: "Team not found" });
//         }

//         // Check if there is space for the player in the team (you can enforce team capacity here)
//         if (Object.keys(roomData.teams[teamId].players).length >= 4) {
//             return res.status(400).json({ error: "Team is full" });
//         }
  
//         // Add the player to the team
//         const playerId = generateUniquePlayerId();
//         const player = { id: playerId, name: "Player" }; // Replace with player data as needed
//         await admin.database().ref("gameRooms").child(roomId).child("teams").child(teamId).child("players").child(playerId).set(player);
  
//         res.status(200).json({ message: "Player joined team successfully" });
//     } catch (error) {
//         console.error("Error joining team:", error);
//         res.status(500).json({ error: "Failed to join team" });
//     }
// });

// function generateUniquePlayerId() {
//     const length = 8;
//     const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let playerId = "";
  
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * characters.length);
//       playerId += characters.charAt(randomIndex);
//     }
  
//     return playerId;
// }
  