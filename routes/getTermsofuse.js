'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

router.get('/', function(req, res, next){
  mongoClient.connect(global.baseIP, function(err, client){
    const db = client.db(global.baseName);
    const config = db.collection("CONFIG");
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const contacts = db.collection("CONTACTS");
    const discounts = db.collection("DISCOUNTS");
    const pad = db.collection("PAYMENTANDDELIVERY");

    if(err) return console.log(err);

    config.find().toArray(function(err, resConfig){
      locale.find().toArray(function(err, resLocale){
        users.find({login: req.session.login}).toArray(function(err, resUsers){
          menu.find().toArray(function(err, resMenu){
            contacts.find().toArray(function(err, resContacts){
              res.render('terms_of_use.ejs',{
                isAdm: req.session.admin,
                sessionUser: resUsers[0],
                locale: resLocale[0][global.parseLanguage(req)].payment,
                menu: resMenu[0][global.parseLanguage(req)],
                globalLocale:  resLocale[0][global.parseLanguage(req)],
                contacts: resContacts[0],
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

module.exports = router;