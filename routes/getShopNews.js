'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

router.get('/*', function (req, res, next) {
  try {
    var page = req.url.split('page=')[1];

    if (parseInt(page) === 1) {
      var otTovar = 0;
      var doTovar = 18;
    } else {
      var otTovar = 18 * (parseInt(page) - 1);
      var doTovar = otTovar + 18;
    }

    mongoClient.connect(global.baseIP, function (err, client) {
      const db = client.db(global.baseName);
      const locale = db.collection("LOCALE");
      const users = db.collection("USERS");
      const menu = db.collection("MENU");
      const tovar = db.collection("TOVAR");
      const news = db.collection("NEWS");
      const contacts = db.collection("CONTACTS");
      const config = db.collection("CONFIG");

      if (err) return console.log(err);

      locale.find().toArray(function (err, resLocale) {
        users.find({ email: (req.session.user === undefined) ? false : req.session.user }).toArray(function (err, resUsers) {
          menu.find().sort({ position: 1 }).toArray(function (err, resMenu) {
            tovar.find().sort({ AI: -1 }).toArray(function (err, resTovar) {
              config.find().toArray(function (err, resConfig) {
                news.find().toArray(function (err, resNews) {
                  contacts.find().toArray(function (err, resContacts) {
                    var current_page = page;
                    var paginator = new pagination.SearchPaginator({ prelink: '/shopNews?page=' + page, current: current_page, rowsPerPage: 18, totalResult: resTovar.length - 1 });
                    var p = paginator.getPaginationData();
                    let languageNumber = global.parseNumLang(req);
                    res.render('pages/tovar.ejs', {
                      isAdm: req.session.admin,
                      sessionUser: req.user,
                      locale: resLocale[languageNumber].tovar,
                      menu: resMenu,
                      globalLocale: resLocale[languageNumber],
                      contacts: resContacts[0],
                      numLang: languageNumber,
                      tovarArr: resTovar.slice(otTovar, doTovar),
                      offLength: resTovar.length,
                      isPage: page,
                      paginate: p,
                      config: resConfig[0],
                      currentDate: global.getDate()
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } catch (e) {
    res.redirect('/')
  }

});

module.exports = router;