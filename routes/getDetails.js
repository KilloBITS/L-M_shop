'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/*', function(req, res, next) {
  var languageSystem, langMenu;

  if(req.cookies.pageLang === undefined){
    languageSystem = "locale";
    langMenu = "menu";
  }else{
    if(req.cookies.pageLang === 'ua'){
      languageSystem = "locale-ua";
      langMenu = "menu-ua";
    }else{
      languageSystem = "locale";
      langMenu = "menu";
    }
  }

  var DA = req.url.split('=');
  var searchData = DA[1].split('&');

  mongoClient.connect(global.baseIP, function(err, client) {
    const db = client.db(global.baseName);
    const config = db.collection("config");
    const menu = db.collection(langMenu);
    const tovar = db.collection("tovar");
    const tovar_uk = db.collection("tovar-uk");
    const users_session = db.collection("users");
    const tovar_comments = db.collection("comments");

    if (err) return console.log(err);

    config.find().toArray(function(err, results_config) {
      if (results_config[0].opens) {
        menu.find().sort({ index: 1 }).toArray(function(err, results_menu) {
          tovar.find({ AI: parseInt(searchData[0]), types: searchData[1] }).toArray(function(err, results_tovar) {
            console.log(searchData[0])
            console.log(results_tovar)
            tovar_comments.find({tovar_AI: parseInt(results_tovar[0].AI)}).toArray(function(err, results_comments) {
              users_session.find({email: req.session.user}).toArray(function(err, results_users_session) {
                if (results_users_session.length > 0) {
                  var uSession = results_users_session;
                } else {
                  var uSession = false;
                }

                tovar.aggregate([{$sample: {size: 3}}]).toArray(function(err, results_recTovar) {

                  tovar.update({ AI: parseInt(searchData[0]) }, {$set : {visual: parseInt(results_tovar[0].visual) + 1} })
                  tovar_uk.update({ AI: parseInt(searchData[0]) }, {$set : {visual: parseInt(results_tovar[0].visual) + 1} })

                  res.render('details.ejs', {
                    conf: results_config[0],
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
          conf: results_config[0]
        })
      }
    });
  });
});

module.exports = router;
