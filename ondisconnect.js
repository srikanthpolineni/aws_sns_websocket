//This function been invoked when the socket disconnected.
'use strict';


const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});
exports.handler = async(event, context) => {

    const connectionId = event.requestContext.connectionId;
    console.log(`Disconnect requested for ${connectionId}`);

    if (!connectionId) {
        console.log('Invalid connectionId received.');
        return {
            statusCode: 500,
            body: ''
        };
    }

    const {
        TABLE_NAME
    } = process.env;

    const params = {
        TableName: TABLE_NAME,
        Key: {
            "c_id": connectionId
        }
    };

    try {
        const data = await docClient.delete(params).promise();
        console.log(`${connectionId} deleted form DynamoDB.`)
        return {
            statusCode: 200,
            body: ''
        };
    }
    catch (e) {
        console.log(`${connectionId} delete failed.`, e.stack);
        return {
            statusCode: 500,
            body: ''
        };
    }
};
