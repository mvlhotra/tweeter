require('dotenv').config();

// Basic express setup:

//const PORT = 8080;
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const app = express();
const MongoClient = require('mongodb').MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;

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
  app.use(cookieSession({ name: 'session', keys: ['12345'] }));

  app.set('view engine', 'ejs');

  app.get('/register', (req, res) => {
    res.render('urls_register');
  });

  app.post('/register', (req, res) => {
    const user = {
      user: req.body.user,
      name: req.body.name,
      password: req.body.password
    };

    DataHelpers.registerUser(user, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }

    });
    res.redirect('/');
  });

  app.get('/', (req, res) => {
    res.render('index.ejs');
  });

  app.get('/login', (req, res) => {
    if (req.session.user !== undefined) {
      res.redirect('/');
    } else {
      const templateVars = {
        user: users[req.session.user_id]
      };
      res.render('urls_login', templateVars);
    }
  });

  app.post('/login', (req, res) => {
    DataHelpers.getUser('mvlhotra', "coff33", (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        req.session.user = user;

        res.redirect('/');
      }
    });
  });

  app.post('/logout', (req, res) => {
    console.log("u logged tf out");
  });
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening...`);
});


