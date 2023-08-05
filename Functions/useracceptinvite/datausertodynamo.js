const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // Extract the 'proxy' from event.pathParameters to get the entire resource path
    const resourcePath = event.pathParameters.proxy;

    // Split the resourcePath to get the individual components (gamename and username)
    const [gamename, username, email] = resourcePath.split('/');

    // Update the DynamoDB table "Team" to store users as a set, only if the user does not already exist in the set
    const updateParams = {
      TableName: "Team",
      Key: {
        TeamName: gamename
      },
      UpdateExpression: 'ADD #users :user',
      ConditionExpression: 'NOT contains (#users, :existingUser)',
      ExpressionAttributeNames: {
        '#users': 'users',
      },
      ExpressionAttributeValues: {
        ':user': dynamodb.createSet([username]),
        ':existingUser': username, // To check if the user already exists in the set
      },
    };

    await dynamodb.update(updateParams).promise();

    console.log(`User '${username}' added to team '${gamename}' successfully.`);
    console.log('Updated Team:', `{ "${username}" }`);

    // Try to update the "teamName" attribute in the "users2" table with the provided email.
    // If the email does not exist in the "users2" table, it will add a new item.
    // Otherwise, it will update the existing item with the new "teamName" value.
    const updateUsers2Params = {
      TableName: "users2",
      Key: {
        email: email,
      },
      UpdateExpression: 'SET teamName = :teamName',
      ExpressionAttributeValues: {
        ':teamName': gamename,
      },
      ReturnValues: 'ALL_NEW', // To return the updated item (if it exists) after the update
    };

    const updateResult = await dynamodb.update(updateUsers2Params).promise();

    console.log(`Updated "users2" table with email '${email}' and teamName '${gamename}'.`);

    // If the email does not exist in the "users2" table, it will return an empty object
    if (Object.keys(updateResult.Attributes).length === 0) {
      console.log(`User with email '${email}' does not exist in "users2" table. Adding a new item.`);
      // If the email does not exist, add a new item to the "users2" table
      const newUsers2Params = {
        TableName: "users2",
        Item: {
          teamName: gamename,
          email: email,
          isAdmin:false,
        },
      };

      await dynamodb.put(newUsers2Params).promise();
      console.log(`Added new user with email '${email}' to "users2" table.`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User added to the team successfully.' }),
    };
  } catch (error) {
    console.error('Error adding user to the team:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error adding user to the team.' }),
    };
  }
};
