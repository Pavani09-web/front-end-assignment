#!/usr/bin/env node

'use strict'

/**
 * Dependencies
 */

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


/**
 * Constants
 */

const PORT = process.env.PORT || '7001';
const DIST = path.join(process.env.PWD, (process.env.NODE_ENV === 'test') ? 'test' : 'dist');

const FORM_DATA = [
  {
    "name": "nameFirst",
    "value": "Jane"
  },
  {
    "name": "nameLast",
    "value": "Doe"
  },
  {
    "name": "contactPhone",
    "value": "9999999999"
  },
  {
    "name": "contactEmail",
    "value": "jd@email.com"
  },
  {
    "name": "contactPreferred",
    "value": "phone"
  }
];

/**
 * The Express App
 */

let app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/*', (request, resolve) => {
  let req = request.params[0];

  let page = (req === '')
    ? 'index.html' : (req.includes('.'))
      ? req : `${req}.html`;

  resolve.sendFile(`${DIST}/${page}`);
});

app.post('/submitForm', (request, response) => {
  var submission = request.body;
  console.log(submission)
  var res = {};

  if (JSON.stringify(submission) === JSON.stringify(FORM_DATA)) {
    response.json({ message: 'Thank you for your submission.'});
  } else {
    response.statusCode = 404;
    response.json({ message: 'Your submission is invalid, please try again.'});
  }
});

app.listen(PORT, () => {
  console.log(`ENV: ${process.env.NODE_ENV}`);

  console.log(`Running @ http://localhost:${PORT}`);
})
