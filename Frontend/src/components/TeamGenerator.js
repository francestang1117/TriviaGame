// components/TeamGenerator.js
import React, { useState } from 'react';
import axios from 'axios';

function TeamGenerator() {
  const [TeamName, setTeamName] = useState('');
  const [teamCreated, setTeamCreated] = useState(false);
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gamename, setGamename] = useState('');
  const [teamStatistics, setTeamStatistics] = useState(null);

  const createTeam = async () => {
    try {
      const response = await axios.post(
        'https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/createteam' // Replace with your API Gateway URL
      );
      console.log(response.data.body);
      const { TeamName } = JSON.parse(response.data.body);
      console.log(TeamName);
      setTeamName(TeamName);
      setTeamCreated(true);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const makeUserAdmin = async (email) => {
    try {
      console.log(email);
      const response = await axios.post(
        'https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/admin',
        {
          email,
          makeuseradmin: true,
        }
      );
      console.log('User made admin:', response.data);
    } catch (error) {
      console.error('Error making user admin:', error);
    }
  };

  const viewTeamStats = async () => {
    try {
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*', // Replace with your frontend URL or specific domain
          'Access-Control-Allow-Methods': 'POST', // Add other HTTP methods if required
          'Access-Control-Allow-Headers': 'Content-Type', // Add other allowed headers if required
          'Content-Type': 'application/json' // Set the content type of the request body
        }
      };
      console.log(TeamName + "------------------------------------------------");

      const response = await axios.post(
        'https://z2d896tfv7.execute-api.us-east-1.amazonaws.com/dev/viewStatistic',
        { teamName: TeamName }, // Pass the teamName to the Lambda function
        config // Include the headers in the request configuration
      );
      setTeamStatistics(response.data);
      console.log(response);
      // Handle the response data and update the state or display the team statistics

    } catch (error) {
      console.error('Error fetching team statistics:', error);
    }
  };

  const makeUserLeave = async (email) => {
    try {
      const response = await axios.post(
        'https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/admin',
        {
          email,
          makeuserleave: true,
        }
      );
      console.log('User left the team:', response.data);
      // After a successful response, you can also update the users state to reflect the changes.
    } catch (error) {
      console.error('Error making user leave:', error);
    }
  };

  const viewMembers = async () => {
    try {
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*', // Replace with your frontend URL or specific domain
          'Access-Control-Allow-Methods': 'POST', // Add other HTTP methods if required
          'Access-Control-Allow-Headers': 'Content-Type', // Add other allowed headers if required
          'Content-Type': 'application/json' // Set the content type of the request body
        }
      };

      console.log("---------------------------------------------")
      const response = await axios.post(
        'https://uouspgj9q5.execute-api.us-east-1.amazonaws.com/dev/getUsers',
        { teamName: TeamName },
        config // Include the headers in the request configuration
      );

      console.log(response);
      setUsers(response.data);

    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleGamenameChange = (event) => {
    setGamename(event.target.value);
  };

  const inviteMembers = async () => {
    try {
      const response = await axios.post(
        'https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/invitations/adduser', // Replace with your API Gateway URL for inviting members
        {
          email,
          name,
          gamename,
        }
      );
      // Handle the response if needed
      console.log('Invitation sent:', response.data);
    } catch (error) {
      console.error('Error inviting members:', error);
    }
  };

  return (
    <>
      {!teamCreated && <button onClick={createTeam}>Create Team</button>}
      {teamCreated && (
        <>
          <p>Team Name: {TeamName}</p>
          <button onClick={viewMembers}>View Members</button>
          {teamStatistics && (
            <div>
              <h2>Team Statistics:</h2>
              <form>
                <label>Score:</label>
                <input type="text" value={teamStatistics.score} disabled />
                <label>Wins:</label>
                <input type="text" value={teamStatistics.wins} disabled />
                <label>Losses:</label>
                <input type="text" value={teamStatistics.losses} disabled />
                <label>Games Played:</label>
                <input type="text" value={teamStatistics.games_played} disabled />
              </form>
            </div>
          )}
          <button onClick={viewTeamStats}>View Team Statistics</button>
          {users.length > 0 && (
            <div>
              <h2>Members:</h2>
              <ul>
                {users.map((user, index) => (
                  <li key={index}>
                    {user}
                    <button onClick={() => makeUserAdmin(email)}>Make Admin</button>
                    <button onClick={() => makeUserLeave(email)}>Make User Leave</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h2>Invite Members:</h2>
            <label>Email:</label>
            <input type="text" value={email} onChange={handleEmailChange} />
            <label>Name:</label>
            <input type="text" value={name} onChange={handleNameChange} />
            <label>Game Name:</label>
            <input type="text" value={gamename} onChange={handleGamenameChange} />
            <button onClick={inviteMembers}>Invite Members</button>
          </div>

        </>
      )}
    </>
  );
}

export default TeamGenerator;
