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
      users.find({email: (req.session.user === undefined)?false:req.session.user}).toArray(function(err, resUsers){
        menu.find().sort({index: 1}).toArray(function(err, resMenu){
          contacts.find().toArray(function(err, resContacts){            
              config.find().toArray(function(err, resConfig){   
                console.log((req.session.user === undefined)?true:req.session.user)
                if((req.session.user === undefined)?true:false){
                  res.render('pages/auth.ejs',{
                    isAdm: req.session.admin,
                    sessionUser: resUsers[0],
                    locale: resLocale[0][global.parseLanguage(req)].login,
                    menu: resMenu,
                    globalLocale:  resLocale[0][global.parseLanguage(req)],
                    contacts: resContacts[0],
                    numLang: global.parseNumLang(req),
                    config: resConfig[0]
                  });     
                }else{
                  res.redirect('/profile');
                }        
                           
              });            
          });
        }); 
      }); 
    }); 
  });
});

module.exports = router;