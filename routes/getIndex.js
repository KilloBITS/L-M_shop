const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/', function (req, res, next) {
  mongoClient.connect(global.baseIP, function (err, client) {
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const mainslide = db.collection("MAINSLIDE");
    const tovar = db.collection("TOVAR");
    const news = db.collection("NEWS");
    const contacts = db.collection("CONTACTS");
    const config = db.collection("CONFIG");
    const reviews = db.collection("REVIEWS");
    const voting = db.collection("VOTING");


    if (err) return console.log(err);
    locale.find().toArray(function (err, resLocale) {
      users.find({ email: (req.session.user === undefined) ? false : req.session.user }).toArray(function (err, resUsers) {
        menu.find().sort({ position: 1 }).toArray(function (err, resMenu) {
          mainslide.find().toArray(function (err, resMainslide) {
            tovar.find().sort({ AI: -1 }).limit(10).toArray(function (err, resTovar) {
              news.find().sort({ AI: -1 }).limit(6).toArray(function (err, resNews) {
                contacts.find().toArray(function (err, resContacts) {
                  config.find().toArray(function (err, resConfig) {
                    reviews.find().limit(20).toArray(function (err, resReviews) {
                      let languageNumber = global.parseNumLang(req);
                      res.render('pages/index.ejs', {
                        isAdm: req.session.admin,
                        sessionUser: req.user,
                        locale: resLocale[languageNumber].index,
                        menu: resMenu,
                        globalLocale: resLocale[languageNumber],
                        contacts: resContacts[0],
                        numLang: languageNumber,
                        /*Только для индекса*/
                        slides: resMainslide,
                        newtovar: resTovar,
                        news: resNews,
                        config: resConfig[0],
                        reviewsSlide: resReviews
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;