import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAZS44T5LDWNXFFJH5',
    secretAccessKey: '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',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default dynamodb;