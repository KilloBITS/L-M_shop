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
    const config = db.collection("CONFIG");
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const contacts = db.collection("CONTACTS");
    const parrtners = db.collection("PARTNERS");

    if(err) return console.log(err);
    config.find().toArray(function(err, resConfig){
      locale.find().toArray(function(err, resLocale){
        users.find({email: (req.session.user === undefined)?false:req.session.user}).toArray(function(err, resUsers){
          menu.find().sort({index: 1}).toArray(function(err, resMenu){
            contacts.find().toArray(function(err, resContacts){
              parrtners.find().toArray(function(err, resPartners){
                res.render('contacts.ejs',{
                  isAdm: req.session.admin,
                  sessionUser: resUsers[0],
                  locale: resLocale[0][global.parseLanguage(req)].contacts,
                  menu: resMenu,
                  globalLocale:  resLocale[0][global.parseLanguage(req)],
                  contacts: resContacts[0],
                  partners: resPartners,
                  numLang: numLangs,
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
