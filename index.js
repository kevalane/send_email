const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();

const sesConfig = {
    apiVersion: '2010-12-01',
    region: process.env.region,
}
const ses = new AWS.SES(sesConfig)

exports.handler =  async (event, context) => {
    console.log(event.body);
    let body = {};
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        console.error(err);
        const response = {
            "statusCode": 400,
            "body": JSON.stringify(err),
            "isBase64Encoded": false
        };
        return response;
    }
    let msg = "Namne: " + body.firstName + " " + body.lastName + "\n" + "Email: " + body.email + "\n";
    msg += "Phone: " + body.phone + "\n" + "Guests: " + body.guests + "\nDate of interest: " + body.date + "\n";
    msg += "Message: " + body.message + "\n";
    let html = "Namne: " + body.firstName + " " + body.lastName + "<br>" + "Email: " + body.email + "<br>";
    msg += "Phone: " + body.phone + "<br>" + "Guests: " + body.guests + "<br>Date of interest: " + body.date + "<br>";
    msg += "Message: " + body.message + "<br>";
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
                Data: "New message from " + body.firstName + " " + body.lastName
            }
        },
        Source: process.env.destination,
        ReplyToAddresses: [
            body.email
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
