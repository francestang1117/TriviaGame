const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const crypto = require('crypto');

// Function to create a new SNS topic and subscribe an email
async function createTopicAndSubscribe(email) {
  try {
    // Create the SNS topic
    const hashedEmail = crypto.createHash('sha256').update(email).digest('hex');
    
    const topicParams = {
      Name: hashedEmail,
    };
    const topicData = await sns.createTopic(topicParams).promise();
    const topicArn = topicData.TopicArn;
  
    // Subscribe the email to the topic
    const subscribeParams = {
      Protocol: 'email',
      TopicArn: topicArn,
      Endpoint: email,
    };
    await sns.subscribe(subscribeParams).promise();

    return topicArn;
  } catch (error) {
    console.error('Error creating topic and subscribing email:', error);
    throw error;
  }
}

// Function to send the invitation email
async function sendInvitationEmail(email, gamename, name, topicArn) {
  try {
    // Customize the email content with the invitation link
    const joingame = `https://izqqhm2lde.execute-api.us-east-1.amazonaws.com/dev/invitations/${gamename}/${name}/${email}`;
    const message = `Hello ${name}, You are invited to join the game ${gamename}. Click ${joingame} to join the game`;

    const params = {
      Subject: 'Invitation to Join the Game',
      Message: message,
      TopicArn: topicArn,
    };
    console.log(topicArn);
    await sns.publish(params).promise();
    console.log(topicArn);
    console.log('Invitation email sent to', email);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
}

exports.handler = async (event) => {
  try {
    const sqsRecord = event.Records[0];
    const messageBody = JSON.parse(sqsRecord.body);
    const { email, name, gamename } = messageBody;

    // Call the createTopicAndSubscribe function to create the topic and subscribe the email
    const emailToSubscribe = email;
    const topicArn = await createTopicAndSubscribe(emailToSubscribe);

    // Now you have the topicArn and emailToSubscribe, you can use them as needed

    // Send the invitation email to the user
    await sendInvitationEmail(email, gamename, name, topicArn);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Topic created, email subscribed, and invitation email sent successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating topic, subscribing email, or sending invitation email' }),
    };
  }
};
