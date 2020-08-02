'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function (req, res, next) {
  mongoClient.connect(global.baseIP, function (err, client) {
    const db = client.db(global.baseName);
    const config = db.collection("CONFIG");
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const contacts = db.collection("CONTACTS");
    const parrtners = db.collection("PARTNERS");

    if (err) return console.log(err);
    config.find().toArray(function (err, resConfig) {
      locale.find().toArray(function (err, resLocale) {
        users.find({ email: (req.session.user === undefined) ? false : req.session.user }).toArray(function (err, resUsers) {
          menu.find().sort({ position: 1 }).toArray(function (err, resMenu) {
            contacts.find().toArray(function (err, resContacts) {
              parrtners.find().toArray(function (err, resPartners) {
                let languageNumber = global.parseNumLang(req);
                res.render('pages/contacts.ejs', {
                  isAdm: req.session.admin,
                  sessionUser: req.user,
                  locale: resLocale[languageNumber].contacts,
                  menu: resMenu,
                  globalLocale: resLocale[languageNumber],
                  contacts: resContacts[0],
                  partners: resPartners,
                  numLang: languageNumber,
                  config: resConfig[0],
                });
              });
            });
          });
        });
      });
    })

  });
});

module.exports = router;
