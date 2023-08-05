const dynamodb = require('aws-config.js');
const {v4: uuid} = require('uuid');

exports.addQuestionHandler = async (event, context) => {
    try {
        const data = {
            question,
            options,
            answer,
            explanation,
            timeframe,
            difficulty,
            category,
            hints
        } = event;

        if (event.questionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({status: 400, message: "questionId should not be provided!"})
            }
        }

        const params = {
            TableName: 'Questions',
            Item: {
                questionId: uuid(),
                ...data
            }
        }
        const result = await dynamodb.put(params).promise();
        console.log(result);

        return {
            statusCode: 200,
            body: JSON.stringify({status: 200, message: "Question saved!"})
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({status: 500, errorCode: errorCode, errorMessage: errorMessage})
        };
    }
}

exports.editQuestionHandler = async (event, context) => {
    try {
        const data = {
            questionId,
            question,
            options,
            answer,
            explanation,
            timeframe,
            difficulty,
            category,
            hints
        } = event;

        if (!event.questionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({status: 400, message: "questionId should be provided!"})
            }
        }

        const params = {
            TableName: 'Questions',
            Key: {
                questionId: data.questionId
            },
            UpdateExpression: 'set question = :question, options = :options, answer = :answer, explanation = :explanation, timeframe = :timeframe, difficulty = :difficulty, category = :category, hints = :hints',
            ExpressionAttributeValues: {
                ':question': data.question,
                ':options': data.options,
                ':answer': data.answer,
                ':explanation': data.explanation,
                ':timeframe': data.timeframe,
                ':difficulty': data.difficulty,
                ':category': data.category,
                ':hints': data.hints
            },
            ReturnValues: 'UPDATED_NEW'
        }
        const result = await dynamodb.update(params).promise();
        console.log(result);

        return {
            statusCode: 200,
            body: JSON.stringify({status: 200, message: "Question updated!"})
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({status: 500, errorCode: errorCode, errorMessage: errorMessage})
        };
    }
}

exports.deleteQuestionHandler = async (event, context) => {
    try {
        const data = {
            questionId
        } = event;

        if (!event.questionId) {
            return {
                statusCode: 400,
                body: JSON.stringify({status: 400, message: "questionId should be provided!"})
            }
        }

        const params = {
            TableName: 'Questions',
            Key: {
                questionId: data.questionId
            }
        }
        const result = await dynamodb.delete(params).promise();
        console.log(result);

        return {
            statusCode: 200,
            body: JSON.stringify({status: 200, message: "Question deleted!"})
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({status: 500, errorCode: errorCode, errorMessage: errorMessage})
        };
    }
}

exports.filterQuestionsHandler = async (event, context) => {
    const {category, difficulty, timeframe} = event;

    try {
        let params = {
            TableName: 'Questions'
        };

        if (category && difficulty && timeframe) {
            params.FilterExpression = 'category = :category and difficulty = :difficulty and timeframe = :timeframe';
            params.ExpressionAttributeValues = {
                ':category': category,
                ':difficulty': difficulty,
                ':timeframe': timeframe
            };
        } else if (category && difficulty) {
            params.FilterExpression = 'category = :category and difficulty = :difficulty';
            params.ExpressionAttributeValues = {
                ':category': category,
                ':difficulty': difficulty
            };
        } else if (category && timeframe) {
            params.FilterExpression = 'category = :category and timeframe = :timeframe';
            params.ExpressionAttributeValues = {
                ':category': category,
                ':timeframe': timeframe
            };
        } else if (difficulty && timeframe) {
            params.FilterExpression = 'difficulty = :difficulty and timeframe = :timeframe';
            params.ExpressionAttributeValues = {
                ':difficulty': difficulty,
                ':timeframe': timeframe
            };
        } else if (category) {
            params.FilterExpression = 'category = :category';
            params.ExpressionAttributeValues = {
                ':category': category
            };
        } else if (difficulty) {
            params.FilterExpression = 'difficulty = :difficulty';
            params.ExpressionAttributeValues = {
                ':difficulty': difficulty
            };
        } else if (timeframe) {
            params.FilterExpression = 'timeframe = :timeframe';
            params.ExpressionAttributeValues = {
                ':timeframe': timeframe
            };
        } else {
            const result = await dynamodb.scan(params).promise();

            if (result.Items.length === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({status: 404, message: 'Questions not found!'})
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify({status: 200, message: 'Questions retrieved!', data: result.Items})
                };
            }
        }

        const result = await dynamodb.scan(params).promise();

        if (result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({status: 404, message: 'Questions not found!'})
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({status: 200, message: 'Questions retrieved!', data: result.Items})
            };
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({status: 500, errorCode: errorCode, errorMessage: errorMessage})
        };
    }
}

exports.getQuestionsForGameHandler = async (event, context) => {
    const {gameId} = event;
    try {
		if (!gameId) {
            return {
                statusCode: 400,
                body: JSON.stringify({status: 400, message: "gameId should be provided!"})
            }
        } else {
            const gameParams = {
                TableName: 'Games',
                Key: { id: gameId },
            };

            const gameData = await dynamodb.get(gameParams).promise();

            if (!gameData.Item) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({status: 404, message: "Game not found!"})
                }
            } else {
                const questionsData = [];
                for (const question of gameData.Item.questions) {
                    const questionParams = {
                        TableName: 'Questions',
                        Key: {questionId: question.id},
                    };
                    const questionData = await dynamodb.get(questionParams).promise();
                    if (questionData.Item) {
                        questionsData.push(questionData.Item);
                    }
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({status: 200, data: questionsData})
                };
            }
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({status: 500, errorCode: errorCode, errorMessage: errorMessage})
        };
    }
}