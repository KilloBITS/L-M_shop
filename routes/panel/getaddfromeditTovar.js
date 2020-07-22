'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');
const isSession = require('../../beans/session');
router.use(cookieParser());

router.get('/*', function (req, res, next) {
  if (!new isSession(req).login && !new isSession(req).admin) {
    res.redirect('/');
    return false
  }
  mongoClient.connect(global.baseIP, { useNewUrlParser: true }, function (err, client) {
    const db = client.db(global.baseName);
    const noty = db.collection("NOTIFICATION");
    const tovar = db.collection("TOVAR");
    const config = db.collection("CONFIG");
    const manufacturers = db.collection("MANUFACTURERS");
    const message = db.collection("MESSAGE");

    if (err) return console.log(err);

    noty.find().toArray(function (err, resNoty) {
      message.find({ availability: false }).toArray(function (err, resMessage) {
        config.find().toArray(function (err, resConf) {
          manufacturers.find().toArray(function (err, resMan) {
            if (req.url.split('mode=')[1].split(',')[0] === 'edit') {
              tovar.find({ AI: parseInt(req.url.split('mode=')[1].split(',')[1]) }).toArray(function (err, resTovar) {
                res.render('panel/addTovar_panel.ejs', {
                  sessionUser: req.user,
                  noty: resNoty,
                  tovarData: resTovar[0],
                  editMode: true,
                  config: resConf[0],
                  man: resMan,
                  msg: resMessage
                });
              });
            } else {
              res.render('panel/addTovar_panel.ejs', {
                sessionUser: req.user,
                noty: resNoty,
                editMode: false,
                config: resConf[0],
                man: resMan,
                msg: resMessage
              });
            }
          });
        });
      });

    });
  });
});

module.exports = router;