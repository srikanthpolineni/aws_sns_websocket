'use strict';


const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});
exports.handler = async(event, context) => {

    const {
        TABLE_NAME,
        CALL_BACK_URL
    } = process.env;

    let message;
    try {
        message = JSON.parse(event.Records[0].Sns.Message);
    }
    catch (e) {
        console.log(e.stack);
        console.log('Recieved invalid event notification from SNS.');
        return;
    }
    const topic = message.topic;
    const postData = message.data;
    let connectionData;
    try {
        connectionData = await docClient.scan({
            TableName: TABLE_NAME,
            ProjectionExpression: "c_id",
            FilterExpression: "topic = :topic",
            ExpressionAttributeValues: {
              ":topic": topic
            }
        }).promise();

    }
    catch (e) {
        console.log(e.stack);
        return;
    }
    console.log(connectionData);
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: CALL_BACK_URL
    });

    const postCalls = connectionData.Items.map(async({
        c_id
    }) => {
        try {
            await apigwManagementApi.postToConnection({
                ConnectionId: c_id,
                Data: postData
            }).promise();
        }
        catch (e) {
            if (e.statusCode === 410) {
                console.log(`Found stale connection, deleting ${c_id}`);
                await docClient.delete({
                    TableName: TABLE_NAME,
                    Key: {
                        "c_id": c_id
                    }
                }).promise();
            }
            else {
                console.log(e.stack);
                throw e;
            }
        }
    });

    try {
        await Promise.all(postCalls);
    }
    catch (e) {
        return {
            statusCode: 500,
            body: e.stack
        };
    }

    return {
        statusCode: 200,
        body: 'Message Notified.'
    };

};
