const nodemailer = require('nodemailer');
const { user, pass } = require('./config');
const {SNS, SQS} = require('./aws-config');

/**
 * @api {post} /user/notification Send notification
 * @requires body
 * {
 *     "to": <USER_EMAIL>,
 *     "subject": <SUBJECT>,
 *     "body": <BODY>
 * }
 *
 * @returns {json}
 * */

/*exports.notificationsHandler = async (event, context) => {
    try {
        const { to, subject, body } = event;
        console.log(`Sending notification to ${to} with subject ${subject} and body ${body}`);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass
            }
        });

        const mailOptions = {
            from: user,
            to: to,
            subject: subject,
            text: body
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    const response =  {
                        statusCode: 500,
                        body : JSON.stringify({ status: 500, errorCode: errorCode, errorMessage: errorMessage })
                    };
                    reject(response);
                } else {
                    console.log(`Email sent: ${info.response}`);
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify({
                            status: '200',
                            message: `Email sent: ${info.response}`
                        })
                    };
                    resolve(response);
                }
            });
        });
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        const response = {
            statusCode: 500,
            body : JSON.stringify({ status: 500, errorCode: errorCode, errorMessage: errorMessage })
        };
        return response;
    }
};*/


exports.notificationsHandler = async (event, context) => {
    const topicArn = 'arn:aws:sns:us-east-1:659069070023:TriviaNotification';
	const queueUrl = 'https://sqs.us-east-1.amazonaws.com/659069070023/TriviaNotificationQueue';

    for (let record of event.Records) {
        const body = JSON.parse(record.body);
        const emails = body.emails;

        const message = `Greetings!\n\n${body.message}`;

        // const message = `${body.itemType}\n\nITEM: ${body.itemName}\nDESCRIPTION: ${body.description}\n\nCONTACT: ${body.userEmail}`;


        // Send SNS notification
        const params = {
            Message: message,
            TopicArn: topicArn
        };
        await SNS.publish(params).promise();

        // Delete the SQS message after successfully sending the notification
        const deleteParams = {
            QueueUrl: queueUrl, // set this environment variable in the AWS Lambda console
            ReceiptHandle: record.receiptHandle
        };
        await SQS.deleteMessage(deleteParams).promise();
    }

}

