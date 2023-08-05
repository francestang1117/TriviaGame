const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    const email = event.email;
    const name=event.name;
    const gamename=event.gamename;
    const messageBody = {
      email,
      name,
      gamename,
    };

    const params = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/659069070023/queueforuserinvitation', 
    };

    await sqs.sendMessage(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent to the queue successfully' }),
    };
  } catch (error) {
    console.error('Error sending email to the queue:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending mobile number to the queue' }),
    };
  }
};
