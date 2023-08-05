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
import cors from 'cors';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
// import { ref, push } from 'firebase/database';

import admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();
// Enable CORS
const corsHandler = cors({ origin: true });

// export const getQuestions = onRequest(async (req, res) => {
//     corsHandler(req, res, async () => {
//         try {
//             const { category, difficulty } = req.body;
//             const data = {
//                 category: category,
//                 difficulty: difficulty
//             }
//             const apiUrl = 'https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/question';
//             const response = await axios.post(apiUrl, data);
//             const fetchQuestions = JSON.parse(response.data.body).data;

//             // Store the questions into the firebase real time database
//             // const questionsRef = ref(db, 'triviaQuestions');
//             const questionsRef = admin.database().ref('triviaQuestions');
//             fetchQuestions.forEach((question) => {
//                 const childRef = questionsRef.push();
//                 childRef.set(question);
//             });

//             res.status(200).json({ status: 200, message: 'Trivia questions fetched and stored successfully.' });
//         } catch (error) {
//             console.error('Fetching and storing questions failed with error ', error);
//             res.status(500).json({ status: 500, error: error.message });
//         }
//     })
// });


export const getGlobalLeaderboard = onRequest(async (req, res) => {
    corsHandler(req, res, async () => {

        let limit = req.query.limit ? parseInt(req.query.limit) : 10;

        const timeFrame = req.query.timeFrame || 'allTime';

        let startTime;

        switch (timeFrame) {
            case 'daily':
                startTime = new Date();
                startTime.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                startTime = new Date();
                startTime.setDate(startTime.getDate() - 7);
                break;
            case 'monthly':
                startTime = new Date();
                startTime.setMonth(startTime.getMonth() - 1);
                break;
            default: // all time
                startTime = new Date(0);
        }

        try {
            
            const userQuery = query(
                db.collection('users'),
                where('timestamp', '>=', startTime),
                orderBy('score', 'desc')
            );

            
            const teamQuery = query(
                db.collection('teams'),
                where('timestamp', '>=', startTime),
                orderBy('score', 'desc')
            );


            const [userSnapshot, teamSnapshot] = await Promise.all([
                getDocs(userQuery),
                getDocs(teamQuery)
            ]);

            const userLeaderboard = userSnapshot.docs.map((doc) => ({
                name: doc.id,
                score: doc.data().score
            })).slice(0, limit);

            const teamLeaderboard = teamSnapshot.docs.map((doc) => ({
                name: doc.id,
                score: doc.data().score
            })).slice(0, limit);

            res.status(200).send({ userLeaderboard, teamLeaderboard });
        } catch (error) {
            console.error('Error fetching global leaderboard:', error);
            res.status(500).send({ message: 'Error fetching global leaderboard' });
        }
    })
});

export const getCategoryLeaderboard = onRequest(async (req, res) => {
    corsHandler(req, res, async () => {

        const category = req.query.category;

        let limit = req.query.limit ? parseInt(req.query.limit) : 10;

        if (!category) {
            res.status(400).send({ error: 'No category provided' });
            return;
        }

        const timeFrame = req.query.timeFrame || 'allTime';

        let startTime;

        switch (timeFrame) {
            case 'daily':
                startTime = new Date();
                startTime.setHours(0, 0, 0, 0);
                break;
            case 'weekly':
                startTime = new Date();
                startTime.setDate(startTime.getDate() - 7);
                break;
            case 'monthly':
                startTime = new Date();
                startTime.setMonth(startTime.getMonth() - 1);
                break;
            default: // all time
                startTime = new Date(0);
        }

        switch (timeFrame) {
            case 'daily':
                startTime = new Date(currentTime.setHours(0, 0, 0, 0));
                break;
            case 'weekly':
                startTime = new Date(currentTime.setDate(currentTime.getDate() - 7));
                break;
            case 'monthly':
                startTime = new Date(currentTime.setMonth(currentTime.getMonth() - 1));
                break;
            default: // all time
                startTime = 0;
        }

        try {

            const userQuery = query(
                db.collection('users'),
                where('timestamp', '>=', startTime),
                orderBy(`categoryScores.${category}`, 'desc')
            );
            console.log(userQuery); 

            
            const teamQuery = query(
                db.collection('teams'),
                where('timestamp', '>=', startTime),
                orderBy(`categoryScores.${category}`, 'desc')
            );
            console.log(teamQuery); 

            const [userSnapshot, teamSnapshot] = await Promise.all([
                getDocs(userQuery),
                getDocs(teamQuery)
            ]);

            const userLeaderboard = userSnapshot.docs.map((doc) => ({
                name: doc.id,
                score: doc.data().score
            })).slice(0, limit);

            const teamLeaderboard = teamSnapshot.docs.map((doc) => ({
                name: doc.id,
                score: doc.data().score
            })).slice(0, limit);

            res.status(200).send({ userLeaderboard, teamLeaderboard });

        } catch (error) {
            console.error('Error fetching category leaderboard:', error);
            res.status(500).send({ message: 'Error fetching category leaderboard' });
        }

    });
});

