const dynamodb = require('./aws-config');
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
            const questions = [
                { id: 1, question: data.questions[0].question, answer: data.questions[0].answer },
                { id: 2, question: data.questions[1].question, answer: data.questions[1].answer },
                { id: 3, question: data.questions[2].question, answer: data.questions[2].answer },
            ];
            return questions;
        } else {
            console.error("No security questions found for the user");
        }
    } catch (error) {
        console.error(error);
    }
};

exports.signinSecurityHandler = async (event, context) => {
    try {
        const questions = event?.questions;
        const questionsInDB = await fetchSecurityQuestions(event.userId);
        console.log(questions);
        console.log(questionsInDB);
        const fatalResponse = {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid answer(s)' }),
        };

        const successfulResponse = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Valid answer(s)' }),
        };

        // Check for all the answers in the DB
        let flag = true;
        questionsInDB.forEach((q, index) => {
            if (q.question !== questions[index].question || q.answer !== questions[index].answer) {
                flag = false;
            }
        });

        console.log(flag);
        return flag ? successfulResponse : fatalResponse;
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};