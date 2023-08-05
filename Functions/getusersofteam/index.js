

const AWS = require('aws-sdk');
const express = require("express");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'users2';

app.use(cors());
app.use(express.json());

console.log("-----------------------------------------------------------------------------------------")

app.post("/getUsers", async (req,res) => {
  try {
    console.log("+===================================+");
    const teamName = req.body.teamName;

    if (!teamName) {
      return res.send({message: "Please provide the teamName parameter."})
    }

    const usersInTeam = await getUsersInTeam(teamName);
    console.log(usersInTeam);
    res.send(usersInTeam);
  } catch (error) {
    console.error(error);
    res.send({message: "An error occurred while processing the request."})
  }
})

const getUsersInTeam = async (teamName) => {
  console.log("-------------------------------",teamName);
  const params = {
    TableName: tableName,
    FilterExpression: 'teamName = :team',
    ExpressionAttributeValues: {
      ':team': teamName
    },
    ProjectionExpression: 'email'
  };

  const scanResults = [];
  let items;

  do {
    items = await dynamodb.scan(params).promise();
    items.Items.forEach((item) => scanResults.push(item.email));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  } while (typeof items.LastEvaluatedKey !== 'undefined');

  return scanResults;
}


module.exports.handler = serverless(app);