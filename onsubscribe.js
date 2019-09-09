'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});

exports.handler = async(event, context) => {

    const connectionId = event.requestContext.connectionId;
    const topic = JSON.parse(event.body).topic;

    const {
        TABLE_NAME
    } = process.env;

    var params = {
        TableName: TABLE_NAME,
        Item: {
            'connectionId': connectionId,
            'topic': topic
        },
        ReturnValues: 'NONE'
    };

    const data = await docClient.put(params).promise();
    return {
        statusCode: 200,
        body: "Subscribed for: " + event
    };
};
