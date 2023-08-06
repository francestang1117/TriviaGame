import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // adjust this line to where your firebase is configured
import { collection, query, getDocs, orderBy } from "firebase/firestore";



const PlayerBoard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const usersQuery = query(usersRef, orderBy('score', 'desc')); // Order by score in descending order
            const querySnapshot = await getDocs(usersQuery);

            const userList = querySnapshot.docs.map((doc) => ({
                email: doc.id,
                score: doc.data().score,
            }));

            setUsers(userList);
        };

        fetchUsers();
    }, []);

    return (
        <div className="playerboard-container">
            <h1 className="playerboard-title">Leaderboard</h1>
            {users.map((user, index) => (
                <div key={user.email} className="playerboard-item">
                    <h2 className="rank">Rank: {index + 1}</h2>
                    <h3 className="user">User: {user.email}</h3>
                    <p className="score">Score: {user.score}</p>
                </div>
            ))}
        </div>
    );
};

export default PlayerBoard
