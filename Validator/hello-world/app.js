// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();


const fetchSecurityQuestions = async (uid) => {
    try {
        const params = {
            TableName: 'SecurityQuestions',
            Key: {
                userId: uid,
            },
        };

        const response = await dynamodb.get(params).promise();

        if (response && response.Item) {
            const data = response.Item;
            console.log(data);
            const questions =  [
                { id: 1, question: data.questions[0].question, answer: data.questions[0].answer },
                { id: 2, question: data.questions[1].question, answer: data.questions[1].answer },
                { id: 3, question: data.questions[2].question, answer: data.questions[2].answer },
            ];
            return questions;


        } else {
            console.error("No security questions found for the user");
            // setError('No security questions found for the user');
        }
    } catch (error) {
        // setError('An error occurred while fetching security questions');
        console.error(error);
    }
};
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    try {
        const questions = event?.questions;
        const questionsInDB = await fetchSecurityQuestions(event.userId);
        console.log(questions);
        console.log(questionsInDB);
        const fatalResponse = {
            'status': 400,
            'content-type': 'application/json',
            'body': 'Invalid answer(s)',
        }

        const successfulResponse = {
            'status': 200,
            'content-type': 'application/json',
            'body': 'Valid answer(s)'
        }

        // Check for all the answers in the DB
        let flag = true;
        questionsInDB.forEach((q, index) => {
            if((q.question !== questions[index].question) || (q.answer !== questions[index].answer)){
                flag = false;
            }
        })

        console.log(flag);
        return flag ? successfulResponse : fatalResponse;
    } catch (err) {
        console.log(err);
        return err;
    }
};
