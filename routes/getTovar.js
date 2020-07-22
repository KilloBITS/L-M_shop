'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const pagination = require('pagination');

router.get('/*', function (req, res, next) {

  
  try {
    var searchData;
    var DA = req.url.split('=');

    if (DA[0] !== "/") {
      searchData = DA[1].split(',');
    }

    var page = req.url.split('page=')[1];

    // let FILTER = { $or: [ { categories: parseInt(searchData[0]) }, { categories: searchData[0] } ] }

    let FILTER = {
      categories: parseInt(searchData[0])
    };

    if (searchData.length >= 2) {
      FILTER.type = searchData[1].split('&')[0];
    };

    mongoClient.connect(global.baseIP, function (err, client) {
      const db = client.db(global.baseName);
      const locale = db.collection("LOCALE");
      const users = db.collection("USERS");
      const menu = db.collection("MENU");
      const tovar = db.collection("TOVAR");
      const contacts = db.collection("CONTACTS");
      const config = db.collection("CONFIG");
      const manufacturers = db.collection("MANUFACTURERS");

      if (err) return console.log(err);
      let countsTovar = tovar.find(FILTER).count();

      countsTovar.then(counts => {
        if (parseInt(page) === 1) {
          var otTovar = 0;
          var doTovar = 18;
        } else {
          var otTovar = 18 * (parseInt(page) - 1);
          var doTovar = otTovar + 18;
        }

        // tovar.find().forEach( function (x) {   
        //   x.categories = parseInt(x.categories); // convert field to string
        //   tovar.save(x);
        // });

        locale.find().toArray(function (err, resLocale) {
          users.find({ email: (req.session.user === undefined) ? false : req.session.user }).toArray(function (err, resUsers) {
            menu.find().sort({ isEnded: 1 }).toArray(function (err, resMenu) {
              tovar.find(FILTER).sort({ AI: -1 }).skip((counts >= 18) ? doTovar : 0).limit(18).toArray(function (err, resTovar) {
                config.find().toArray(function (err, resConfig) {
                  manufacturers.find().toArray(function (err, resManufacturers) {
                    contacts.find().toArray(function (err, resContacts) {
                      let languageNumber = global.parseNumLang(req);
                      var current_page = page;
                      var paginator = new pagination.SearchPaginator({ prelink: '/shop?c=' + searchData[0] + ',' + searchData[1].split('&')[0], current: current_page, rowsPerPage: 18, totalResult: counts - 1 });
                      var p = paginator.getPaginationData();
                      res.render('pages/tovar.ejs', {
                        filter: FILTER,
                        isAdm: req.session.admin,
                        sessionUser: req.user,
                        locale: resLocale[languageNumber].tovar,
                        menu: resMenu,
                        globalLocale: resLocale[languageNumber],
                        contacts: resContacts[0],
                        numLang: languageNumber,
                        tovarArr: resTovar,
                        offLength: counts,
                        isPage: page,
                        paginate: p,
                        config: resConfig[0],
                        currentDate: global.getDate(),
                        filters: {
                          manufacturers: resManufacturers,
                          sizes: [
                            'XS',
                            'S',
                            'M',
                            'L',
                            'XL',
                            'XXL',
                            'XXXL',
                            'S/M',
                            'M/L'
                          ]
                        }
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
  } catch (e) {
    res.redirect('/')
  }

});

module.exports = router;