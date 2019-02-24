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
    const templateVars = {
      user: req.session.user
    }
    res.render('urls_register', templateVars);

  });

  app.post('/register', (req, res) => {
    const user = {
      user: req.body.username,
      name: `${req.body.first} ${req.body.last}`,
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
    const templateVars = {
      user: req.session.user
    }
    res.render('index.ejs', templateVars);
  });

  app.get('/login', (req, res) => {
    const templateVars = {
      user: req.session.user,
      error: false
    }
    if (req.session.user !== undefined) {
      res.redirect('/');
    } else {
      res.render('urls_login', templateVars);
    }
  });

  app.post('/login', (req, res) => {
    const templateVars = {
      user: req.session.user,
      error: true
    }
    DataHelpers.getUser(req.body.username, req.body.password, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        if (user.length !== 0) {
          req.session.user = user;
          res.redirect('/');
        } else {
          res.render('urls_login', templateVars)
        }
      }
    });
  });

  app.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening...`);
});


