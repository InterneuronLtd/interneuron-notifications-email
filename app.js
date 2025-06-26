
// import dotenv 
const serverless = require('serverless-http'); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Enable CORS
app.use(cors());

// Configure body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('dotenv').config();

// import AWS SDK
const AWS = require('aws-sdk');

// A route that we can test with
//app.get("/", (req, res) => {
  app.get("/api/ping", (req, res) => {
    res.send({ message: "pinged" });
  });

app.get('/', (req, res) => {

  console.log("Message = " + req.query.message);
    console.log("EmailID = " + req.query.email);
    console.log("Subject = " + req.query.subject);

    var params = {
      Source: 'SOURCE_EMAIL',
      Destination: {
        ToAddresses: [
          req.query.email
        ]
      },
      ReplyToAddresses: [
        'SOURCE_EMAIL',
      ],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: req.query.message
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: req.query.subject
        }
      }
    };

    // Amazon SES configuration
const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
};


new AWS.SES(SESConfig).sendEmail(params).promise().then((res) => {
  console.log(res);
});

});


app.post('/', (req, res) => {

  console.log("Message = " + req.body.message);
    console.log("EmailID = " + req.body.email);
    console.log("Subject = " + req.body.subject);

    var params = {
      Source: 'SOURCE_EMAIL',
      Destination: {
        ToAddresses: [
          req.body.email
        ]
      },
      ReplyToAddresses: [
        'SOURCE_EMAIL',
      ],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: req.body.message
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: req.body.subject
        }
      }
    };

// Amazon SES configuration
const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
};


new AWS.SES(SESConfig).sendEmail(params).promise().then((res) => {
  console.log(res);
});

});

// app.listen(3000, () => console.log('SMS Service Listening on PORT 3000'))
module.exports.handler = serverless(app);
