'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function (req, res, next) {
  mongoClient.connect(global.baseIP, function (err, client) {
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const contacts = db.collection("CONTACTS");
    const discounts = db.collection("DISCOUNTS");
    const config = db.collection("CONFIG");

    if (err) return console.log(err);

    locale.find().toArray(function (err, resLocale) {
      users.find({ email: (req.session.user === undefined) ? false : req.session.user }).toArray(function (err, resUsers) {
        menu.find().sort({ position: 1 }).toArray(function (err, resMenu) {
          contacts.find().toArray(function (err, resContacts) {
            config.find().toArray(function (err, resConfig) {
              let languageNumber = global.parseNumLang(req);
              if ((req.session.user === undefined) ? true : false) {
                res.render('pages/auth.ejs', {
                  isAdm: req.session.admin,
                  sessionUser: req.user,
                  locale: resLocale[languageNumber].login,
                  menu: resMenu,
                  globalLocale: resLocale[languageNumber],
                  contacts: resContacts[0],
                  numLang: languageNumber,
                  config: resConfig[0]
                });
              } else {
                res.redirect('/profile');
              }
            });
          });
        });
      });
    });
  });
});

module.exports = router;