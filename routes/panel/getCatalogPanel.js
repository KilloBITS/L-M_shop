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
    const tovar = db.collection("TOVAR");
    const manufacturers = db.collection("MANUFACTURERS");
    const config = db.collection("CONFIG");
    const message = db.collection("MESSAGE");

    if (err) return console.log(err);

    noty.find().toArray(function (err, resNoty) {
      message.find({ availability: false }).toArray(function (err, resMessage) {
        tovar.find().limit(200).toArray(function (err, resTovar) {
          manufacturers.find().toArray(function (err, resMan) {
            config.find().toArray(function (err, resConf) {
              res.render('panel/catalog_panel.ejs', {
                sessionUser: req.user,
                noty: resNoty,
                tovarData: resTovar,
                manufactures: resMan,
                config: resConf[0],
                msg: resMessage
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;