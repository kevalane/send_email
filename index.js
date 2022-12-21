const AWS = require('aws-sdk');
const dotenv = require('dotenv').config();

const sesConfig = {
    apiVersion: '2010-12-01',
    region: process.env.region,
}
const ses = new AWS.SES(sesConfig)

exports.handler =  async (event, context) => {
    let body = {};
    try {
        body = JSON.parse(event.body);
    } catch (err) {
        console.error(err);
        const response = {
            "statusCode": 400,
            "body": JSON.stringify(err),
            "isBase64Encoded": false,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
        return response;
    }
    let subject = "";
    if (body.type == 'booking') {
        subject = "Inquiry from Booking Form on fouclub.com";
    } else if (body.type == 'events') {
        subject = "Inquiry from Events Form on fouclub.com";
    } else if (body.type == 'lost') {
        subject = "Inquiry from Lost & Found Form on fouclub.com";
    } else {
        return {
            "statusCode": 400,
            "body": JSON.stringify({message: "Invalid type"}),
            "isBase64Encoded": false,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        }
    }

    let msg = "Contact Information:\n\nName: " + body.firstName + " " + body.lastName + "\n\n" + "Email: " + body.email + "\n\n";
    msg += "Phone: " + body.phone + "\n\n\n" + "Booking Information:\n\nGuests: " + body.guests + "\n\nDate of interest: " + body.date + "\n\n";
    msg += "Message: " + body.message + "\n";

    // HTML version of the message
    let html = "Contact Information:<br><br>Name: " + body.firstName + " " + body.lastName + "<br><br>" + "Email: " + body.email + "<br><br>";
    html += "Phone: " + body.phone + "<br><br><br>" + "Booking Information:<br><br>Guests: " + body.guests + "<br><br>Date of interest: " + body.date + "<br><br>";
    html += "Message: " + body.message + "<br>";
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
                Data: subject
            }
        },
        Source: process.env.destination,
        ReplyToAddresses: [
            body.email
        ]
    }
    await ses.sendEmail(params).promise().then(data => {
        const response = {
            "statusCode": 200,
            "body": JSON.stringify({message: "Message sent successfully"}),
            "isBase64Encoded": false,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
        return response;
    }).catch(err => {
        console.error(err);
        const response = {
            "statusCode": 400,
            "body": JSON.stringify(err),
            "isBase64Encoded": false,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
        };
        return response;
    });
}
