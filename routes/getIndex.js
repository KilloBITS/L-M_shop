'use strict';
const express = require('express');
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const cookieParser = require('cookie-parser');
const geoip = require('geoip-lite');

router.use(cookieParser());

router.get('/', function(req, res, next){
  mongoClient.connect(global.baseIP,{ useNewUrlParser: true }, function(err, client){
    const db = client.db(global.baseName);
    const locale = db.collection("LOCALE");
    const users = db.collection("USERS");
    const menu = db.collection("MENU");
    const mainslide = db.collection("MAINSLIDE");
    const tovar = db.collection("TOVAR");
    const news = db.collection("NEWS");
    const contacts = db.collection("CONTACTS");

    if(err) return console.log(err);

    locale.find().toArray(function(err, resLocale){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        menu.find().sort({index: 1}).toArray(function(err, resMenu){
          mainslide.find().toArray(function(err, resMainslide){
            tovar.find().sort({AI: -1}).limit(18).toArray(function(err, resTovar){
              news.find().sort({AI: -1}).limit(6).toArray(function(err, resNews){
                contacts.find().toArray(function(err, resContacts){
                  res.render('index.ejs',{
                    isAdm: req.session.admin,
                    sessionUser: resUsers[0],
                    locale: resLocale[0][global.parseLanguage(req)].index,
                    menu: resMenu,
                    globalLocale:  resLocale[0][global.parseLanguage(req)],
                    contacts: resContacts[0],
                    numLang: global.parseNumLang(req),
                    /*Только для индекса*/
                    slides: resMainslide,
                    newtovar: resTovar,
                    news: resNews
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