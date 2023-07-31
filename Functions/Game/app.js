const dynamodb = require('./aws-config');

/**
 * required params:
 * {
 *     gameName: string,
 *     gameDescription: string,
 *     gameCategory: string,
 *     gameTimeFrame: string,
 *     gameDifficulty: string,
 *     questions: [{},{}]
 * }
 * */

exports.gameHandler = async (event) => {
    try {
        const {
            gameName,
            gameDescription,
            gameCategory,
            gameTimeFrame,
            gameDifficulty,
            questions
        } = event;

        const params = {
            TableName: 'Games',
            Item: {
                id: Math.floor(100000000 + Math.random() * 900000000).toString(),
                gameName,
                gameDescription,
                gameCategory,
                gameTimeFrame,
                gameDifficulty,
                questions
            },
        };
        console.log(params.Item);

        const result = await dynamodb.put(params).promise();
        console.log(result);
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, message: "Game saved!" })
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(error);

        return {
            statusCode: 500,
            body : JSON.stringify({ status: 500, errorCode: errorCode, errorMessage: errorMessage })
        };
    }
}

// Filtering the games on the basis of category, timeframe and difficulty
exports.getGamesHandler = async (event) => {
    const {category, difficulty, timeframe} = event;

    try {
        let params = {
            TableName: 'Games'
        };

        if (category && difficulty && timeframe) {
            params.FilterExpression = 'gameDifficulty = :gameDifficulty and gameDifficulty = :gameDifficulty and gameTimeFrame = :gameTimeFrame';
            params.ExpressionAttributeValues = {
                ':gameCategory': category,
                ':gameDifficulty': difficulty,
                ':gameTimeFrame': timeframe
            };
        } else if (category && difficulty) {
            params.FilterExpression = 'gameCategory = :gameCategory and gameDifficulty = :gameDifficulty';
            params.ExpressionAttributeValues = {
                ':gameCategory': category,
                ':gameDifficulty': difficulty
            };
        } else if (category && timeframe) {
            params.FilterExpression = 'gameCategory = :gameCategory and gameTimeFrame = :gameTimeFrame';
            params.ExpressionAttributeValues = {
                ':gameCategory': category,
                ':gameTimeFrame': timeframe
            };
        } else if (difficulty && timeframe) {
            params.FilterExpression = 'gameDifficulty = :gameDifficulty and gameTimeFrame = :gameTimeFrame';
            params.ExpressionAttributeValues = {
                ':gameDifficulty': difficulty,
                ':gameTimeFrame': timeframe
            };
        } else if (category) {
            params.FilterExpression = 'gameCategory = :gameCategory';
            params.ExpressionAttributeValues = {
                ':gameCategory': category
            };
        } else if (difficulty) {
            params.FilterExpression = 'gameDifficulty = :gameDifficulty';
            params.ExpressionAttributeValues = {
                ':gameDifficulty': difficulty
            };
        } else if (timeframe) {
            params.FilterExpression = 'gameTimeFrame = :gameTimeFrame';
            params.ExpressionAttributeValues = {
                ':gameTimeFrame': timeframe
            };
        } else {
            const result = await dynamodb.scan(params).promise();

            if (result.Items.length === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({status: 404, message: 'Game not found!'})
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify({status: 200, message: 'Game retrieved!', data: result.Items})
                };
            }
        }

        const result = await dynamodb.scan(params).promise();

        if (result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({status: 404, message: 'Game not found!'})
            };
        } else {
            return {
                statusCode: 200,
                body: JSON.stringify({status: 200, message: 'Game retrieved!', data: result.Items})
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