'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');
const isSession = require('../../beans/session');
router.use(cookieParser());

router.get('/', function (req, res, next) {
  if (!new isSession(req).login && !new isSession(req).admin) {
    res.redirect('/');
    return false
  }
  mongoClient.connect(global.baseIP, { useNewUrlParser: true }, function (err, client) {
    const db = client.db(global.baseName);
    const noty = db.collection("NOTIFICATION");
    const message = db.collection("MESSAGE");
    const users = db.collection("USERS");

    if (err) return console.log(err);

    noty.find().toArray(function (err, resNoty) {
      message.find({ availability: false }).toArray(function (err, resMessage) {
        users.find().sort({ isAdmin: -1 }).toArray(function (err, resUsersArr) {
          res.render('panel/users_panel.ejs', {
            sessionUser: req.user,
            noty: resNoty,
            userData: resUsersArr,
            msg: resMessage
          });
        });
      });
    });
  });
});

module.exports = router;