//This function been invoked when the socket connected.

'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10'
});
exports.handler = async(event, context) => {

    //console.log(event);
    //const { access_token } = event.queryStringParameters;
    const connectionId = event.requestContext.connectionId;
    console.log(`Connection requested for ${connectionId}`);
    //console.log(`access_token: ${access_token}`);

    if (!connectionId) {
        console.log('Invalid connectionId received.');
        return {
            statusCode: 400,
            body: ''
        };
    }

    //TODO: Authorization logic

    return {
        statusCode: 200,
        body: "Successfully connected"
    };

};
