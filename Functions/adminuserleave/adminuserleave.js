const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'users2';

exports.handler = async (event, context) => {
  try {
    console.log(event);
    const makeUserAdmin = event['makeuseradmin'];
    const makeUserLeave = event['makeuserleave'];
    const userEmail = event['email']; // Replace 'user_email' with the actual parameter name for user email
    console.log(makeUserAdmin);
    console.log(makeUserLeave);
    if (makeUserAdmin !== undefined || makeUserLeave !== undefined) {
      if (makeUserAdmin === true) {
        console.log("inside admin");
        await updateUserAdmin(userEmail);
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'User admin status updated successfully.' })
        };
      } else if (makeUserLeave === true) {
        await removeUserTeam(userEmail);
        console.log("inside leave");
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: 'User team removed successfully.' })
        };
      }
    }

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Invalid request. Please provide either "makeuseradmin" or "makeuserleave" parameter set to true.' })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'An error occurred while processing the request.' })
    };
  }
};

async function updateUserAdmin(userEmail) {
  
  const params = {
    TableName: 'users2',
    Key: { email: userEmail }
  };
  const response = await dynamodb.get(params).promise();
  const user = response.Item;
  if (user && !user.isadmin) {
   
    const updateParams = {
      TableName: 'users2',
      Key: { email: userEmail },
      UpdateExpression: 'SET isadmin = :val',
      ExpressionAttributeValues: { ':val': true }
    };
    await dynamodb.update(updateParams).promise();
  }
}

async function removeUserTeam(userEmail) {
  const params = {
    TableName: 'users2',
    Key: { email: userEmail }
  };
  const response = await dynamodb.get(params).promise();
  const user = response.Item;
  if (user && user.teamName) {
    const updateParams = {
      TableName: 'users2',
      Key: { email: userEmail },
      UpdateExpression: 'REMOVE teamName, isadmin',
    };
    await dynamodb.update(updateParams).promise();
  }
}

