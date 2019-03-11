'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function(req, res, next){
  switch(req.cookies.pageLang){
    case 'ru': var numLangs = 0 ;break;
    case 'ua': var numLangs = 1 ;break;
    case 'en': var numLangs = 2 ;break;
    default: var numLangs = 0;
  }
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const contacts = db.collection("CONTACTS");
    const discounts = db.collection("DISCOUNTS");

    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        menu.find().toArray(function(err, resMenu){
          contacts.find().toArray(function(err, resContacts){
            discounts.find({status: true}).toArray(function(err, resDiscounts){
              res.render('discounts_and_promotions.ejs',{
                isAdm: req.session.admin,
                sessionUser: resUsers[0],
                locale: resLocale[0][global.parseLanguage(req)].discounts,
                menu: resMenu[0][global.parseLanguage(req)],
                globalLocale:  resLocale[0][global.parseLanguage(req)],
                contacts: resContacts[0],
                discounts: resDiscounts,
                numLang: numLangs
              });
            });
          });
        }); 
      }); 
    }); 
  });
});

module.exports = router;
