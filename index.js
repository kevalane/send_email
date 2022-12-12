const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();

const sesConfig = {
    apiVersion: '2010-12-01',
    region: process.env.region,
}
const ses = new AWS.SES(sesConfig)

exports.handler =  async (event, context) => {
    const body = JSON.parse(event.body);
    const msg = "Hello World from Lambda & SES!";
    const html = "<p>Hello World from Lambda & SES using HTML</p>";
    const params = {
        Destination: {
            ToAddresses: [process.env.destination]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: html
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: msg
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: "HELLO WORLD"
            }
        },
        Source: process.env.destination,
        ReplyToAddresses: [
            body.replyAddress
        ]
    }
    await ses.sendEmail(params).promise().then((data) => {
        console.log(data)
        const response = {
            "statusCode": 200,
            "body": JSON.stringify(data),
            "isBase64Encoded": false
        };
        return response;
    }).catch((err) => {
        console.error(err)
      	const response = {
            "statusCode": 501,
            "body": JSON.stringify(err),
            "isBase64Encoded": false
        };
        return response;
    });
}
