'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

exports.handler = async(event, context) => {

    const connectionId = event.requestContext.connectionId;
    const topic = JSON.parse(event.body).topic;

    if (!event) {
        return {
            statusCode: 400,
            body: "Bad request"
        };
    }

    const {
        TABLE_NAME
    } = process.env;

    var params = {
        TableName: TABLE_NAME,
        Item: {
            'c_id': connectionId,
            'topic': topic,
            'ttl': Math.floor(Date.now() / 1000) + 3600
        },
        ReturnValues: 'NONE'
    };

    try {
        const data = await docClient.put(params).promise();
        return {
            statusCode: 200,
            body: "Subscribed for: " + event
        };
    }
    catch (e) {
        console.log(e.stack);
        return {
            statusCode: 500,
            body: "Failed to Subscribe"
        };
    }
};
