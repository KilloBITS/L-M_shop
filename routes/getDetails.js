'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  return rand;
}

router.get('/*', function(req, res, next) {
  var languageSystem, langMenu, recomendedTovar = [];
  if (req.cookies.vernissageLang === undefined) {
    languageSystem = 0;
    langMenu = 'menu';
  } else {
    if (req.cookies.vernissageLang === 'ua') {
      languageSystem = 1;
      langMenu = 'menu-uk';
    } else {
      languageSystem = 0;
      langMenu = 'menu';
    }
  }

  var DA = req.url.split('=');
  var searchData = DA[1].split(',');

  mongoClient.connect(global.baseIP, function(err, client) {
    const db = client.db(global.baseName);
    const config = db.collection("config");
    const menu = db.collection(langMenu);
    const tovar = db.collection("tovar");
    const users_session = db.collection("users");
    const tovar_comments = db.collection("comments");

    if (err) return console.log(err);

    config.find().toArray(function(err, results_config) {
      if (results_config[languageSystem].opens) {
        menu.find().sort({ isEnded: 1 }).toArray(function(err, results_menu) {
          tovar.find({AI: parseInt(searchData)}).toArray(function(err, results_tovar) {
            tovar_comments.find({tovar_AI: parseInt(searchData)}).toArray(function(err, results_comments) {
              users_session.find({email: req.session.user}).toArray(function(err, results_users_session) {
                if (results_users_session.length > 0) {
                  var uSession = results_users_session;
                } else {
                  var uSession = false;
                }
                for (let i = 0; i < 3; i++) {
                  recomendedTovar.push(randomInteger(0, 20))
                }

                tovar.find({AI: {$in: recomendedTovar}}).limit(3).toArray(function(err, results_recTovar) {
                  res.render('details.ejs', {
                    conf: results_config[languageSystem],
                    menu: results_menu,
                    tovarArr: results_tovar,
                    comment: results_comments,
                    rec: results_recTovar,
                    sessionUser: req.session.user,
                    users_data: uSession,
                    isAdm: req.session.admin
                  })
                  client.close();
                });
              });
            });
          });
        });
      } else {
        res.render('close.ejs', {
          conf: results_config[languageSystem]
        })
      }
    });
  });
});

module.exports = router;
