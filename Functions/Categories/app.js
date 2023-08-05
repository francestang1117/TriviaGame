const dynamodb = require('aws-config');
const {v4: uuid} = require('uuid');

exports.addCategoryHandler = async (event) => {
    const { category } = event;

    if(event.categoryId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: 400, message: "categoryId should not be provided!" })
        }
    } else if(!category) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: 400, message: "category should not be empty!" })
        }
    }

    const params = {
        TableName: 'Categories',
        Item: {
            categoryId: uuid(),
            category,
        }
    }

    try {
        const response = await dynamodb.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, message: "Category saved!" })
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
}

exports.getCategoriesHandler = async (event) => {
    const params = {
        TableName: 'Categories',
    }

    try {
        const response = await dynamodb.scan(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 200, message: response.Items })
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
}

exports.deleteCategoryHandler = async (event) => {
    const { categoryId } = event;

    if(!categoryId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ status: 400, message: "categoryId should not be empty!" })
        }
    } else {
        const params = {
            TableName: 'Categories',
            Key: {
                categoryId,
            }
        }

        try {
            const response = await dynamodb.delete(params).promise();
            return {
                statusCode: 200,
                body: JSON.stringify({ status: 200, message: "Category deleted!" })
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
    }
}