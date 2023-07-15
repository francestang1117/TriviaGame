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
        console.error(error);

        return {
            statusCode: 400,
            body: JSON.stringify({ status: 400, message: "Error saving security question!" })
        };
    }
};
