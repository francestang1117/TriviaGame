const AWS = require('aws-sdk');
const express = require("express");
const app = express();
const cors = require("cors");
const serverless = require("serverless-http");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Team';

app.use(cors());
app.use(express.json());

app.post("/viewStatistic", async (req,res) => {
  const teamName  = req.body.teamName;

  try {
    const teamInfo = await getTeamInfo(teamName);
    if (teamInfo) {
      const { games_played, score, losses, wins } = teamInfo;
      res.send({ games_played, score, losses, wins })
    } else {
      res.send({ message: 'Team not found' })
    }
  } catch (error) {
    console.error('Error fetching team info:', error);
    res.send({ message: 'Failed to fetch team info' })
  }
})

const getTeamInfo = async (teamName) => {
  const params = {
    TableName: tableName,
    Key: { TeamName: teamName },
    ProjectionExpression: 'games_played, score, losses, wins'
  };

  try {
    const response = await dynamodb.get(params).promise();
    return response.Item;
  } catch (error) {
    console.error('Error getting team info from DynamoDB:', error);
    throw error;
  }
}

module.exports.handler = serverless(app);