const AWS = require('aws-sdk');
const sesConfig = {
    apiVersion: '2010-12-01',
    region: 'eu-central-1',
}
const ses = new AWS.SES(sesConfig)

exports.handler =  async (event, context) => {
    // const incomingMsg = JSON.parse(event.Records[0].body);
    const msg = "Hello World from Lambda & SES!";
    const html = "<p>Hello World from Lambda & SES using HTML</p>";
    const params = {
        Destination: {
            ToAddresses: ["kevin@jkmholding.com"]
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
        Source: "kevin@jkmholding.com",
        ReplyToAddresses: [
            "kevras.contact@gmail.com"
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
