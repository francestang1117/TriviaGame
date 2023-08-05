const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const TableName = 'Team';

exports.handler = async (event) => {
  const teamName = await generateUniqueTeamName();
  
  try {
    // Save the teamName to DynamoDB with additional attributes and their initial values
    await saveTeamNameToDynamoDB(teamName);
    console.log("after saveteamnametodynamo");
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ teamName: teamName }) // Use "TeamName" as the attribute name
    };
  } catch (error) {
    console.error('Error saving team name:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Failed to create team.' })
    };
  }
};

async function generateUniqueTeamName() {
  const randomName = generateRandomString();
  const isNameUnique = await isTeamNameUnique(randomName);

  if (isNameUnique) {
    return randomName;
  } else {
    return generateUniqueTeamName(); 
  }
}

async function saveTeamNameToDynamoDB(teamName) {
  console.log("inside saveteamtodynamodb");
  const params = {
    TableName,
    Item: {
      TeamName: teamName, // Use "TeamName" as the attribute name
      score: 0,
      wins: 0,
      losses: 0,
      games_played: 0
    }
  };
  console.log(params);
  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    throw new Error('Error saving team name to DynamoDB: ' + error.message);
  }
}

// ... (rest of the code remains unchanged)


function generateRandomString() {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}

async function isTeamNameUnique(teamName) {
  const params = {
    TableName,
    KeyConditionExpression: 'TeamName = :name', // Use 'TeamName' instead of 'teamName'
    ExpressionAttributeValues: {
      ':name': teamName
    },
    ProjectionExpression: 'TeamName', // Use 'TeamName' instead of 'teamName'
    Limit: 1
  };

  try {
    const data = await dynamodb.query(params).promise();
    return data.Items.length === 0; // If data.Items is empty, the teamName is unique
  } catch (error) {
    console.error('Error checking uniqueness:', error);
    return false; // Assume name is not unique to avoid errors
  }
}
