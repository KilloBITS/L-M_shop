'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoClient = require("mongodb").MongoClient;

mongoose.connect(
  'mongodb://localhost:27017/SHOP',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }
);


const UsersSchema = require('./models/user');

const UserModel = mongoose.model('USERS', UsersSchema);

const parseLoginData = (email) => {
  return { email: email }
};

// 0 - successfull
// 2 - error activate account
// 1 - Incorrect username or password
passport.use(new LocalStrategy(
  { usernameField: "login", passwordField: "password" },
  function (login, password, done) {
    UserModel.findOne(parseLoginData(login), function (err, user) {
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { code: 1 });
      }

      if (user.password !== password) {
        return done(null, false, { code: 1 });
      }
      /* end */
      return done(null, user, { code: 0 });
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});


router.post('/auth', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (info.code === 0) {
      req.login(user, function (err) {
        if (err) { return next(err); }
        req.session.save(function () {
          res.send({
            code: 500
          });
        });
      });
    } else {
      res.send({ code: 450, message: 123321 });
    }
  })(req, res, next);
});


router.post('/create_accaunt', function (req, res, next) {
  var msg = ['Данный Email уже зарегистрирован', 'Такий Email уже існує'];
  if (req.cookies.vernissageLang === undefined) {
    var languageSystem = 0;
  } else {
    if (req.cookies.vernissageLang === 'ua') {
      var languageSystem = 1;
    } else {
      var languageSystem = 0;
    }
  }
  mongoClient.connect(global.baseIP, function (err, client) {
    const db = client.db(global.baseName);
    const users = db.collection("USERS");
    const LOGS = db.collection("LOGS");
    if (err) return console.log(err);

    users.find({ email: req.body.newEmail }).toArray(function (err, results_usersEmail) {
      if (results_usersEmail.length === 0) {
        users.find().sort({ AI: -1 }).limit(1).toArray(function (err, results_users) {

          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1;
          var yyyy = today.getFullYear();
          if (dd < 10) {
            dd = '0' + dd
          }
          if (mm < 10) {
            mm = '0' + mm
          }
          today = mm + '-' + dd + '-' + yyyy;

          var NEW_LOGS = {};
          NEW_LOGS.date = today;
          NEW_LOGS.type = 'Новый пользователь';
          NEW_LOGS.text = 'Зарегистрирован новый пользователь: ' + req.body.newEmail.split('@')[0];
          LOGS.insertOne(NEW_LOGS);

          var mainData = req.body;
          var NEXT_AI = results_users[0].AI + 1;
          var NEW_USER = {};
          NEW_USER.nick = req.body.newEmail.split('@')[0],
            NEW_USER.name = req.body.newName,
            NEW_USER.email = req.body.newEmail,
            NEW_USER.phone_number = null,
            NEW_USER.secret = null,
            NEW_USER.password = req.body.newPass,
            NEW_USER.rank = 0,
            NEW_USER.stars = 0,
            NEW_USER.AI = NEXT_AI,
            NEW_USER.isAdmin = false,
            NEW_USER.ava = "";
          NEW_USER.desires = [];
          NEW_USER.payments = [];
          NEW_USER.LM_COIN = 100;
          NEW_USER.regiter_date = today;
          NEW_USER.official = false;
          NEW_USER.blocked = false;
          NEW_USER.isPartner = false;
          users.insertOne(NEW_USER);
          req.session.user = req.body.newEmail;
          req.session.admin = false;
          global.online = global.online + 1;

          global.notification('Новый пользователь: ' + req.body.newName, today, 'register');
          res.send({ code: 500 });
        });
      } else {
        res.send({ code: 450, message: msg[languageSystem] })
      }
    });
  });
});

module.exports = router;
