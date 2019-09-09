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

    let message = JSON.parse(event.Records[0].Sns.Message);
   
    const topic = message.topic;
    const postData = message.data;
    let connectionData = await docClient.scan({
            TableName: TABLE_NAME,
            ProjectionExpression: "connectionId",
            FilterExpression: "topic = :topic",
            ExpressionAttributeValues: {
              ":topic": topic
            }
        }).promise();
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: CALL_BACK_URL
    });

    const postCalls = connectionData.Items.map(async({
        connectionId
    }) => {
        await apigwManagementApi.postToConnection({
                ConnectionId: connectionId,
                Data: postData
            }).promise();
    });

    await Promise.all(postCalls);
   
    return {
        statusCode: 200,
        body: 'Message Notified.'
    };

};
