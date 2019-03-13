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
    const noty = db.collection("NOTIFICATION");
    const users = db.collection("USERS");
    const locale = db.collection("LOCALE");

    if(err) return console.log(err);

    noty.find().toArray(function(err, resNoty){
      users.find({login: req.session.login}).toArray(function(err, resUsers){
        locale.find().toArray(function(err, resLocale){
          res.render('panel/local_panel.ejs',{                    
            sessionUser: resUsers[0],
            noty: resNoty,
            local: resLocale[0]
          });
        });
      }); 
    });    
  });      
});

module.exports = router;