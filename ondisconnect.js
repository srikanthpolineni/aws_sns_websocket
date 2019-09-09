'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});
exports.handler = async(event, context) => {

    const {
        TABLE_NAME
    } = process.env;

    const params = {
        TableName: TABLE_NAME,
        Key: {
            "connectionId": connectionId
        }
    };

    try {
        const data = await docClient.delete(params).promise();
        return {
            statusCode: 200,
            body: ''
        };
    }
    catch (e) {
       return {
            statusCode: 500,
            body: ''
        };
    }
};
