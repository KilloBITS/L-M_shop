'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function(req, res, next){
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const contacts = db.collection("CONTACTS");
    const discounts = db.collection("DISCOUNTS");
    const config = db.collection("CONFIG");


    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        menu.find().sort({index: 1}).toArray(function(err, resMenu){
          contacts.find().toArray(function(err, resContacts){
            discounts.find({status: true}).toArray(function(err, resDiscounts){
              config.find().toArray(function(err, resConfig){ 
                res.render('discounts_and_promotions.ejs',{
                  isAdm: req.session.admin,
                  sessionUser: resUsers[0],
                  locale: resLocale[0][global.parseLanguage(req)].discounts,
                  menu: resMenu,
                  globalLocale:  resLocale[0][global.parseLanguage(req)],
                  contacts: resContacts[0],
                  discounts: resDiscounts,
                  numLang: global.parseNumLang(req),
                  config: resConfig[0]
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
