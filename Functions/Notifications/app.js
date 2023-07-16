const nodemailer = require('nodemailer');
const { user, pass } = require('./config');

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

exports.notificationsHandler = async (event, context) => {
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
                    const response = {
                        statusCode: 500,
                        body: JSON.stringify({
                            status: '500',
                            message: error
                        })
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
        console.error(error);
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                status: '500',
                message: error
            })
        };
        return response;
    }
};
