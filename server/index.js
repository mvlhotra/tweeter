// Basic express setup:
require('dotenv').config();

const PORT = 8080;
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const { MongoClient } = require('mongodb');

const { MONGODB_URI } = process.env.MONGODB_URI;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

MongoClient.connect(MONGODB_URI, (err, mongo) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  const DataHelpers = require('./lib/data-helpers.js')(mongo);
  const tweetsRoutes = require('./routes/tweets')(DataHelpers);
  app.use('/tweets', tweetsRoutes);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
