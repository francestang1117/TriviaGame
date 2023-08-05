const  dynamodb  = require('./aws-config');

exports.signupSecurityHandler = async (event, context) => {
    try {
        const data = event;
        const params = {
            TableName: 'SecurityQuestions',
            Item: { ...data },
        };
        console.log(params.Item);

        const result = await dynamodb.put(params).promise();
        console.log(result);

        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, message: "Security question saved!" })
        };
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body : JSON.stringify({ status: 500, errorCode: errorCode, errorMessage: errorMessage })
        };
    }
};
