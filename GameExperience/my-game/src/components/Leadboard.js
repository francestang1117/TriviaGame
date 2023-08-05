import React, { useState, useEffect } from "react";
import axios from 'axios';

const Leaderboard = () => {
    const [globalLeaderboard, setGlobalLeaderboard] = useState({ users: [], teams: [] });
    const [categoryLeaderboard, setCategoryLeaderboard] = useState({ users: [], teams: [] });
    const [timeFrame, setTimeFrame] = useState('allTime');
    const [category, setCategory] = useState('Science');
    const [limit, setLimit] = useState(10);


    useEffect(() => {

        axios.get(`https://getgloballeaderboard-5pg2kz6h4q-uc.a.run.app/getGlobalLeaderboard?timeFrame=${timeFrame}&limit=${limit}`)
            .then(response => {
                setGlobalLeaderboard(response.data)
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });

        axios.get(`https://getcategoryleaderboard-5pg2kz6h4q-uc.a.run.app/getCategoryLeaderboard?category=${category}&timeFrame=${timeFrame}&limit=${limit}`)
            .then(response => {
                setCategoryLeaderboard(response.data);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [category, limit, timeFrame]);


    return (
        <div className="leadboard">
            <h1>Global Leaderboard</h1>
            <select onChange={e => setTimeFrame(e.target.value)}>
                <option value="allTime">All Time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            <select value={limit} onChange={(e) => setLimit(e.target.value)}>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="30">Top 50</option>
                <option value="40">Top 50</option>
                <option value="50">Top 50</option>
            </select>
            <h2>Users</h2>
            <ul>
                {globalLeaderboard.users.map((user, index) => {
                    <li key={user.name}>Rank {index + 1}: {user.name} - Score: {user.score}</li>
                })}
            </ul>
            <h2>Teams</h2>
            <ul>
                {globalLeaderboard.teams.map((team, index) => (
                    <li key={team.name}>Rank {index + 1}: {team.name} - Score: {team.score}</li>
                ))}
            </ul>
            <h1>Category Leaderboard: {category}</h1>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Literature">Literature</option>
                <option value="Math">Math</option>
            </select>
            <select value={limit} onChange={(e) => setLimit(e.target.value)}>
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="30">Top 50</option>
                <option value="40">Top 50</option>
                <option value="50">Top 50</option>
            </select>

            <h2>User</h2>
            <ul>
                {categoryLeaderboard.users.map((user, index) => {
                    <li key={user.name}>Rank {index + 1}: {user.name} - Score: {user.score}</li>
                })}
            </ul>
            <h2>Teams</h2>
            <ul>
                {categoryLeaderboard.teams.map((team, index) => (
                    <li key={team.name}>Rank {index + 1}: {team.name} - Score: {team.score}</li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;