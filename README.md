## AWS Lambda send email function using AWS SES

A simple Lambda function to send an email, e.g., for standalone contact forms on a static website.

## AWS Config

1. Set up an IAM with `AmazonSESFullAccess` and `AWSLambdaBasicExecutionRole`
2. Get a domain/email verified in AWS SES (get out of sandbox too, contact support)
3. Create lambda function with IAM role
4. Open lambda to URL call, configure CORS etc., in accordance with your needs.

## Deploy

Call `zip -r deploy.zip ./` whilst in root directory to zip all files. Thereafter, upload to aws lambda and deploy.
